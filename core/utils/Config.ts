import fs from "fs";

export type ConfigValue = string | number | boolean | Record<string, ConfigValue>;

export default class Config {
  static data: Record<string, ConfigValue> = {};
  static flattenedData: Record<string, ConfigValue> = {};

  static load(dir = "config") {
    const configFiles = fs.readdirSync(dir);
    for(const configFile of configFiles) {
      const configFor = configFile.split(".")[0];
      this.data[configFor] = require(`~/${dir}/${configFor}`).default;
    }
    this.flattenedData = this.flattenObject(this.data);
  }

  static get<T = ConfigValue>(key?: string): T {
    if (!key) return this.flattenedData;
    const value = this.flattenedData[key];
    if (!value) throw new Error(`Config not exist for key "${key}"`);
    return value;
  }

  static set(data: object) {
    this.flattenedData = this.flattenObject(Object.assign(this.data, data));
  }

  static flattenObject(obj, prefix = '') {
    const flatObject = {};
  
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
  
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Recursively flatten nested objects
          const nestedFlatObject = this.flattenObject(value, newKey);
          Object.assign(flatObject, nestedFlatObject);
  
          // Add the current nested object under the original key
          flatObject[newKey] = value;
        } else {
          // Assign non-object values directly
          flatObject[newKey] = value;
        }
      }
    }
  
    return flatObject;
  }
  
}