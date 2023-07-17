import { Document, Query } from 'mongoose';
import { Request } from 'express';

declare module 'mongoose' {
  interface Query<ResultType, DocType, THelpers = {}> {
    paginate(pageSize: number, cursor?: string): Query<{ data: ResultType[]; next: string | null }, DocType, THelpers>;
    paginateReq(req: Request): Query<{ data: ResultType[]; next: string | null }, DocType, THelpers>;
  }
  interface Model {
    whereCan(action: string, performer: Document): Query
  }
}
