import { ObjectSchema } from "joi";
import FileValidator from "illuminate/utils/FileValidator";

export type EndpointCallback = (endpoint: string, path: string) => void | Promise < void >;

export type RawResponse = ({
  message?: string,
  data?: any[] | {[key: string]: any
  }
} & {[key: string]: any
}) | any[];

export type ApiResponse = {
  success: boolean,
  message?: string,
  data?: any[] | {[key: string]: any
  };
};

export type UrlData = {[key: string]: string | number
};

export type Recipient = {
  from: string,
  to: string,
  subject: string,
  template: string,
  context: {[key: string]: any
  }
};


export type RecipientEmails = string | string[] | ({email: string} & {[key: string]: any}) | ({email: string} & {[key: string]: any})[];

  export type TransportConfig = {
    host: string,
    port: number,
    secure: boolean,
    auth: {
      user: string,
      pass: string,
    }
  }
  
export type CacheDriverResponse = Promise<null | string>;

export type ValidationSchema = {
  urlencoded?: {
    target: "body" | "params" | "query",
    rules: ObjectSchema
  },
  multipart?: FileValidator
}