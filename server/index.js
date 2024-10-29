import express from 'express';
import http from 'http';
import { Server } from 'socket.io'
import dotenv from 'dotenv';
import fs from 'fs';
import { exec, spawn } from "child_process";
import cors from 'cors';
import path from 'path';
import os from 'os';

// Load environment variables
dotenv.config();

// Initialize Express app and middleware
const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

// Map to store user socket connections
const userSockerMap = {}

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSockerMap[socketId]
        }
    });
}

// Set server port
const PORT = process.env.PORT || 3001;

// Create temp_code directory if it doesn't exist
const TEMP_DIR = path.join(process.cwd(), 'temp_code');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

// Clean the directory at startup
const cleanTempDirectory = () => {
    try {
        const files = fs.readdirSync(TEMP_DIR);
        for (const file of files) {
            const filePath = path.join(TEMP_DIR, file);
            fs.unlinkSync(filePath);
            console.log(`Cleaned up file: ${filePath}`);
        }
    } catch (err) {
        console.error('Error cleaning temp directory:', err);
    }
};

// Clean the directory at startup
cleanTempDirectory();

// Socket.io connection handling
io.on("connection", (socket) => {
    // Handle user joining a room
    socket.on("join", ({ roomId, username }) => {
        userSockerMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        // Notify all clients in the room about the new join
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit("joined", {
                clients,
                username,
                socketId: socket.id
            });
        })
        console.log(clients)
    })

    // Handle real-time code changes
    socket.on("code-change", ({ roomId, code }) => {
        socket.in(roomId).emit("code-change", { code })
    })

    // Handle code synchronization between clients
    socket.on("sync-code", ({ socketId, code }) => {
        socket.to(socketId).emit("code-change", { code })
    })

    // Handle user disconnection
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit("disconnected", {
                socketId: socket.id,
                username: userSockerMap[socket.id]
            })
        })
        delete userSockerMap[socket.id];
        socket.leave();
    })

    // Handle program input from user
    socket.on("program-input", (input) => {
        if (socket.dockerProcess) {
            socket.dockerProcess.stdin.write(input + '\n');

            socket.emit('program-output', {
                output: ''
            });
        }
    });

    // Clean up docker process on disconnect
    socket.on("disconnect", () => {
        if (socket.dockerProcess) {
            socket.dockerProcess.kill();
        }
    });
});


app.post('/compile', async (req, res) => {
    try {
        let { code, language, socketId } = req.body;
        console.log('Received compile request:', { language, socketId });
        
        // Validate required fields
        if (!code || !language || !socketId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Sanitize and validate language
        language = language.toLowerCase();
        const allowedLanguages = ['python', 'cpp', 'java'];
        if (!allowedLanguages.includes(language)) {
            return res.status(400).json({ error: 'Unsupported language' });
        }

        // Define file names for different languages
        const fileNames = {
            python: ['Main.py'],
            cpp: ['Main.cpp', 'a.out'],
            java: ['Main.java', 'Main.class']
        };
        const filesToCleanup = fileNames[language];
        const fileName = filesToCleanup[0];
        
        // Clean the temp directory before writing new file
        cleanTempDirectory();
        
        // Write code to file in temp_code directory
        const filePath = path.join(TEMP_DIR, fileName);
        fs.writeFileSync(filePath, code);

        // Configure and start Docker container with updated mount path
        const dockerImage = `codebridge-${language}`;
        const dockerProcess = spawn('docker', [
            'run',
            '-i',       
            '--rm',         
            '--network=none', 
            '--memory=512m',  
            '--cpus=1',       
            '-v',
            `${TEMP_DIR}:/code`,
            '--workdir',
            '/code',
            dockerImage
        ]);

        // Send initial response
        res.json({ status: 'started', socketId });

        // Handle program output
        dockerProcess.stdout.on('data', (data) => {
            console.log('Program output:', data.toString());
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.emit('program-output', {
                    output: data.toString()
                });
            } else {
                console.log('Socket not found for ID:', socketId);
            }
        });

        // Handle program errors
        dockerProcess.stderr.on('data', (data) => {
            console.log('Program error:', data.toString());
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.emit('program-output', {
                    output: data.toString()
                });
            }
        });

        // Clean up files after process exits
        dockerProcess.on('exit', (code) => {
            console.log(`Docker process exited with code ${code}`);
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.emit('program-output', {
                    output: '\n***********Execution Complete***********\n'
                });
            }
            
            filesToCleanup.forEach(file => {
                try {
                    const fileToDelete = path.join(TEMP_DIR, file);
                    if (fs.existsSync(fileToDelete)) {
                        fs.unlinkSync(fileToDelete);
                        console.log(`Cleaned up file: ${fileToDelete}`);
                    }
                } catch (err) {
                    console.error(`Error cleaning up file ${file}:`, err);
                }
            });
        });

        // Store docker process reference in socket
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
            socket.dockerProcess = dockerProcess;
        } else {
            dockerProcess.kill();
        }
        
    } catch (error) {
        console.error('Compilation error:', error);
        res.status(500).json({ error: 'Internal server error during compilation' });
    }
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
