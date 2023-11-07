import { Request } from 'express';

declare module 'mongoose' {
  /*export interface Model<DocType, QueryHelpers = {}> {
    findOneOrFail(...args: Parameters<MongooseModel<DocType>['findOne']>): DocType;
    findByIdOrFail(id: string): DocType;
  }
  */
  export interface Query<ResultType, DocType, THelpers = {}> {
    paginate(pageSize: number, cursor?: string): Query<{ data: ResultType[]; next: string | null }, DocType, THelpers>;
    paginateReq(req: Request): Query<{ data: ResultType[]; next: string | null }, DocType, THelpers>;
  }
  
  export interface Document {
    can(action: string, target: Document): Promise<boolean>;
  }
}
