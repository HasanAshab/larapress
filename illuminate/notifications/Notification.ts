import Mailable from "illuminate/mails/Mailable";

export default abstract class Notification {
  constructor(public data: object) {
    this.data = data;
  }
  abstract via(): string[];
  abstract toMail?(): Mailable;
  abstract toObject?(): object;
}