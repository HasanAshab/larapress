import "reflect-metadata";
import "dotenv/config";

if(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "loadTest") {
  require('module-alias/register');
}
import "~/vendor/autoload";

import config from "config"
import app from "~/main/app";
import Setup from "~/main/Setup";
import DB from "DB";
import Mail from "Mail";
process.env.NODE_ENV === "loadTest" && (Mail as any).mock();
import https from "https";
import fs from "fs";


const shouldLog = process.env.NODE_ENV === "development";

// Connecting to database
if(config.get("db.connect")) {
  DB.connect().then(() => {
    shouldLog && console.log("Connected to Database!");
  }).catch(err => {
    console.error("Couldn't connect to Database. reason: " + err);
  });
}

let server;
const loadBalancerConfig = config.get<any>("loadBalancer");
if(loadBalancerConfig.enabled) {
  console.log(`load Balancer: [http://127.0.0.1:${config.get("app.port")}]\n`)
  console.log("Server Instances:")
  for (const port of loadBalancerConfig.ports) {
    app.listen(port, () => {
      console.log(`[http://127.0.0.1:${port}]`);
    }).on("connection", (socket) => {
      const time = new Date().toLocaleTimeString("en-US", { hour12: true });
      shouldLog && console.log(`*New connection on port ${port} [${time}]`);
    });
  }
}

else {
  const port = config.get<number>("app.port");
  server = app.listen(port, () => {
    shouldLog && console.log(`Server running on [http://127.0.0.1:${port}] ...`);
  });
  shouldLog && server.on("connection", (socket) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: true });
    console.log(`*New connection: [${time}]`);
  });
}
  
export default server;