export default abstract class Mailable {
  abstract view: string;
  abstract subject: string;
  abstract data: {[key: string]: any};
}