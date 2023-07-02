import Mailable from "illuminate/mails/Mailable";

export default class NewUserJoinedMail extends Mailable {
  view = "newUserJoined";
  subject = "New User Joined Us!";
}