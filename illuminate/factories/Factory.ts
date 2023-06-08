import { faker } from "@faker-js/faker";

export default abstract class Factory {
  abstract definition(): Promise<Record<string, any>> | Record<string, any>;
  public faker = faker;
  
  async merge(data?: Record<string, any>): Promise<Record<string, any>> {
    const modelData = await this.definition();
    if(typeof data === "undefined"){
      return modelData;
    }
    for (const field of Object.keys(data)){
      modelData[field] = data[field];
    }
    return modelData;
  };
}