import Mailable from "~/core/abstract/Mailable";

export default class ForgotPasswordMail extends Mailable {
  view = "forgotPassword";
  subject = "Reset Password";
}