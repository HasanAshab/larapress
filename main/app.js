require('dotenv').config();
const cors = require('cors')
const express = require('express');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const register = require('./register');
const multer = require('multer')
const app = express();
const port = Number(process.env.PORT) || 8000;

// Domains that can only access the API
app.use(cors({
  origin: ['http://localhost:3000']
}));

// Registering static folder
app.use('/static', express.static('storage/public/static'));


// Registering middlewares for request body 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Registering Handlebars template engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


// Registering all global helpers 
register.helpers(global);

// Registering middlewares for Upload
app.use(multer().any());
app.use(middleware('upload.helpers'));

// Registering all event and listeners
register.registerEvents(app);

// Registering all group routes 
register.registerRoutes(app);

// Registering global error handling middleware
app.use(middleware('error.handle'));

// Listening for clients
const server = app.listen(port, ()=> {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});

server.on('connection', socket => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: true });
  console.log(`*New connection: [${time}]`)
});

module.exports = app;