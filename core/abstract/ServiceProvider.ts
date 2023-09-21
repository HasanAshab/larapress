export default abstract class ServiceProvider {
  abstract register(): void;
  
  constructor(public container) {
    this.container = container;
  }
}