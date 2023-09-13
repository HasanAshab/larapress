import { ObjectSchema } from "joi";
import { UploadedFile } from "express-fileupload";
import commands from "register/commands";
import FileValidator from "core/utils/FileValidator";
import Mailable from "core/mails/Mailable";

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

export type MailMockedData = Record < string, Record < string, {mailable: Mailable, count: number}>>;

export type CacheDataArg = string | number | boolean | object | unknown[] | Buffer;

type ArtisanBaseInput = `${keyof typeof commands}${`:${string}` | ''}`

export type ArrayToParamsObj<Keys extends string[]> = {
  [Key in Keys[number]]: string;
}

export type Notifiable = {
  _id: string;
  modelName: string;
} 