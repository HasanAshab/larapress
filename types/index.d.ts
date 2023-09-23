import config from "~/config/default";
import { ObjectSchema } from "joi";
import FileValidator from "core/utils/FileValidator";
import { middlewareAliases } from "~/app/http/kernel";

export type Config = typeof config;

export type RawResponse = ({
  success?: boolean, 
  message?: string,
  data?: any[] | Record < string, any >
} & Record < string, any >) | any[];

export type ApiResponse = {
  success: boolean,
  message?: string,
  data?: Record < string, any > | any[],
} & Record < string, any >;


export type ValidationSchema = {
  urlencoded?: {
    target: "body" | "query",
    rules: ObjectSchema
  };
  multipart?: ReturnType<FileValidator.schema>;
}

export type MiddlewareKeyWithOptions = keyof typeof middlewareAliases | `${keyof typeof middlewareAliases}:${string}` | [keyof typeof middlewareAliases, object];

export type ArrayToParamsObj<Keys extends string[]> = {
  [Key in Keys[number]]: string;
}
