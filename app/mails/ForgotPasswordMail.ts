import Mailable from "~/illuminate/mails/Mailable";

export default class ForgotPasswordMail extends Mailable {
  view = "forgotPassword";
  subject = "Reset Password";
}