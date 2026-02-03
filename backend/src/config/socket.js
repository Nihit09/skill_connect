const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

let io;

const initSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const cookie = require('cookie'); // Need to install this or parse manually
    // ...
    // Middleware to authenticate socket connection
    io.use(async (socket, next) => {
        try {
            // Get token from cookie (preferred for httpOnly) or auth header
            let token = socket.handshake.auth.token;

            if (!token && socket.request.headers.cookie) {
                const cookies = cookie.parse(socket.request.headers.cookie);
                token = cookies.token;
            }

            if (!token) {
                return next(new Error('Authentication error: No token found'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded._id);

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.firstName} (${socket.id})`);

        // Join a room for a specific exchange
        socket.on('join_exchange', (exchangeId) => {
            socket.join(exchangeId);
            console.log(`User ${socket.user._id} joined exchange room: ${exchangeId}`);
        });

        // Handle sending a message
        socket.on('send_message', async (data) => {
            const { exchangeId, text } = data;

            try {
                // Save message to DB
                console.log('Sending message:', text, 'to exchange:', exchangeId);
                const newMessage = await Message.create({
                    exchange: exchangeId,
                    sender: socket.user._id,
                    text
                });

                // Populate sender details for frontend display
                await newMessage.populate('sender', 'firstName lastName');

                // Emit to room
                io.to(exchangeId).emit('receive_message', newMessage);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', 'Message delivery failed');
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

module.exports = { initSocket, getIo };
