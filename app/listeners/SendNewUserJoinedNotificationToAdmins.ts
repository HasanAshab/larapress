import type EventsList from "~/app/contracts/events";
import NewUserJoinedNotification from "~/app/notifications/NewUserJoinedNotification";
import Notification from "Notification";
import User from "~/app/models/User";

export default class SendNewUserJoinedNotificationToAdmins {
  async dispatch({ user }: EventsList["Registered"]){
    const admins = await User.where("role").equals("admin");
    await Notification.send(admins, new NewUserJoinedNotification({ user }));
  }
}