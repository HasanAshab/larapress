require('dotenv').config();
const cors = require('cors')
const express = require('express');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const register = require('./register');
const app = express();
const port = process.env.PORT || 8000;

// Domains that can only access the API
app.use(cors({
  origin: ['http://localhost:3000']
}));

// Registering static folder
app.use('/static', express.static('storage/public'));

// Registering middlewares for request body 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Registering Handlebars template engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Registering all global helpers 
register.helpers(global);

// Registering all event and listeners
register.registerEvents(app);

// Registering all group routes 
register.registerRoutes(app);

// Registering global error handling middlewares
app.use(middleware(['error.log', 'error.response']));

// Listening for clients
app.listen(port, ()=> {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});

module.exports = app;