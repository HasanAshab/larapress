import User from "app/models/User";
import NewUserJoinedMail from "app/mails/NewUserJoinedMail";
import Mail from "illuminate/utils/Mail";

export default class SendNewUserJoinedNotificationToAdmins {
  async dispatch(user: typeof User){
    const admins = await User.find({isAdmin:true});
    await Mail.to(admins).send(new NewUserJoinedMail({user}));
  }
}