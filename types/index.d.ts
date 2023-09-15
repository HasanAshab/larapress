import { ObjectSchema } from "joi";
import FileValidator from "core/utils/FileValidator";

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

export type ArrayToParamsObj<Keys extends string[]> = {
  [Key in Keys[number]]: string;
}