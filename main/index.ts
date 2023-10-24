import "reflect-metadata";
import "dotenv/config";

if(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "loadTest") {
  require('module-alias/register');
}
import "~/vendor/autoload";

import config from "config"
import app from "~/main/app";
import DB from "DB";
import https from "https";

const shouldLog = process.env.NODE_ENV === "development";

// Connecting to database
if(config.get("db.connect")) {
  DB.connect().then(() => {
    shouldLog && console.log("Connected to Database!");
  }).catch(err => {
    console.log("Couldn't connect to Database. reason: " + err);
  });
}

/*
const loadBalancerConfig = config.get<any>("loadBalancer");
if(loadBalancerConfig.enabled) {
    console.log(`load Balancer: [http://127.0.0.1:${config.get("app.port")}]\n`)
    console.log("Server Instances:")
    for (const port of loadBalancerConfig.ports) {
      app.http.listen(port, () => {
        console.log(`[http://127.0.0.1:${port}]`);
      }).on("connection", (socket) => {
        const time = new Date().toLocaleTimeString("en-US", { hour12: true });
        shouldLog && console.log(`*New connection on port ${port} [${time}]`);
      });
    }
  }
else {
  const port = config.get<number>("app.port");
  const server = app.http.listen(port, () => {
    shouldLog && console.log(`Server running on [http://127.0.0.1:${port}] ...`);
  });
  shouldLog && server.on("connection", (socket) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: true });
    console.log(`*New connection: [${time}]`);
  });
}
*/

const port = config.get<number>("app.port");
app.server.listen(port, () => {
  shouldLog && console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});

shouldLog && app.server.on("connection", (socket) => {
  const time = new Date().toLocaleTimeString("en-US", { hour12: true });
  console.log(`*New connection: [${time}]`);
});
