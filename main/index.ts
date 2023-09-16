import "dotenv/config";
(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "loadTest")
  && require('module-alias/register');
import config from 'config';
import app from "~/main/app";
import Setup from "~/main/Setup";
//import Config from "Config";
import DB from "DB";
import Mail from "Mail";
process.env.NODE_ENV === "loadTest" && (Mail as any).mock();
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

import User from "~/app/models/User";

// Connect to database
if (process.env.NODE_ENV !== "test" && config.get("db.connect")) {
  log && console.log("Connecting to database...");
  DB.connect().then(async () => {
    log && console.log("DB connected!");
    Setup.mongooseModels();
    //return await User.factory().create()
    return await User.deleteOne({ username: (await User.findOne()).username});
    const user = await User.findOne();
    const file = {
      name: `dummy1.jpg`,
      data: Buffer.from("dummy file content"),
      size: 1000,
      encoding: "utf-8",
      mimetype: "image/jpeg"
    }
    await user.attach("logo", file)
    //await user.detach("logo")
    await user.save()
    console.log(user);
  });
}

// Registering Cron Jobs
Setup.cronJobs();

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
      log && console.log(`*New connection on port ${port} [${time}]`);
    });
  }
}

else {
  const port = config.get<number>("app.port");
  server = app.listen(port, () => {
    process.env.NODE_ENV !== "test" && console.log(`Server running on [http://127.0.0.1:${port}] ...`);
  });
  
  log && server.on("connection", (socket) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: true });
    console.log(`*New connection: [${time}]`);
  });
}

/*
import Notification from "Notification";
import User from "~/app/models/User";
import NotificationModel from "~/app/models/Notification";
import NewUserJoined from "~/app/notifications/NewUserJoined";

(async () => {
  return console.log(await NotificationModel.find())
  //return await User.factory().count(4).create();
  
  const users = await User.find().limit(4)
  Notification.send(users, new NewUserJoined({ user: users[0]}));
})();
*/
/*
import User from "~/app/models/User";

(async () => {
  const user = await User.findOne();
  const file = {
    name: `dummy1.jpg`,
    data: Buffer.from("dummy file content"),
    size: 1000,
    encoding: "utf-8",
    mimetype: "image/jpeg"
  }
  await user.attach("logo", file)
})();
*/
export default server;