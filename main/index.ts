import "dotenv/config";
import app from "main/app";
import Setup from "main/Setup";
import DB from "illuminate/utils/DB";
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

// Listening for clients
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
