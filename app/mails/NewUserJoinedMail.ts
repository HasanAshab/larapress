import Mailable from "~/core/abstract/Mailable";

export default class NewUserJoinedMail extends Mailable {
  shouldQueue = true;
  view = "newUserJoined";
  subject = "New User Joined Us!";
}