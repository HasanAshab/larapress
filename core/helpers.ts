import { NextFunction, RequestHandler, Request, Response } from "express";
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
 * Returns environment variables, if envValues is provided else it updates environment
*/
export function env(envValues?: Record<string, string>) {
  const envConfig = dotenv.parse(fs.readFileSync(".env"));
  if(!envValues) return envConfig;
  for (const key in envValues) {
    process.env[key] = envValues[key];
    envConfig[key] = envValues[key];
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
