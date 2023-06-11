import crypto from "crypto";
import path from "path";
import urls from "register/urls";

export default class URL {
  
  static resolve(url_path = ""): string {
    const domain = process.env.APP_DOMAIN;
    const port = process.env.APP_PORT;
    const protocol = "http";
    return `${protocol}://${path.join(`${domain}:${port}/`, url_path)}`;
  }

  static client(url_path: string = ""): string {
    const domain = process.env.CLIENT_DOMAIN;
    const port = process.env.CLIENT_PORT;
    const protocol = "http";
    return `${protocol}://${path.join(`${domain}:${port}`, url_path)}`;
  }

  static route(name: string, data?: Record < string, string | number >): string {
    let endpoint = urls[name];
    if (!endpoint) {
      throw new Error("Endpoint not found!")
    }
    if (data) {
      const regex = /:(\w+)/g;
      const params = endpoint.match(regex);
      if (params) {
        for (const param of params) {
          endpoint = endpoint.replace(param, data[param.slice(1)]?.toString())
        }
      }
    }
    return this.resolve(endpoint);
  }

  static signedRoute(routeName: string, data?: Record < string, string | number >, expireAfter?: number): string | null {
    const fullUrl = this.route(routeName, data);
    const subUrl = fullUrl.replace(this.resolve(), "/");
    console.log(subUrl)
    const expiryTime = expireAfter ? Date.now() + expireAfter: 0;
    const signature = this.createSignature(subUrl + expiryTime)
    return `${fullUrl}?sign=${signature}${expiryTime > 0? `&exp=${expiryTime}`: ''}`;
  }

  static createSignature(key: string): string {
    return crypto.createHmac('sha256', process.env.APP_SECRET || "").update(key).digest('hex').toString();
  }
}