require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const app = express();
const port = process.env.PORT || 8000;


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
require('./register').helpers(global);

// Registering all global middlewares
app.use(middleware('validation.helper'));

// Registering all group routes 
require('./register').routes(app);

// Registering global error handling middlewares
app.use(middleware(['error.log', 'error.response']));


// Connecting to database
require('./db');

// Listening for clients
app.listen(port, ()=> {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});