const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const client = createClient({
    url: process.env.REDIS_URL,
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

const connectRedis = async () => {
  await client.connect();
  console.log('Connected to Redis');
};

module.exports = { client, connectRedis };
