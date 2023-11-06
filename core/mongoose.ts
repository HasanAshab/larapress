import { Model as MongooseModel } from 'mongoose';

export interface Model<DocType, QueryHelpers = {}> extends MongooseModel<DocType, QueryHelpers> {
  findOneOrFail(...args: Parameters<MongooseModel<DocType>['findOne']>): DocType;
  findByIdOrFail(id: string): DocType;
}
