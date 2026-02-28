require('dotenv').config();
const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'oXem9dXMhqvC09hOJnUl0qohibGOEzoO',
    socket: {
        host: 'redis-10074.c15.us-east-1-2.ec2.cloud.redislabs.com',
        port: 10074,
        tls: {}
    }
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
