import Mailable from "~/core/abstract/Mailable";

export default class ForgotPasswordMail extends Mailable {
  shouldQueue = true;
  view = "forgotPassword";
  subject = "Reset Password";
}