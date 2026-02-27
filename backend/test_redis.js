require('dotenv').config();
const { createClient } = require('redis');

const client = createClient({
    url: process.env.REDIS_URL
});

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    try {
        await client.connect();
        console.log('Successfully connected to Redis');
        await client.disconnect();
    } catch (err) {
        console.error('Connection failed:', err);
    }
})();
