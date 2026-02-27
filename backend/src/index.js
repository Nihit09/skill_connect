const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const redisClient = require('./config/redis');
const path = require('path');

// Connect to DB and Redis
connectDB();
(async () => {
    try {
        await redisClient.connect();
        console.log('Redis Connected Successfully');
    } catch (err) {
        console.error('Redis Connection Failed:', err.message);
    }
})();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Body Parsing
app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./routes/auth.routes');
const skillRoutes = require('./routes/skill.routes');
const exchangeRoutes = require('./routes/exchange.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const userRoutes = require('./routes/user.routes');
const messageRoutes = require('./routes/message.routes');
const workspaceRoutes = require('./routes/workspace.routes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/workspaces', workspaceRoutes);

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.get('/', (req, res) => {
    res.send('Skill Connect API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error', error: err.message });
});

const http = require('http');
const { initSocket } = require('./config/socket');

// ... (previous error handling code)

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
