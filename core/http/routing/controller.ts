export type Handler = (...args: any[]) => any | Promise<any>;

export type Controller<Keys extends string = any> = {
    new (...args: any[]): { [Key in Keys]: Handler } & any;
}

export type InvokableController = Controller<"__invoke">;

export type APIResourceController = Controller<"index" | "store" | "show" | "update" | "delete">;
