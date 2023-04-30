const User = require(base("app/models/User"));
const NewUserJoinedMail = require(base('app/mails/NewUserJoinedMail'));
const Mail = require(base('illuminate/utils/Mail'));

class SendNewUserJoinedNotificationToAdmins {
  static async dispatch(user){
    const admins = await User.find({isAdmin:true});
    await Mail.to(admins).send(new NewUserJoinedMail({user}));
  }
}

module.exports = SendNewUserJoinedNotificationToAdmins;