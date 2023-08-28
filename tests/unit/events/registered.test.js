const DB = require("DB").default;
const Notification = require("Notification").default;
const Mail = require("Mail").default;
const User = require("~/app/models/User").default;
const Settings = require("~/app/models/Settings").default;
const SendEmailVerificationNotification = require("~/app/listeners/SendEmailVerificationNotification").default;
const SendNewUserJoinedNotificationToAdmins = require("~/app/listeners/SendNewUserJoinedNotificationToAdmins").default;

describe("Registered Event", () => {
  let user;

  beforeAll(async () => {
    await DB.connect();
  });

  beforeEach(async () => {
    await DB.reset();
    user = await User.factory().create({ verified: false });
  });
  
  it("should send verification email", async () => {
    Mail.mock();
    await new SendEmailVerificationNotification().dispatch(user);
    Mail.assertCount(1);
    Mail.assertSentTo(user.email, "VerificationMail");
  });

  it.only("should notify admins about new user", async () => {
    const admins = await User.factory(3).create({ role: "admin" });
    await Settings.create({ userId: user._id });
    for(const admin of admins){
      await Settings.create({ userId: admin._id });
    }
    Notification.mock();
    await new SendNewUserJoinedNotificationToAdmins().dispatch(user);
    Notification.assertSentTo(admins, "NewUserJoined");
  });
});
