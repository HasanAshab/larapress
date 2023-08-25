import "dotenv/config";
//import 'module-alias/register';
import config from 'config';
import app from "~/main/app";
import Setup from "~/main/Setup";
import DB from "DB";
import Mail from "Mail";
import https from "https";
import fs from "fs";

(async () => {
  Mail.mock()
  const log = process.env.NODE_ENV === "development";
  process.env.NODE_ENV === "production" && await Setup.cachedConfig();
  // Connecting to database
  if (config.get("db.connect")) {
    log && console.log("Connecting to database...");
   // await DB.connect();
    log && console.log("DB connected!");
  }
  
  // Registering Mongoose Models
  Setup.mongooseModels();
  
  // Registering Cron Jobs
  Setup.cronJobs();
  
  const port = config.get("app.port");
  const server = app.listen(port, () => {
    log && console.log(`Server running on [http://127.0.0.1:${port}] ...`);
  });
  
  log && server.on("connection", (socket) => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour12: true
    });
    console.log(`*New connection: [${time}]`);
  });
  return server;
})();