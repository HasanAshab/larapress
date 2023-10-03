import { Model, Document, Query } from 'mongoose';
import { Request } from 'express';

declare module 'mongoose' {
  interface Model<DocType extends Document> {
    findOneOrFail(...args: Parameters<Model<DocType>['findOne']>): DocType;
    findByIdOrFail(id: string): DocType;
  }
  interface Query<ResultType, DocType, THelpers = {}> {
    paginate(pageSize: number, cursor?: string): Query<{ data: ResultType[]; next: string | null }, DocType, THelpers>;
    paginateReq(req: Request): Query<{ data: ResultType[]; next: string | null }, DocType, THelpers>;
  }
  interface Document {
    can(action: string, target: Document): Promise<boolean>;
  }
}
