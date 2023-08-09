import "dotenv/config";
import { base } from "helpers";
import app from "main/app";
import Setup from "main/Setup";
import DB from "illuminate/utils/DB";
import https from "https";
import fs from "fs";


const port = Number(process.env.APP_PORT) ?? 8000;
const connectToDB = Boolean(process.env.DB_CONNECT) ?? true;
const nodeEnv = process.env.NODE_ENV;

// Connecting to database
if (connectToDB) {
  console.log("Connecting to database...");
  DB.connect()
  .then(() => {
    console.log("DB connected!");
  })
  .catch((err) => {
    console.log(err);
  });
}

// Registering Mongoose Models
Setup.mongooseModels();

// Registering Cron Jobs
Setup.cronJobs();

/*
const serverOptions = {
  key: fs.readFileSync(base('main/certificates/key.pem'), 'utf8');
  cert: fs.readFileSync(base('main/certificates/cert.pem'), 'utf8');
}

// Listening for clients
const server = https.createServer(serverOptions, app).listen(port, () => {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});
*/

const server = app.listen(port, () => {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});

if (nodeEnv === "development") {
  server.on("connection", (socket) => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour12: true
    });
    console.log(`*New connection: [${time}]`);
  });
}

/*
import User from "app/models/User";

import Settings from "app/models/Settings";
import Notification from "illuminate/utils/Notification";
import NewUserJoined from "app/notifications/NewUserJoined";

//User.create({username: "foo5", email: "foo@5", password: "bla"}).then(u => u.settings).then(console.log);

Settings.updateOne({ userId: req.user._id }, {
 $set: { [`notification.email`]: false }
});

//here
setTimeout(() => {
  
Notification.mock()
User.findOne().then(async u => {
  console.log(u)
  Notification.send(u, new NewUserJoined({ user: u})).then(() => {
    console.log(Notification.mocked)
  });
})
}, 5000)


*/