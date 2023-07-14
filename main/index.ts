import "dotenv/config";
import { base } from "helpers";
import app from "main/app";
import Setup from "main/Setup";
import DB from "illuminate/utils/DB";
import https from "https";
import fs from "fs";
//import webpush from "web-push";

const port = Number(process.env.APP_PORT) ?? 8000;
const connectToDB = Boolean(process.env.DB_CONNECT) ?? true;
const nodeEnv = process.env.NODE_ENV;

// Connecting to database
if (connectToDB) {
  console.log("Connecting to database...");
  DB.connect()
  .then(() => {
    console.log("done!");
  })
  .catch((err) => {
    console.log(err);
  });
}

// Registering Cron Jobs
Setup.cronJobs();

//webpush.setVapidDetails("mailto:hostilarysten@gmail.com", process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)


// Load the SSL/TLS key and certificate
const privateKey = fs.readFileSync(base('main/certificates/key.pem'), 'utf8');
const certificate = fs.readFileSync(base('main/certificates/cert.pem'), 'utf8');

// Create the HTTPS server
const serverOptions = {
  key: privateKey,
  cert: certificate
};

// Listening for clients
const server = https.createServer(serverOptions, app).listen(port, () => {
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

import Notification from "app/models/Notification";
Notification.findOne().then(n => n.markAsRead())