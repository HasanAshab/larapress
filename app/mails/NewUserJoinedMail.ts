import ShouldQueue from "illuminate/queue/ShouldQueue";
import Mailable from "illuminate/mails/Mailable";

export default class NewUserJoinedMail extends Mailable implements ShouldQueue {
  view = "newUserJoined";
  subject = "New User Joined us";
  shouldQueue = true;
}