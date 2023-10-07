import { NextFunction, RequestHandler, Request, Response } from "express";
import { ResponseData } from "~/core/express";
import { MiddlewareKeyWithOptions } from "types"; 
import { Model } from "mongoose";
import config from "config";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { middlewareAliases } from "~/app/http/kernel";
import { container } from "tsyringe";


/**
 * Logs data on different channels based on config
*/
export async function log(data: any) {
  const logChannel = config.get<string>("log");
  if(logChannel === "file"){
    const path = "./storage/logs/error.log";
    if(data instanceof Error){
      data = data.stack
    }
    fs.appendFile(path, `${new Date()}:\n${data.toString()}\n\n\n`, (err: any) => {
      if (err)
        throw err;
    });
  }
  else if(logChannel === "console"){
    console.log(data)
  }
}

/**
 * Get env var.
*/
export function env(key: string, fallback: string) {
  return process.env[key] ?? fallback;
}

/**
 * Updates environment process and file.
 * Returns updated env.
*/
export function putEnv(data: Record<string, string>) {
  const envConfig = dotenv.parse(fs.readFileSync(".env"));
  if(!data) return envConfig;
  for (const key in data) {
    process.env[key] = data[key];
    envConfig[key] = data[key];
  }
  try {
    fs.writeFileSync(".env", Object.entries(envConfig).map(([k, v]) => `${k}=${v}`).join("\n"));
  }
  catch(err: any) {
    throw err;
  }
  return envConfig;
}


export function getParams(func: Function) {
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

/**
 * Send response globally.
 * Avoid as much as possible. Use custom exception instead.
*/ 

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

