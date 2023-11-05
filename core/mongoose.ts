import { Model as MongooseModel } from 'mongoose';

export interface Model<DocType> extends MongooseModel<DocType> {
  findOneOrFail(...args: Parameters<Model<DocType>['findOne']>): DocType;
  findByIdOrFail(id: string): DocType;
}
