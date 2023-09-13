import Mailable from "~/core/abstract/Mailable";

export default class NewUserJoinedMail extends Mailable {
  view = "newUserJoined";
  subject = "New User Joined Us!";
}