import { Model, Document, Query } from 'mongoose';
import { Request } from 'express';

declare module 'mongoose' {
  interface Query<ResultType, DocType, THelpers = {}> {
    findOneOrFail(...args: Parameters<Model<Document>["findOne"]>): Query<ResultType, DocType, THelpers>;
    findByIdOrFail(id: string): Query<ResultType, DocType, THelpers>;
    paginate(pageSize: number, cursor?: string): Query<{ data: ResultType[]; next: string | null }, DocType, THelpers>;
    paginateReq(req: Request): Query<{ data: ResultType[]; next: string | null }, DocType, THelpers>;
  }
  interface Document {
    can(action: string, target: Document): Promise<boolean>;
  }
}
