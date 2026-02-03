const mongoose = require('mongoose');

const uri = 'mongodb+srv://pathaknihit09:rohitSharma%40123@shareit.65mb1zc.mongodb.net/Skill-connect';

(async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(uri);
        console.log('MongoDB Connected Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
})();
