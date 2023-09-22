export default abstract class ServiceProvider {
  abstract register(): void;
  abstract boot?(): void;
  
  constructor(public container) {
    this.container = container;
  }
}