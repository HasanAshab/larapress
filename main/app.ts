import { middleware } from "~/core/utils";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import multipartParser from "express-fileupload";
import Setup from "~/main/Setup";
import URL from "URL";

const app: Application = express();

// Securing App
app.use(cors({
// Domains that can only access the API
  origin: [URL.client()] 
}));
app.use(helmet());

// Middlewares for request parsing 
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({
  extended: false,
  limit: "1mb"
}));
app.use(multipartParser());

// Bootstrap the App
Setup.bootstrap(app);

export default app;

