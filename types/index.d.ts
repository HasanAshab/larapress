import { ObjectSchema } from "joi";
import { middlewareAliases } from "~/app/http/kernel";

export type RawResponse = ({
  success?: boolean, 
  message?: string,
  data?: any[] | Record<string, any>
} & Record<string, any>) | any[];

export type ApiResponse = {
  success: boolean,
  message?: string,
  data?: Record<string, any> | any[],
} & Record<string, any>;


export type MiddlewareKeyWithOptions = keyof typeof middlewareAliases | `${keyof typeof middlewareAliases}:${string}`;