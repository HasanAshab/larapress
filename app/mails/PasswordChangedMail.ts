import Mailable from "~/core/abstract/Mailable";
import config from "config";

export default class PasswordChangedMail extends Mailable {
  view = "passwordChanged";
  subject = `Your ${config.get("app.name")} Password Has Been Updated`;
}