import _ from "lodash";

type CustomCreator = () => object;

export default abstract class Manager {
  private drivers: Record<string, object> = {};
  private customCreators: Record<string, CustomCreator> = {};
  
  defaultDriver(): string | null {
    return null;
  }
  
  driver(name = this.defaultDriver()) {
    if(!name) {
      throw new Error("Failed to resolve driver for " + this.constructor.name);
    }
    return this.drivers[name] = this.createDriver(name);
  }
  
  protected createDriver(driver: string) {
    if (this.customCreators[driver])
      return this.customCreators[driver]();
    const method = `create${_.capitalize(driver)}Driver` as keyof this;
    if (typeof this[method] === "function")
      return (this[method] as any)();
    throw new Error(`Driver ${driver} not supported.`);
  }
  
  extend(driver: string, creator: CustomCreator) {
    this.customCreators[driver] = creator;
    return this;
  }
}