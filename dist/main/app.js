"use strict";
/*
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { engine } from 'express-handlebars';
import multer from 'multer';
const register = require(base('main/register'));
const app: Application = express();

// Domains that can only access the API
app.use(cors({
  origin: ['http://localhost:3000']
}));

// Registering static folder
app.use('/static', express.static(base('storage/public/static')));


// Registering middlewares for request body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Registering Handlebars template engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', base('views'));

// Registering global middlewares
app.use(multer().any());
app.use(middleware('response.wrap'));

// Registering all event and listeners
register.registerEvents(app);

// Registering all group routes
register.registerRoutes(app);

// Registering global error handling middleware
app.use(middleware('error.handle'));
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = 'this is app';
