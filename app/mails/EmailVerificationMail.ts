import Mailable from "~/core/abstract/Mailable";

export default class EmailVerificationMail extends Mailable {
  shouldQueue = true;
  view = "verification";
  subject = "Verify Email Address";
}