export default abstract class Mailable {
  abstract view: string;
  abstract subject: string;
  
  constructor(public data: Record<string, any> = {}){
    this.data = data;
  }
}