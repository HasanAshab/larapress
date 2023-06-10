import Cache from "illuminate/utils/Cache";
import crypto from "crypto";
import { route, getVersion } from "helpers";

export default class URL {
  static _v: string;
  
  static version(name: string): typeof URL {
    this._v = name;
    return this;
  }
  
  static signedRoute(routeName: string, data?: Record<string, string | number>, expireAfter?: number): string | null {
    const fullUrl = route(routeName, data, this._v ?? getVersion());
    const expiryTime = expireAfter ? Date.now() + expireAfter : 0;
    console.log(expiryTime)
    const signature = this.createSignature(fullUrl + expiryTime)
    return `${fullUrl}?sign=${signature}${expiryTime > 0? `&exp=${expiryTime}`:''}`;
  }
  
  static createSignature(key: string): string {
    return crypto.createHmac('sha256', process.env.APP_SECRET || "").update(key).digest('hex').toString();
  }
}