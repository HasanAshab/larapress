import Config from 'Config';
import path from "path";
import { createHmac } from "crypto";
import { URL as BaseURL } from "url";

export default class URL extends BaseURL {
 /**
  * Registered named routes url pattern
  */
  static data: Record<string, string> = {};
  
  static add(name: string, urlPattern: string) {
    URL.data[name] = urlPattern;
  }

  static resolve(url_path = ""): string {
    const { domain, port, protocol } = Config.get<any>("app");
    return `${protocol}://${path.join(`${domain}:${port}/`, url_path)}`;
  }

  static client(url_path: string = ""): string {
    const { domain, port, protocol } = Config.get<any>("client");
    return `${protocol}://${path.join(`${domain}:${port}`, url_path)}`;
  }

  static route(name: string, data?: Record < string, string | number >): string {
    let endpoint = URL.data[name];
    if(!endpoint) 
      throw new Error(`No url registered with name "${name}"`);
    if (data)
      endpoint = this.resolveDynamicEndpoint(endpoint, data);
    return this.resolve(endpoint);
  }
  
  static resolveDynamicEndpoint(endpoint: string, data: Record < string, string | number >) {
    const params = endpoint.match(/:(\w+)/g);
    if (params) {
      for (const param of params) {
        endpoint = endpoint.replace(param, data[param.slice(1)]?.toString())
      }
    }
    return endpoint;
  }

  static signedRoute(routeName: string, data?: Record<string, string | number>) {
    const url = new this(this.route(routeName, data));
    const signature = createHmac('sha256', Config.get("app.key")).update(url.href).digest('hex');
    url.searchParams.set('signature', signature);
    return url.href;
  }

  static temporarySignedRoute(routeName: string, expireAt: number, data?: Record < string, string | number >) {
    const url = new this(this.route(routeName, data));
    url.searchParams.set("exp", expireAt.toString());
    const signature = createHmac('sha256', Config.get("app.key")).update(url.href).digest('hex');
    return url.href;
  }
  
  static hasValidSignature(url: string | BaseURL) {
    if(typeof url === "string") {
      url = new this(url);
    }
    
    const secretKey = Config.get<string>("app.key");
    const signature = url.searchParams.get("signature");
    const expireAt = url.searchParams.get("exp");

    if (!signature || (expireAt && Date.now() > parseInt(expireAt))) {
      return false;
    }
    
    url.searchParams.delete("signature");
    const computedSignature = createHmac('sha256', secretKey).update(url.href).digest('hex');
    return computedSignature === signature;
  }
}