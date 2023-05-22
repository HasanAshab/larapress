import { faker } from '@faker-js/faker';

export default abstract class Factory {
  abstract definition(): {[key: string]: any};
  public faker = faker;
  
  merge(data?: {[key: string]: any}): {[key: string]: any} {
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