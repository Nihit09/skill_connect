const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: 'oXem9dXMhqvC09hOJnUl0qohibGOEzoO',
    socket: {
        host: 'redis-10074.c15.us-east-1-2.ec2.cloud.redislabs.com',
        port: 10074,
        tls: {}
    }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

module.exports = redisClient;