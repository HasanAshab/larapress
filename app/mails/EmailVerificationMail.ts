import Mailable from "~/core/abstract/Mailable";

export default class EmailVerificationMail extends Mailable {
  shouldQueue = false;
  view = "verification";
  subject = "Verify Email Address";
}