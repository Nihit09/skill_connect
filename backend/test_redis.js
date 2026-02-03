const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'hkQiNH6TB6iRExcKTilCaoHJYhzQlSAP',
    socket: {
        host: 'redis-16711.c14.us-east-1-2.ec2.cloud.redislabs.com',
        port: 16711
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
