const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB URI:', process.env.MONGO_URI.replace(/:([^:@]{1,})@/, ':****@')); // Mask password
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        process.exit(0);
    } catch (error) {
        console.error(`MongoDB Connection Failed: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
};

connectDB();
