import { base, middleware } from "helpers";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { engine } from "express-handlebars";
import MultipartParser from "express-fileupload";
import Setup from "main/Setup";

const app: Application = express();

// Domains that can only access the API
app.use(cors({
  origin: ["http://localhost:3000"]
}));

// Serving static folder
app.use("/static", express.static(base("storage/public/static")));


// Setting middlewares for request parsing 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(MultipartParser());


// Registering Handlebars template engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", base("views"));

// Registering global middlewares
app.use(middleware("helpers.inject"));

// Registering global mongoose model plugins
Setup.globalPlugins();

// Registering all event and listeners
Setup.events(app);

// Registering all group routes 
Setup.routes(app);

// Registering global error handling middleware
app.use(middleware("error.handle"));


Setup.routes(app);

export default app;
