export default abstract class Middleware {
  abstract handle(...args: any[]): Promise<any>;
  
  constructor(public config: Record<string, unknown> = {}) {
    this.config = config;
  }
}