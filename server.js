const morgan = require('morgan');
const hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./routes/route');
const { connectRedis } = require('./utils/redisClient');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful');
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

const init = async () => {
  const server = hapi.server({
    port: 3000,
    host: 'localhost',
  });

  server.route(routes);

  await server.start();
  console.log(`Server running on port: ${server.info.port}`);
  await connectRedis();
};

init();
