import Mailable from "~/illuminate/mails/Mailable";
import config from "config";

export default class PasswordChangedMail extends Mailable {
  view = "passwordChanged";
  subject = `Your ${config.get<any>("app.name")} Password Has Been Updated`;
}