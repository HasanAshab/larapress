import Cache from "illuminate/utils/Cache";
import crypto from "crypto";
import { route, getVersion } from "helpers";

export default class URL {
  static _v: string;
  
  static version(name: string): URL{
    this._v = name;
    return this;
  }
  static signedRoute(routeName: string, data?: Record<string, string | number>, expiryTime = 0): string | null {
    
    const signature = crypto.randomBytes(16).toString("hex");
    const fullUrl = route(routeName, data, this._v ?? getVersion());
    const key = `__signed__${fullUrl}`;
    Cache.put(key, signature, expiryTime)
    return `${fullUrl}?s=${signature}`;
  }
}]