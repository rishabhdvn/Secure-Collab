import express from 'express';
import http from 'http';
import { Server } from 'socket.io'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
