import "dotenv/config";
process.env.NODE_ENV === "production" && require('module-alias/register');
import config from 'config';
import app from "~/main/app";
import Setup from "~/main/Setup";
//import Config from "Config";
import DB from "DB";
import Mail from "Mail";
import https from "https";
import fs from "fs";

const log = process.env.NODE_ENV === "development";
process.env.NODE_ENV === "production" && Setup.cachedConfig();

/*
Config.parse({ caching: "redis", redisUrl: "redis://default:raAjgzb9ceMv8MVUFzSl7cY6DFJC3MR1@redis-12100.c305.ap-south-1-1.ec2.cloud.redislabs.com:12100" }).then(async () => {
  console.log(Config.get())
  await Config.set({
    app: {
      name: "Blalalal"
    }
  })
  console.log(Config.get())

});
*/

// Connect to database
if (config.get("db.connect")) {
  log && console.log("Connecting to database...");
 // DB.connect().then(Setup.mongooseModels);
  log && console.log("DB connected!");
}

// Registering Cron Jobs
Setup.cronJobs();

const port = config.get<number>("app.port");
const server = app.listen(port, () => {
  process.env.NODE_ENV !== "test" && console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});

log && server.on("connection", (socket) => {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour12: true
  });
  console.log(`*New connection: [${time}]`);
});

export default server;