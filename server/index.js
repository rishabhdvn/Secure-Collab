import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import fs from 'fs';
import { spawn } from 'child_process';
import cors from 'cors';
import path from 'path';
import os from 'os';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Load environment variables
dotenv.config();

// Set server port
const PORT = process.env.PORT || 3001;

// Initialize Express app and middleware
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const server = http.createServer(app);
const io = new Server(server);

// Map to store user socket connections
const userSocketMap = {};

// Create temp_code directory if it doesn't exist
const TEMP_DIR = path.join(os.tmpdir(), 'code_bridge_temp');
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
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        // Notify all clients in the room about the new join
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit("joined", {
                clients,
                username,
                socketId: socket.id
            });
        });
    });

    // Handle real-time code changes
    socket.on("code-change", ({ roomId, code }) => {
        socket.in(roomId).emit("code-change", { code });
    });

    // Handle user disconnection
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit("disconnected", {
                socketId: socket.id,
                username: userSocketMap[socket.id]
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });

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

// Helper function to get all connected clients in a room
const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId]
        };
    });
};

// Compile endpoint
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

        // Configure and start Docker container
        const dockerImage = `codebridge-${language}`;
        const dockerProcess = spawn('sudo', [
            'docker',
            'run',
            '-i',
            '--rm',
            '--network=none',
            '-v',
            `${TEMP_DIR}:/code`,
            '--workdir',
            '/code',
            dockerImage
        ])
        .on('error', (err) => {
            console.error('Docker spawn failed:', err);
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.emit('program-output', {
                    output: 'Error: Compilation service temporarily unavailable\n'
                });
            }
        });

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
