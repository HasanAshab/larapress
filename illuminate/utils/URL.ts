import config from 'config';
import Token, { IToken } from "app/models/Token";
import path from "path";
import urls from "register/urls";

export default class URL {
  static resolve(url_path = ""): string {
    const { domain, port, protocol } = config.get("app");
    return `${protocol}://${path.join(`${domain}:${port}/`, url_path)}`;
  }

  static client(url_path: string = ""): string {
    const { domain, port } = config.get("client");
    return `https://${path.join(`${domain}:${port}`, url_path)}`;
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
    let token: IToken;
    if(expireAfter) {
      token = await Token.create({
        key: path, 
        type: "urlSignature",
        expireAt: Date.now() + expireAfter
      });
    }
    else {
      token = await Token.findOneOrCreate({
        key: path,
        type: "urlSignature"
      });
    }
    return `${fullUrl}?sign=${token.secret}`;
  }
}