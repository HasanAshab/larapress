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


import User from "~/app/models/User";


(async () => {
const user = await User.findOne();
    console.log(user.remove)
})()


/*
import User, { UserDocument } from "~/app/models/User";
import Media from "~/app/models/Media";
import URL from "URL";


(async () => {
  const user = await User.findOne() as UserDocument
  const file = {
    name: "test.txt",
    data: "Hehehe"
  }
  console.log(
    //await user.media().withTag("profile").detach(),

   //await user.media().withTag("profile").attach(file),
  //await user.media().withTag("profile").attach(file, "profiles").asPrivate().storeRef(),
 // await user.media().withTag("profile").replaceBy(file),
    //await user.media()
  )
 // console.log(user)
})()
*/
