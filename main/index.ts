import "dotenv/config"
import config from 'config';
import { base } from "helpers";
import app from "main/app";
import Setup from "main/Setup";
import DB from "illuminate/utils/DB";
import https from "https";
import fs from "fs";

(async () => {
  process.env.NODE_ENV === "production" && await Setup.cachedConfig();
  // Connecting to database
  if (config.get("db.connect")) {
    console.log("Connecting to database...");
    await DB.connect();
    console.log("DB connected!");
  }
  
  // Registering Mongoose Models
  Setup.mongooseModels();
  
  // Registering Cron Jobs
  Setup.cronJobs();
  
  const port = config.get("app.port");
  const server = app.listen(port, () => {
    console.log(`Server running on [http://127.0.0.1:${port}] ...`);
  });
  
  if (process.env.NODE_ENV === "development") {
    server.on("connection", (socket) => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", {
        hour12: true
      });
      console.log(`*New connection: [${time}]`);
    });
  }
})();