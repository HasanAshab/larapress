import Mailable from "~/core/abstract/Mailable";
import Config from "Config";

export default class PasswordChangedMail extends Mailable {
  shouldQueue = true;
  view = "passwordChanged";
  subject = `Your ${Config.get("app.name")} Password Has Been Updated`;
}