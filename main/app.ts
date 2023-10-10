import App from "~/core/Application";
import { middleware } from "~/core/utils";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import formDataParser from "express-fileupload";
import URL from "URL";

const app = new App();

// Securing App
app.use(cors({
// Domains that can only access the API
  origin: [URL.client()] 
}));
app.use(helmet());

// Middlewares for request payload parsing 
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({
  extended: false,
  limit: "1mb"
}));
app.use(formDataParser());

// Bootstrap the App
app.bootstrap();

export default app;

