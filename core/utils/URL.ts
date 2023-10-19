import config from 'config';
import Token, { IToken } from "~/app/models/Token";
import path from "path";
import crypto from "crypto";


export default class URL {
  static _urlsMap = {};
  
  static add(name: string, urlPattern: string) {
    this._urlsMap[name] = urlPattern;
  }
  
  static register(nameWithUrlPattern: Record<string, string>) {
    Object.assign(this._urlsMap, nameWithUrlPattern);
  }
  
  static resolve(url_path = ""): string {
    const { domain, port, protocol } = config.get<any>("app");
    return `${protocol}://${path.join(`${domain}:${port}/`, url_path)}`;
  }

  static client(url_path: string = ""): string {
    const { domain, port, protocol } = config.get<any>("client");
    return `${protocol}://${path.join(`${domain}:${port}`, url_path)}`;
  }

  static route(name: string, data?: Record < string, string | number >): string {
    let endpoint = this._urlsMap[name];
    if(!endpoint) 
      throw new Error(`No url registered with name "${name}"`);
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

  static async signedRoute(routeName: keyof Config["urls"], data?: Record < string, string | number >, expireAfter?: number) {
    const fullUrl = this.route(routeName, data);
    const path = fullUrl.replace(this.resolve(), "/");
    const payload: Partial<IToken> = {
      type: "urlSignature",
      data: { fullUrl }
    }
    if(!expireAfter) {
      const token = await Token.findOne({
        type: payload.type,
        "data.fullUrl": payload.data.fullUrl
      });
      if(token) return token.data.originalUrl;
    }
    let [baseUrl, queryString] = fullUrl.split("?");
    payload.secret = crypto.randomBytes(32).toString('hex');
    if(queryString)
      queryString += "&sign=" + payload.secret;
    else queryString = "?sign=" + payload.secret;
    payload.data.originalUrl = baseUrl + queryString;
    payload.key = path + queryString;
    if(expireAfter) {
      payload.expiresAt = new Date(Date.now() + expireAfter);
    }
    await Token.create(payload);
    return payload.data.originalUrl;
  }
}