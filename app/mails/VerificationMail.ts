import Mailable from "~/core/abstract/Mailable";

export default class VerificationMail extends Mailable {
  view = "verification";
  subject = "Verify Email Address";
}