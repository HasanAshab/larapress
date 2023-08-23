import config from 'config';
import Token, { IToken } from "app/models/Token";
import path from "path";
import urls from "register/urls";
import crypto from "crypto";

export default class URL {
  static resolve(url_path = ""): string {
    const { domain, port, protocol } = config.get("app");
    return `${protocol}://${path.join(`${domain}:${port}/`, url_path)}`;
  }

  static client(url_path: string = ""): string {
    const { domain, port, protocol } = config.get("client");
    return `${protocol}://${path.join(`${domain}:${port}`, url_path)}`;
  }

  static route(name: keyof typeof urls, data?: Record < string, string | number >): string {
    let endpoint: string = urls[name];
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

  static async signedRoute(routeName: keyof typeof urls, data?: Record < string, string | number >, expireAfter?: number): string {
    const fullUrl = this.route(routeName, data);
    const path = fullUrl.replace(this.resolve(), "/");
    console.log(fullUrl)
    let [baseUrl, queryString] = fullUrl.split("?");
    const payload = {
      type: "urlSignature",
      data: { fullUrl }
    }
    if(!expireAfter) {
      const token = await Token.findOne(payload);
      if(token) return token.key;
    }
    payload.secret = crypto.randomBytes(32).toString('hex');
    if(queryString)
      queryString += "&sign=" + payload.secret;
    else queryString = "?sign=" + payload.secret;
    const originalUrl = baseUrl + queryString;
    console.log(originalUrl) is it same?
    payload.key = originalUrl;
    if(expireAfter) {
      payload.expireAt = Date.now() + expireAfter;
    }
    await Token.create(payload);
    return originalUrl;
  }
}