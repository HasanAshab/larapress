export default abstract class Middleware {
  abstract handle(...args: any[]): void | Promise<void>;
  
  constructor(public config = {}) {
    this.config = config;
  }
}