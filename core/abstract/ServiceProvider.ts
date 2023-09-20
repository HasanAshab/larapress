export default abstract class ServiceProvider {
  constructor(public container) {
    this.container = container;
  }
}