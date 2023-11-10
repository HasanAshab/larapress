import { Request } from '~/core/express';

declare module 'mongoose' {
  interface Model<TRawDocType> {
    findOneOrFail(...args: Parameters<Model<TRawDocType>['findOne']>): TRawDocType;
    findByIdOrFail(id: string): TRawDocType;
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
