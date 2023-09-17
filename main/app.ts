import { middleware } from "helpers";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import multipartParser from "express-fileupload";
import Setup from "~/main/Setup";
import URL from "URL";

const app: Application = express();

// Securing Application From Potential Attacks
app.use(cors({
// Domains that can only access the API
  origin: [URL.client()] 
}));
app.use(helmet());
app.use("*", middleware("maintenance.check", "limit:1000,2"));

// Setting middlewares for request parsing 
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({
  extended: false,
  limit: "1mb"
}));
app.use(multipartParser());

// Registering mongoose global plugins
Setup.mongooseGlobalPlugins();

// Registering global middlewares
app.use(middleware("helpers.inject"));

// Registering all event and listeners
Setup.events(app);

// Registering all group routes 
Setup.routes(app);

// Serving public folder
app.use("/api/files", express.static(__dirname + "/../storage/public"));
 
// Registering global error handling middleware
app.use(middleware("error.handle"));

export default app;
