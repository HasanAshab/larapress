import Token from "illuminate/utils/Token";
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

  static signedRoute(routeName: keyof typeof urls, data?: Record < string, string | number >, expireAfter?: number): string {
    const fullUrl = this.route(routeName, data);
    const subUrl = fullUrl.replace(this.resolve(), "/");
    const token = Token.create(subUrl, expireAfter);
    return `${fullUrl}?sign=${token}`;
  }
}