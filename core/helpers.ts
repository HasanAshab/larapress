import { NextFunction, RequestHandler, Request, Response } from "express";
import { ResponseData } from "~/core/express";
import { MiddlewareKeyWithOptions } from "types"; 
import { Model } from "mongoose";
import Config from "Config";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { container } from "tsyringe";


/**
 * Logs data on different channels based on config
*/
export async function log(data: any) {
  const logChannel = Config.get<string>("app.log");
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
 * Logs messages with a beautified call stack.
 * Inspired by Jest
*/
export function trace(message: string, logFullTrace = false) {
  const caller = logFullTrace
    ? new Error().stack.split('\n').splice(1).join('\n')
    : new Error().stack.split('\n')[2].trim();
  console.log(message, '\n\t', '\x1b[90m', caller, '\x1b[0m', '\n');
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

/**
 * Converts to absolute path
*/
export function base(...basePaths: string[]) {
  return path.join(__dirname, "..", ...basePaths);
}

/**
 * Get parameter names of a function.
 * It's not able to detect parameter names
 * on edge cases
*/
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
 * Generate random string
*/
export function randomStr(length: number) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }

  return randomString;
}

/**
 * Stop execution for given time
*/
export function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}


/**
 * Resolve dependency
*/ 
export function resolve(dependency: string | Function) {
  return container.resolve(dependency);
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

export const response = {
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
  response[methodName] = function(...args: any[]) {
    this.steps.push([methodName, args])
    return this;
  }
});

methods.senders.forEach(methodName => {
  response[methodName] = function(...args: any[]) {
    this.steps.push([methodName, args])
    const responseData = new ResponseData(this.steps);
    this.steps = [];
    throw responseData;
  }
});

