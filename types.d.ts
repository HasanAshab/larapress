import { Request as BaseRequest } from "express";
import { IUser } from "app/models/User";

export interface Request extends BaseRequest {
  user?: IUser;
}

export type EndpointCallback = (endpoint: string, path: string) => void | Promise < void >;

export type UnwrappedResponse = ({
  message?: string,
  data?: any[] | {[key: string]: any
  }
} & {[key: string]: any
}) | any[];

export type WrappedResponse = {
  success: boolean,
  message?: string,
  data?: any[] | {[key: string]: any
  };
};

export type UrlData = {[key: string]: string | number
};

export type File = {
  fieldname: string,
  filename: string,
  originalname: string,
  encoding: string,
  mimetype: string,
  size: number,
  buffer: Buffer
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