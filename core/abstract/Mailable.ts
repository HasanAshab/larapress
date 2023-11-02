export default abstract class Mailable {
  /**
   * Whether the Mail should be queued
  */
  public shouldQueue = false;
  
  /**
   * Name of the view file that located
   * in specified dir from config
  */
  abstract view: string;
  
  /**
   * The subject of the mail
  */
  abstract subject: string;
  
  /**
   * Create mailable instance 
  */
  constructor(public data: Record<string, any> = {}){
    //this data will be available in view
    this.data = data;
  }
}