import DB from "DB";
import Notification from "Notification";
import User from "~/app/models/User";
import SendEmailVerificationNotification from "~/app/listeners/SendEmailVerificationNotification";
import SendNewUserJoinedNotificationToAdmins from "~/app/listeners/SendNewUserJoinedNotificationToAdmins";
import NewUserJoinedNotification from "~/app/notifications/NewUserJoinedNotification";
import EmailVerificationNotification from "~/app/notifications/EmailVerificationNotification";

describe("Registered Event", () => {
  let user;

  beforeAll(async () => {
    Notification.mockClear();
    await DB.connect();
    user = await User.factory().unverified().create();
  });

  it("should send verification email", async () => {
    await new SendEmailVerificationNotification().dispatch({user});
    Notification.assertCount(1);
    Notification.assertSentTo(user, EmailVerificationNotification);
  });
  
  it("should notify admins about new user", async () => {
    const admins = await User.factory().count(3).hasSettings().withRole("admin").create();
    await new SendNewUserJoinedNotificationToAdmins().dispatch(user);
    Notification.assertSentTo(admins, NewUserJoinedNotification);
  });
});
