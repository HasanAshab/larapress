import "dotenv/config";
import app from "main/app";
import Setup from "main/Setup";
import DB from "illuminate/utils/DB";

const port = Number(process.env.APP_PORT) || 8000;
const connectToDB = process.env.DB_CONNECT || "true";
const nodeEnv = process.env.NODE_ENV;

// Connecting to database
if (connectToDB === "true") {
  console.log("Connecting to database...");
  DB.connect()
  .then(() => {
    console.log("done!");
  })
  .catch((err) => {
    console.log(err);
  });
}

// Registering all Cron Jobs
Setup.cronJobs();

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


import Mail from "illuminate/utils/Mail";
import PasswordChanged from "app/mails/PasswordChangedMail";
import Notification from "illuminate/utils/Notification";
import NewUserJoined from "app/notifications/NewUserJoined";

/*
Mail.mock();
Mail.to("foo@gmail.com").send(new PasswordChanged())
Mail.to("foo@gmail.com").send(new PasswordChanged())
Mail.to("foo2@gmail.com").send(new PasswordChanged())
console.log(Mail.mocked);

Notification.mock();
Notification.send({_id: "jeje"}, new NewUserJoined({name: "bla"}))

console.log(Notification.assertSentTo({_id: "jeje"}, "NewUserJoined"))
*/