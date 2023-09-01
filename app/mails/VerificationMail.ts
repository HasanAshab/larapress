import Mailable from "~/core/mails/Mailable";

export default class VerificationMail extends Mailable {
  view = "verification";
  subject = "Verify Email Address";
}