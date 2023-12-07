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


app.assertRunningInWeb();

// Connecting to database
if(Config.get("database.connect")) {
  DB.connect().then(() => {
    console.log("Connected to Database!");
  }).catch(err => {
    console.log("Couldn't connect to Database. reason: " + err);
  });
}

const port = Config.get<number>("app.port");

app.server.listen(port, () => {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});

app.server.on("connection", () => {
  const time = new Date().toLocaleTimeString("en-US", { hour12: true });
  console.log(`*New connection: [${time}]`);
});

/*
import User from "~/app/models/User";
import Settings from "~/app/models/Settings";

(async () => {
  
//const user = await User.findOne()
//await user.update({name: "binod2"})
 // console.log(await user.delete())
  //await user.refresh()
  //console.log(user)
const s = await Settings.create({
  userId: new User()._id
})
})()
*/

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
      await user.media().withTag("profile").detach(),

  console.log(

  // await user.media().withTag("profile").attach(file).storeLink(),
  await user.media().withTag("profile").attach(file).asPrivate().storeLink(),
 //await user.media().withTag("profile").replaceBy(file),
    await user.media()
  )
 console.log(user)
})()
*/