import * as http from 'http';
import { UserDocument } from "~/app/models/User";
import Express from 'express';
import { SendFileOptions, DownloadOptions } from "express-serve-static-core";
import { RawResponse, ApiResponse } from "types";

type Send<ResBody, T> = (body?: ResBody) => T;

export abstract class Request<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
  LocalsObj extends Record<string, any> = Record<string, any>
> extends http.IncomingMessage {
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
  api!: (response: RawResponse) => ApiResponse;
  message!: (text?: string) => void;
  
  protected abstract rules(): object;

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

  range!: (size: number, options?: any) => any;

  param(name: string, defaultValue?: any): string {
    return '' as string;
  }

  is!: {
    (type: string | string[]): string | false | null;
  };
}

export class AuthenticRequest extends Request {
  user!: UserDocument;
}

export class Response<
  ResBody = any,
  LocalsObj extends Record<string, any> = Record<string, any>,
  StatusCode extends number = number
> extends http.ServerResponse {
  app!: Express.Application;
  locals: LocalsObj & Express.Locals = {};
  status!: (code: StatusCode) => this;
  sendStatus!: (code: StatusCode) => this;

  links!: (links: any) => this;

  send!: Send<ResBody, this>;

  json!: Send<ResBody, this>;

  jsonp!: Send<ResBody, this>;

  sendFile!: {
    (path: string, fn?: Express.Errback): void;
    (path: string, options: SendFileOptions, fn?: Express.Errback): void;
  };

  sendfile!: {
    (path: string): void;
    (path: string, options: SendFileOptions): void;
    (path: string, fn: Express.Errback): void;
    (path: string, options: SendFileOptions, fn: Express.Errback): void;
  };

  download!: {
    (path: string, fn?: Express.Errback): void;
    (path: string, filename: string, fn?: Express.Errback): void;
    (path: string, filename: string, options: DownloadOptions, fn?: Express.Errback): void;
  };

  contentType!: (type: string) => this;

  type!: (type: string) => this;

  format!: (obj: any) => this;

  attachment!: (filename?: string) => this;

  set!: {
    (field: any): Response;
    (field: string, value?: string | string[]): Response;
  };

  header!: {
    (field: any): Response;
    (field: string, value?: string | string[]): Response;
  };

  clearCookie!: (name: string, options?: Express.CookieOptions) => this;

  cookie!: {
    (name: string, val: string, options: Express.CookieOptions): Response;
    (name: string, val: any, options: Express.CookieOptions): Response;
    (name: string, val: any): Response;
  };

  location!: (url: string) => this;

  redirect!: {
    (url: string): void;
    (status: number, url: string): void;
    (url: string, status: number): void;
  };

  render!: {
    (view: string, options?: object, callback?: (err: Error, html: string) => void): void;
    (view: string, callback?: (err: Error, html: string) => void): void;
  };

  vary!: (field: string) => this;

  append!: (field: string, value?: string[] | string) => this;
}

export class ResponseData {
  constructor(steps){
    this.steps = steps;
  }
  send(res) {
    for(const step of this.steps) {
      res[step[0]](...step[1])
    }
  }
}

export const res = {
  steps: []
} as ResponseType

const methods = {
  customizers: [
    'status',
    'links',
    'type',
    'contentType',
    'format',
    'attachment',
    'set',
    'header',
    'vary',
    'append',
  ],
  senders: [
    'send',
    'json',
    'jsonp',
    'sendFile',
    'download',
    'location',
    'redirect',
    'render',
    'cookie',
    'clearCookie',
    'message',
    'api'
  ],
};

methods.customizers.forEach(methodName => {
  res[methodName] = function(...args: any[]) {
    this.steps.push([methodName, args])
    return this;
  }
});

methods.senders.forEach(methodName => {
  res[methodName] = function(...args: any[]) {
    this.steps.push([methodName, args])
    const responseData = new ResponseData(this.steps);
    this.steps = [];
    throw responseData;
  }
});

type ResponseType = {
  steps: Array<[string, any[]]>;
} & {
  [K in typeof methods.customizers[number]]: (
    ...args: Parameters<Express.Response[K]>
  ) => ResponseType;
} & {
  [K in typeof methods.senders[number]]: (
    ...args: Parameters<Express.Response[K]>
  ) => void;
};
