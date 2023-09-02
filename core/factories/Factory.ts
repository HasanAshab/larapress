import { faker } from "@faker-js/faker";

export default abstract class Factory {
  abstract definition(): Record<string, any>;
  public faker = faker;
  
  constructor(public options: Record<string, unknown> = {}) {
    this.options = options;
  }
  
  merge(data?: Record<string, any>) {
    const modelData = this.definition();
    if(typeof data === "undefined"){
      return modelData;
    }
    for (const field of Object.keys(data)){
      modelData[field] = data[field];
    }
    return modelData;
  };
}