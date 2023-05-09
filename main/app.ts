import { base, middleware } from "helpers";
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { engine } from 'express-handlebars';
import multer from 'multer';
import Setup from "main/Setup";

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
Setup.events(app);
/*
// Registering all group routes 
Setup.routes(app);

// Registering global error handling middleware
app.use(middleware('error.handle'));
*/

//import Artisan from "illuminate/utils/Artisan"
app.get('/', (req, res) => {
  //Artisan.call(['test', 'a', 'b'])
  res.json([1, 2, 3, 4])
})

export default app;
