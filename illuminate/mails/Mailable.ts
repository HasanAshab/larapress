import Queueable from "illuminate/queue/Queueable";

export default abstract class Mailable extends Queueable {
  abstract view: string;
  abstract subject: string;
  
  constructor(public data: {[key: string]: any} = {}){
    super();
    this.data = data;
  }
}