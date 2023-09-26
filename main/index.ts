import "reflect-metadata";
import "dotenv/config";
(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "loadTest")
  && require('module-alias/register');
import config from 'config';
import app from "~/main/app";
import Setup from "~/main/Setup";
import DB from "DB";
import Mail from "Mail";
process.env.NODE_ENV === "loadTest" && (Mail as any).mock();
import https from "https";
import fs from "fs";

const log = process.env.NODE_ENV === "development";

// Connect to database
if (false && config.get("db.connect")) {
  log && console.log("Connecting to database...");
  DB.connect().then(async () => {
    log && console.log("DB connected!");
    Setup.mongooseModels();
  });
}

// Registering Cron Jobs
Setup.cronJobs();

let server;
const loadBalancerConfig = config.get<any>("loadBalancer");
if(loadBalancerConfig.enabled) {
  console.log(`load Balancer: [http://127.0.0.1:${config.get("app.port")}]\n`)
  console.log("Server Instances:")
  for (const port of loadBalancerConfig.ports) {
    app.listen(port, () => {
      console.log(`[http://127.0.0.1:${port}]`);
    }).on("connection", (socket) => {
      const time = new Date().toLocaleTimeString("en-US", { hour12: true });
      log && console.log(`*New connection on port ${port} [${time}]`);
    });
  }
}

else {
  const port = config.get<number>("app.port");
  server = app.listen(port, () => {
    process.env.NODE_ENV !== "test" && console.log(`Server running on [http://127.0.0.1:${port}] ...`);
  });
  
  log && server.on("connection", (socket) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: true });
    console.log(`*New connection: [${time}]`);
  });
}

import { IsString, IsEmail, IsNotEmpty, MinLength, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { container } from 'tsyringe';
import TwoFactorAuthService from "~/app/services/TwoFactorAuthService";

import * as http from 'http';

import Express from 'express';
import { SendFileOptions, DownloadOptions } from "express-serve-static-core";

abstract class Request<
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


type Send<ResBody, T> = (body?: ResBody) => T;

class Response<
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



class LoginRequest extends Request {
  user!: object;
  body!: { 
    email: string;
    password: string;
    otp: number;
  };
  
  protected rules() {
    return {
      email: Validator.string().email().required(),
      password: Validator.string().required(),
      otp: Validator.number(),
      logo: Validator.file()
    }
  }
}

function getParams(func) {
  let str = func.toString();
  str = str.replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/(.)*/g, '')
    .replace(/{[\s\S]*}/, '')
    .replace(/=>/g, '')
    .trim();
  let start = str.indexOf("(") + 1;
  let end = str.length - 1;
  let result = str.substring(start, end).split(", ");
  let params = [];
  result.forEach(element => {
    element = element.replace(/=[\s\S]*/g, '').trim();
      if (element.length > 0)
        params.push(element);
  });
  return params;
}

function RequestHandler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const handler = descriptor.value;
  const paramNames = getParams(handler);
  const paramTypes = Reflect.getMetadata("design:paramtypes", target, propertyKey);
  console.log(paramTypes, paramNames)
  const args = [];
  let reqIndex = -1;
  let resIndex = -1;
  const paramsIndex = {};
  for(let i = 0; i < paramNames.length; i++) {
    const paramType = paramTypes[i];
    const paramName = paramNames[i];
    if(paramType === Request || paramType.prototype instanceof Request) {
      reqIndex = i;
    }
    else if(paramType === Response){
      resIndex = i;
    }
    else if(paramType.name === "String" || paramType.name === "Object"){
      paramsIndex[paramName] = i;
    }
    else {
      args[i] = container.resolve(paramType);
    }
  }
  descriptor.value = async function(req, res, next) {
    for(const paramName in paramsIndex) {
      args[paramsIndex[paramName]] = req.params[paramName];
      }
      args[reqIndex] = req;
      args[resIndex] = res;
    try {
      console.log(args)
      //console.log(handler.length)
      await handler.apply(target, args);
    }
    catch(err) {
      next(err)
    }
  }
};

class JustNothing {
  @RequestHandler
  ehhe(res: Response, req: Request, service: TwoFactorAuthService, ba = "jd") {
    console.log(req, res, service, ba)
    /*res.download("foo/bar", "djd")
    res.download("foo/bar", console.log)
    res.download("foo/bar", false)
    req.headers
    req.body
    req.foo
    req.app
    //console.log(bar)
    */
  }
}

const req: any = {body: {foo: 93}, params: {bar:82}}
new JustNothing().ehhe(req, {}, console.log)

export default server;