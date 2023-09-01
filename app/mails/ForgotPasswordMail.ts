import Mailable from "~/core/mails/Mailable";

export default class ForgotPasswordMail extends Mailable {
  view = "forgotPassword";
  subject = "Reset Password";
}