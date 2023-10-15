import Mailable from "~/core/abstract/Mailable";

export default class EmailVerificationMail extends Mailable {
  view = "verification";
  subject = "Verify Email Address";
}