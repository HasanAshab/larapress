import _ from "lodash";

export default abstract class Manager {
  private drivers = {};
  private customCreators = {};
  
  abstract public getDefaultDriver?(): string;

  driver(name?: string = this.getDefaultDriver?.()) {
    if(!name)
      throw new Error("Failed to resolve driver for " + this.name);
    return this.drivers[name] = this.createDriver(name);
  }
  
  protected createDriver(driver: string) {
    if (this.customCreators[driver])
      return this.customCreators[driver]();
    const method = `create${_.uppercase(driver)}Driver`;
    if (typeof this[method] === "function")
      return this[method]();
    throw new Error(`Driver ${driver} not supported.`);
  }
  
  extend(driver: string, creator) {
    this.customCreators[driver] = creator;
    return this;
  }
}