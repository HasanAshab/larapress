import { Request } from '~/core/express';

declare module 'mongoose' {
  type LeanDocument<DocType = Document> = DocType & DocType extends { $locals: never }
  ? DocType
  : 'Please lean the document';
  
  /*
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
  }*/
  
  interface Query {
    mongooseCollection: {
      modelName: string;
    };
  }
  
  interface Document {
    constructor: Model<Document>;
  }
  interface Schema {
    methods: Record<string, (this: Document, ...args: any[]) => any | Promise<any>>;
  }
}
