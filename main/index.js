const app = require('./app');
const port = Number(process.env.PORT) || 8000;

// Listening for clients
const server = app.listen(port, ()=> {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});

server.on('connection', socket => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: true });
  console.log(`*New connection: [${time}]`)
});