import Cache from "illuminate/utils/Cache";
import crypto from "crypto";
import { route } from "helpers";
import { UrlData } from "types";

export default class URL {
  static signedRoute(routeName: string, data?: UrlData, expiryTime?: number): string | null {
    const signature = crypto.randomBytes(16).toString("hex");
    const fullUrl = route(routeName, data);
    if(!fullUrl) return null;
    const key = `__signed__${fullUrl}`;
    Cache.put(key, signature, expiryTime)
    return `${fullUrl}?s=${signature}`;
  }
}