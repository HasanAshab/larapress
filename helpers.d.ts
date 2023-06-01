import { UrlData } from "types";
import { RequestHandler } from "express";
export declare function base(base_path?: string): string;
export declare function capitalizeFirstLetter(str: string): string;
export declare function url(url_path?: string): string;
export declare function clientUrl(url_path?: string): string;
export declare function route(name: string, data?: UrlData): string;
export declare function storage(storage_path?: string): string;
export declare function middleware(keys: string | string[], version?: string): RequestHandler[] | RequestHandler;
export declare function controller(name: string, version?: string): Record<string, RequestHandler | RequestHandler[]>;
export declare function setEnv(envValues: object): boolean;
export declare function log(data: any): void;
export declare function getVersion(path?: string): string;
export declare function checkProperties(obj: any, properties: Record<string, string>): boolean;
export declare function getParams(func: Function): string[];
