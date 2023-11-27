import { ObjectSchema } from "joi";
import { middlewareAliases } from "~/app/http/kernel";

export type RawResponse = ({
  success?: boolean, 
  message?: string,
  data?: any[] | Record<string, any>
} & Record<string, any>) | any[];


export type constructor<T = any> = {
    new (...args: any[]): T;
};
