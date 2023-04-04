require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 8000;
const connectToDB = process.env.DB_CONNECT;

// App basic setup
app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: Number(process.env.COOKIE_MAX_AGE)
  }
}));

// Registering Handlebars template engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Route groups
app.use('/', require(path.join(__dirname, '/routes/web')));
app.use('/api', require(path.join(__dirname, '/routes/api')));

// Connecting to database
if (connectToDB === "true") {
  const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/test';
  mongoose.connect(dbUrl, {
    useNewUrlParser: true, useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB!');
  }).catch((error) => {
    console.error(error);
  });
}

// Listening for clients
app.listen(port, ()=> {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});