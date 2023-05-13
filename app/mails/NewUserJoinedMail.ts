import ShouldQueue from "illuminate/queue/ShouldQueue";
import Mailable from "illuminate/mails/Mailable";

export default class NewUserJoinedMail extends Mailable implements ShouldQueue {
  view = "newUserJoined";
  subject = "NewUserJoined";
  shouldQueue = true;
}