import { NextFunction, RequestHandler, Request, Response } from "express";
import { constructor } from "types"; 
import { Model } from "mongoose";
import Config from "Config";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { container } from "tsyringe";
import { formatDistanceToNow } from 'date-fns';
import { fileURLToPath } from 'url';


export const filename = (url: string) => fileURLToPath(url);
export const dirname = (url: string) => fileURLToPath(new URL('.', url));

/**
 * Logs data on different channels based on config
*/
export async function log(data: any) {
  const logChannel = Config.get<string>("app.log");
  if(logChannel === "file"){
    const path = "./storage/logs/error.log";
    if(data instanceof Error)
      data = data.stack
    await fs.appendFile(path, `${new Date()}:\n${data.toString()}\n\n\n`);
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
  const { stack } = new Error();
  if(!stack)
    throw new Error("Failed to track caller.");
  const caller = logFullTrace
    ? stack.split('\n').splice(1).join('\n')
    : stack.split('\n')[2].trim();
  console.log(message, '\n\t', '\x1b[90m', caller, '\x1b[0m', '\n');
}

/**
 * Get env var.
*/
export function env(key: string, fallback?: string) {
  return process.env[key] ?? fallback;
}

/**
 * Updates environment process and file.
 * Returns updated env.
*/
export async function putEnv(data: Record<string, string>) {
  const envConfig = dotenv.parse(await fs.readFile(".env"));
  if(!data) return envConfig;
  for (const key in data) {
    process.env[key] = data[key];
    envConfig[key] = data[key];
  }
  await fs.writeFile(".env", Object.entries(envConfig).map(([k, v]) => `${k}=${v}`).join("\n"));
  return envConfig;
}

/**
 * Converts to absolute path
*/
export function base(...basePaths: string[]) {
  return path.join(dirname(import.meta.url), "..", ...basePaths);
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
  let params: string[] = [];
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
 * Wether a value is pure Object or not
*/
export function isPureObject(target: any): target is object {
  return typeof target === "object" && !Array.isArray(target);
}

/**
 * Stop execution for given time
*/
export function sleep(seconds: number) {
  return new Promise(r => setTimeout(r, seconds * 1000));
}

/**
 * Convert a date to human readable format like `20 minutes ago`
 */
export function toHumanReadableFormat(date: string | Date) {
  if(typeof date === "string") {
    date = new Date(date);
  }
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Resolve dependency
*/ 
export function resolve<T = unknown>(dependency: string | constructor<T>): T {
  return container.resolve<T>(dependency);
}
