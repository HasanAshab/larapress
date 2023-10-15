import User, { IUser } from "~/app/models/User";
import NewUserJoinedNotification from "~/app/notifications/NewUserJoinedNotification";
import Notification from "Notification";

export default class SendNewUserJoinedNotificationToAdmins {
  async dispatch(user: IUser){
    const admins = await User.find({ role: "admin" });
    await Notification.send(admins, new NewUserJoinedNotification({ user }));
  }
}