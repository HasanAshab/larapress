require('dotenv').config();
const register = require('./register');

// Registering all global helpers
register.registerHelpers();

// Registering all Cron Jobs
register.registerJobs();

const port = Number(process.env.PORT) || 8000;
// Connecting to database
if (process.env.DB_CONNECT === "true") {
  const connection = require('./connection');
    connection.then(() => {
      console.log('connected to MongoDB...');
    }).catch((err) => {
    console.error(err);
  });
}


const app = require('./app');

// Registering all event and listeners
register.registerEvents(app);

// Registering all group routes 
register.registerRoutes(app);

// Listening for clients
const server = app.listen(port, ()=> {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});

server.on('connection', socket => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: true });
  console.log(`*New connection: [${time}]`)
});

