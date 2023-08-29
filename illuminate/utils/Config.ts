import fs from "fs";
import path from "path";

function flattenObject<T extends Record<string, any>>(obj: T, prefix = ''): Record<string, any> {
  const flatObject: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recurse into nested object
        const nestedFlatObject = flattenObject(value, prefix + key + '.');
        Object.assign(flatObject, nestedFlatObject);
      } else {
        // Add the value to the flattened object
        flatObject[prefix + key] = value;
      }
    }
  }

  return flatObject;
}

export type ConfigValue = string | number | boolean | Record<string, ConfigValue>;
export type ConfigOptions = {
  saveChanges: boolean;
  cachePath?: string;
};

export default class Config {
  static data: Record<string, ConfigValue> = {};
  static options: ConfigOptions;
  
  static async parse({ saveChanges = false, cacheDir = "./" }) {
    this.options = { saveChanges };
    if(saveChanges) {
      this.options.cachePath = path.join(cacheDir, "config.json");
      try {
        this.data = JSON.parse(await fs.promises.readFile(this.options.cachePath))
        return;
      }
      catch {}
    }
    const data = require("~/config/default");
    try {
      Object.assign(data, require("~/config/" + process.env.NODE_ENV));
    }
    catch {}
    this.data = Object.assign(flattenObject(data), data);
    if(saveChanges){
      try {
        await fs.promises.writeFile(this.options.cachePath!, JSON.stringify(this.data), {
          flag: "wx"
        });
      }
      catch {}
    }
  }

  
  static get<T = ConfigValue>(key?: string): T {
    if(!key) return this.data;
    const value = this.data[key] 
    if(!value) throw new Error(`Config not found for key "${key}"`);
    return value;
  }
  
  static async set(key: string, value: ConfigValue) {
    this.data[key] = value;
    const keys = key.split('.');
    let target = this.data;
    for (let i = 0; i < keys.length - 1; i++) {
      const currentKey = keys[i];
      if (!target[currentKey] || typeof target[currentKey] !== 'object') {
        target[currentKey] = {};
      }
      target = target[currentKey];
    }
    const finalKey = keys[keys.length - 1];
    target[finalKey] = value;
    if (this.options.saveChanges) {
      await fs.promises.writeFile(this.options.cachePath!, JSON.stringify(this.data));
    }
  }
}