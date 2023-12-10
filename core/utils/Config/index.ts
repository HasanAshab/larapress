import { readdirSync } from "fs";
import { merge } from "lodash-es";


export default class Config {
  static data: Record<string, any> = {};

  static async load(dir = "config") {
    const configFiles = readdirSync(dir);
    const readPromises = configFiles.map(async configFile => {
      const configFor = configFile.split(".")[0];
      const { default: partialConfig } = await import(`~/${dir}/${configFor}`);
      this.data[configFor] = partialConfig;
    });
    
    await Promise.all(readPromises);
    this.data = this.flattenData(this.data);
  }

  static get<T = any>(key?: string): T {
    const value = key ? this.data[key] : this.data;
    if (!value) {
      throw new Error(`Config not exist for key "${key}"`);
    }
    return value;
  }

  static set(data: object) {
    merge(this.data, this.flattenData(data));
  }

  static flattenData(obj: Record<string, any>, prefix = '') {
    const flatObject: Record<string, any> = {};
  
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const nestedFlatObject = this.flattenData(value, newKey);
          Object.assign(flatObject, nestedFlatObject);
          flatObject[newKey] = value;
        } else {
          flatObject[newKey] = value;
        }
      }
    }
    return flatObject;
  }
  
}