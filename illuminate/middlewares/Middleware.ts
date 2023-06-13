export default abstract class Middleware {
  abstract handle(...args: any[]): void | Promise<void>;
  
  constructor(public config: Record<string, unknown> = {}) {
    this.config = config;
  }
}