export default abstract class Middleware {
  abstract handle(...args: any[]): void | Promise<void>;
  
  constructor(public options: string[] = []) {
    this.options = options;
  }
}