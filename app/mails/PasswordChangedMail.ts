import Mailable from "illuminate/mails/Mailable";

export default class PasswordChanged extends Mailable {
  view = "passwordChanged";
  subject = `Your ${process.env.APP_NAME} Password Has Been Updated`;
}