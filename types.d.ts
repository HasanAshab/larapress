export type EndpointCallback = (endpoint: string, path: string) => void | Promise<void>;

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