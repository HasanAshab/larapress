require('dotenv').config();
require('../helpers');

const register = require('./register');
const app = require('./app');
const port = Number(process.env.PORT) || 8000;
const connectToDB = Boolean(process.env.DB_CONNECT) || true;
const nodeEnv = process.env.NODE_ENV;

// Connecting to database
if (connectToDB) {
  const connection = require('./connection');
    connection.then(() => {
      console.log('connected to MongoDB...');
    }).catch((err) => {
    console.error(err);
  });
}

// Registering all Cron Jobs
register.registerJobs();

// Listening for clients
const server = app.listen(port, ()=> {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});

if(nodeEnv !== 'production'){
server.on('connection', socket => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: true });
  console.log(`*New connection: [${time}]`)
});
}

