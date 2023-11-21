import type EventsList from "~/app/contracts/events";
import NewUserJoinedNotification from "~/app/notifications/NewUserJoinedNotification";
import Notification from "Notification";

export default class SendNewUserJoinedNotificationToAdmins {
  async dispatch({ user }: EventsList["Registered"]){
    const admins = await User.find({ role: "admin" });
    await Notification.send(admins, new NewUserJoinedNotification({ user }));
  }
}