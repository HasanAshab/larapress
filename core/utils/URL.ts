import Config from 'Config';
import path from "path";
import crypto from "crypto";
import Router from "Router";

export default class URL {
  static add(name: string, urlPattern: string) {
    Router.$namedUrls[name] = urlPattern;
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
    let endpoint = Router.$namedUrls[name];
    if(!endpoint) 
      throw new Error(`No url registered with name "${name}"`);
    if (data) {
      this.resolveDynamicEndpoint(endpoint, data);
    }
    return this.resolve(endpoint);
  }
  
  static resolveDynamicEndpoint(endpoint: string, data: Record < string, string | number >) {
    const params = endpoint.match(/:(\w+)/g);
    if (params) {
      for (const param of params) {
        endpoint = endpoint.replace(param, data[param.slice(1)]?.toString())
      }
    }
  }

  static signedRoute(routeName: string, data?: Record<string, string | number>) {
    const url = this.route(routeName, data);
    const signature = crypto.createHmac('sha256', Config.get("app.key")).update(url).digest('hex');
    return `${url}&signature=${signature}`;
  }

  static temporarySignedRoute(routeName: string, expireAt: number, data?: Record < string, string | number >) {
    const url = this.route(routeName, data);
    const signature = crypto.createHmac('sha256', Config.get("app.key")).update(`${url}&exp=${expireAt}`).digest('hex');
    return `${url}&exp=${expireAt}&signature=${signature}`;
  }
  
  static hasValidSignature(url: string) {
    const urlParts = url.split('&');
    const signaturePart = urlParts.find((part) => part.startsWith('signature='));
    const expPart = urlParts.find((part) => part.startsWith('exp='));
    if (!signaturePart)
      return false;
    const secretKey = Config.get("app.key");
    if (expPart) {
      const signature = signaturePart.split('=')[1];
      const expTimestamp = parseInt(expPart.split('=')[1]);

      if (Date.now() > expTimestamp)
        return false;

      const urlWithoutSignature = url.replace(`&${signaturePart}`, '');
      const computedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(urlWithoutSignature)
        .digest('hex');
      return computedSignature === signature;
    } 
    else {
      const signature = signaturePart.split('=')[1];
      const urlWithoutSignature = url.replace(`&${signaturePart}`, '');
      const computedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(urlWithoutSignature)
        .digest('hex');
      return computedSignature === signature;
    }
  }
}