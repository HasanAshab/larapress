import { Request } from '~/core/express';

declare module 'mongoose' {
  interface Model<TRawDocType, QueryHelpers = {}> {
    findOneOrFail(...args: Parameters<Model<TRawDocType>['findOne']>): Query<TRawDocType, TRawDocType, TQueryHelpers>;
    findByIdOrFail(id: string): Query<TRawDocType, TRawDocType, TQueryHelpers>;
  }
  
  interface Query<ResultType, DocType, THelpers = {}> {
    paginate(pageSize: number, cursor?: string): Query<{ data: ResultType[]; next: string | null }, DocType, THelpers>;
    paginateReq(req: Request): Query<{ data: ResultType[]; next: string | null }, DocType, THelpers>;
  }
  
  interface Document {
    constructor: Model<Document>;
    can(action: string, target: Document): Promise<boolean>;
  }
}
