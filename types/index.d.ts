import {
  ObjectSchema
} from "joi";
import commands from "register/commands";
import FileValidator from "illuminate/utils/FileValidator";
import Mailable from "illuminate/mails/Mailable";

export type RawResponse = {
  status?: number,
  message?: string,
  data?: any[] | Record < string, any >
} & Record < string, any >;

export type ApiResponse = {
  success: boolean,
  message?: string,
  data: any,
};

export type Recipient = {
  from: string,
  to: string,
  subject: string,
  template: string,
  context: Record < string,
  any >
};


export type RecipientEmails = string | string[] | ({
  email: string
} & Record < string, any >) | ({
  email: string
} & Record < string, any >)[];

export type TransportConfig = {
  host: string,
  port: number,
  secure: boolean,
  auth: {
    user: string,
    pass: string,
  }
}

export type ValidationSchema = {
  urlencoded?: {
    target: "body" | "params" | "query",
    rules: ObjectSchema
  },
  multipart?: FileValidator
}

export type MailMockedData = Record < string, Record < string, {
  mailable: Mailable,
  count: number
}>>;


export type CacheDataArg = string | number | boolean | object | unknown[] | Buffer;

type ArtisanBaseInput = `${keyof typeof commands}${`:${string}` | ''}`
