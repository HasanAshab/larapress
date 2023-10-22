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
  import URL from "URL";

app.bootstrap().then(() => {
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
  
(async () => {
  console.log(await URL.signedRoute("verify", {id: "9229", token: "dhdjdj"}));
})()

});

/*
//import Benchmark from "Benchmark";
import Mail from "Mail";
import Notification from "Notification";
import EmailVerificationNotification from "~/app/notifications/EmailVerificationNotification";
import User from "~/app/models/User";
import NotificationModel from "~/app/models/Notification";

(async () => {
//  await DB.reset(["Notification"]);
const users = await User.find();
//console.log(users)
//Mail.mock()
console.time()
await Notification.send(users, new EmailVerificationNotification);
console.timeEnd()
//console.log(Mail.mocked)
//console.log(await NotificationModel.find())
})()
*/


//User.findOne().then(console.log)