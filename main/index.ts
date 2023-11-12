import "reflect-metadata";
import "dotenv/config";

if(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "loadTest") {
  require('module-alias/register');
}
import "~/vendor/autoload";
import "Config/load";
import Config from "Config";
import app from "~/main/app";
import DB from "DB";


// Connecting to database
if(Config.get("database.connect")) {
  DB.connect().then(() => {
    console.log("Connected to Database!");
  }).catch(err => {
    console.log("Couldn't connect to Database. reason: " + err);
  });
}

const port = Config.get<number>("app.port");

app.assertRunningInWeb();

app.server.listen(port, () => {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});

app.server.on("connection", () => {
  const time = new Date().toLocaleTimeString("en-US", { hour12: true });
  console.log(`*New connection: [${time}]`);
});