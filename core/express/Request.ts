import * as http from 'http';
import { UserDocument } from "~/app/models/User";
import Express from 'express';
import { UploadedFile } from "express-fileupload";
import Joi from "joi";

export class Request<P = any, ResBody = any, ReqBody = any, ReqQuery = any, LocalsObj extends Record<string, any> = Record<string, any>> extends http.IncomingMessage {
  app!: Express.Application;
  body!: ReqBody;
  cookies!: any;
  fresh!: boolean;
  hostname!: string;
  ip!: string;
  ips!: string[];
  method!: string;
  originalUrl!: string;
  params!: P;
  path!: string;
  protocol!: string;
  query!: ReqQuery;
  route!: any;
  signedCookies!: any;
  stale!: boolean;
  subdomains!: string[];
  xhr!: boolean;
  files!: Record<string, UploadedFile | UploadedFile[]>;

  get!: {
    (name: 'set-cookie'): string[] | undefined;
    (name: string): string | undefined;
  };

  header!: {
    (name: 'set-cookie'): string[] | undefined;
    (name: string): string | undefined;
  };

  accepts!: {
    (): string[];
    (type: string): string | false;
    (type: string[]): string | false;
    (...type: string[]): string | false;
  };

  acceptsCharsets!: {
    (): string[];
    (charset: string): string | false;
    (charset: string[]): string | false;
    (...charset: any): any;
  };

  acceptsEncodings!: {
    (): string[];
    (encoding: string): string | false;
    (encoding: string[]): string | false;
    (...encoding: any): any;
  };

  acceptsLanguages!: {
    (): string[];
    (lang: string): string | false;
    (lang: string[]): string | false;
    (...lang: any): any;
  };
  
  accepted!: Express.MediaType[];


  range!: (size: number, options?: any) => any;

  param(name: string, defaultValue?: any): string {
    return '' as string;
  }

  is!: {
    (type: string | string[]): string | false | null;
  };
  url!: string;
  baseUrl!: string;
  fullUrl!: () => string;
  host!: string;
  secure!: boolean;

  static rules() {
    return {} as Record<string, Joi.AnySchema>;
  }
}

export class AuthenticRequest extends Request {
  user!: UserDocument;
}
  
export function isRequest(target: any): target is typeof Request {
  return target === Request || target.prototype instanceof Request
}
