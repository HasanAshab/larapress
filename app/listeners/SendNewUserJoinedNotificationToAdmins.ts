import User, { IUser } from "app/models/User";
import NewUserJoined from "app/notifications/NewUserJoined";
import Notification from "illuminate/utils/Notification";

export default class SendNewUserJoinedNotificationToAdmins {
  async dispatch(user: IUser){
    const admins = await User.find({isAdmin:true});
    await Notification.send(admins, new NewUserJoined({user}));
  }
}