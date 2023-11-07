import * as http from 'http';
import Express from 'express';
import { SendFileOptions, DownloadOptions } from "express-serve-static-core";
import { RawResponse, ApiResponse } from "types";

declare module "express" {
  type Send<ResBody, T> = (body?: ResBody) => T;

  class Response<ResBody = any, LocalsObj extends Record<string, any> = Record<string, any>, StatusCode extends number = number> extends http.ServerResponse {
    app!: Express.Application;
    locals!: LocalsObj & Express.Locals;
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
    redirectToClient!: (url?: string) => void;
    
    render!: {
      (view: string, options?: object, callback?: (err: Error, html: string) => void): void;
      (view: string, callback?: (err: Error, html: string) => void): void;
    };
  
    vary!: (field: string) => this;
  
    append!: (field: string, value?: string[] | string) => this;
  
    api!: (response: RawResponse) => void;
    message!: (text?: string) => void;
  }
}