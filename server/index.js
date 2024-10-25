import express from 'express';
import http from 'http';
import { Server } from 'socket.io'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const userSockerMap = {}

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSockerMap[socketId]
        }
    });
}

const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
    //console.log(`${socket.id} connected`);
    socket.on("join", ({ roomId, username }) => {
        userSockerMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit("joined", {
                clients,
                username,
                socketId: socket.id
            });
        })
        console.log(clients)
    })

    socket.on("code-change", ({ roomId, code }) => {
        socket.in(roomId).emit("code-change", {
            code
        })
    })

    socket.on("sync-code", ({ socketId, code }) => {
        socket.to(socketId).emit("code-change", {
            code
        })
    })

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
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
