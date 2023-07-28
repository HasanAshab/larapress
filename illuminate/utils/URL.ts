import Token from "illuminate/utils/Token";
import path from "path";
import urls from "register/urls";

export default class URL {
  static join(baseUrl, path) {
    const url = new URL(baseUrl);
    const pathParts = path.split('/').filter(part => part !== ''); // Split and filter empty parts
    url.pathname = url.pathname.endsWith('/') // Ensure the base URL pathname ends with a slash
      ? url.pathname + pathParts.join('/')
      : url.pathname + '/' + pathParts.join('/');
    return url.toString();
  }

  static resolve(url_path = ""): string {
    const domain = process.env.APP_DOMAIN;
    const port = process.env.APP_PORT;
    const protocol = process.env.APP_PROTOCOL ?? "https";
    return `${protocol}://${path.join(`${domain}:${port}/`, url_path)}`;
  }

  static client(url_path: string = ""): string {
    const domain = process.env.CLIENT_DOMAIN;
    const port = process.env.CLIENT_PORT;
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

  static signedRoute(routeName: keyof typeof urls, data?: Record < string, string | number >, expireAfter?: number): string {
    const fullUrl = this.route(routeName, data);
    const subUrl = fullUrl.replace(this.resolve(), "/");
    const token = Token.create(subUrl, expireAfter);
    return `${fullUrl}?sign=${token}`;
  }
}