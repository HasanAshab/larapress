import { Schema, Model, Document, Query } from "mongoose";
import DocumentNotFoundException from "~/app/exceptions/DocumentNotFoundException";

interface AssertedQuery<TRawDocType, TQueryHelpers = {}> extends Query<TRawDocType, TRawDocType, TQueryHelpers> {};

declare module 'mongoose' {
  interface Model<TRawDocType, TQueryHelpers = {}> {
    where(field: string): {
      equals(value: any): Query<TRawDocType[] | null, TRawDocType, TQueryHelpers>;
    };
    updateOneById(id: string, data: object): Promise<boolean>;
    deleteOneById(id: string): Promise<boolean>;
    findOneOrFail(...args: Parameters<this['findOne']>): AssertedQuery<TRawDocType, TQueryHelpers>;
    findOneAndUpdateOrFail(...args: Parameters<this['findOneAndUpdate']>): AssertedQuery<TRawDocType, TQueryHelpers>;
    findOneAndReplaceOrFail(...args: Parameters<this['findOneAndReplace']>): AssertedQuery<TRawDocType, TQueryHelpers>;
    findOneAndReplaceOrFail(...args: Parameters<this['findOneAndReplace']>): AssertedQuery<TRawDocType, TQueryHelpers>;
    findByIdOrFail(id: string): AssertedQuery<TRawDocType, TQueryHelpers>;
    findByIdAndUpdateOrFail(...args: Parameters<this['findByIdAndUpdate']>): AssertedQuery<TRawDocType, TQueryHelpers>;
    findByIdAndRemoveOrFail(...args: Parameters<this['findByIdAndRemove']>): AssertedQuery<TRawDocType, TQueryHelpers>;
    updateOneByIdOrFail(id: string, data: object): Promise<void>;
    deleteOneByIdOrFail(id: string): Promise<void>;
  }

  interface Document {
    exists: Promise<boolean>;
  }
}

/**
 * Asserts if the searched document exists after query execution
 */
function assertExistsOnExecution(query: Query<Document, Document>) {
  const fetchDocument = query.exec.bind(query);
  query.exec = op => new Promise<Document>((resolve, reject) => {
    fetchDocument(op).catch(reject).then(doc => {
      if(doc) {
        resolve(doc);
      }
      reject(new DocumentNotFoundException(query.mongooseCollection.modelName));
    });
  });
}

/**
 * Plugin to add base helpers
 */
export default function Helpers(schema: Schema) {
  schema.statics.where = function(field: string) {
    const equals = value => {
      return this.find({ [field]: value });
    }
    
    return { equals };
  }

  
  schema.statics.updateOneById = async function(id: string, data: object) {
    const { modifiedCount } = await this.constructor.updateOne({ _id: id }, data);
    return modifiedCount === 1;
  }
  
  schema.statics.deleteOneById = async function(id: string) {
    const { deletedCount } = await this.constructor.deleteOne({ _id: id });
    return deletedCount === 1;
  }
  
  
  schema.statics.findOneOrFail = function(...args: Parameters<Model<Document>["findOne"]>) {
    const query = this.findOne(...args);
    assertExistsOnExecution(query);
    return query;
  }
  
  schema.statics.findOneAndUpdateOrFail = function(...args: Parameters<Model<Document>["findOneAndUpdate"]>) {
    const query = this.findOneAndUpdate(...args);
    assertExistsOnExecution(query);
    return query;
  }
  
  schema.statics.findOneAndReplaceOrFail = function(...args: Parameters<Model<Document>["findOneAndReplace"]>) {
    const query = this.findOneAndReplace(...args);
    assertExistsOnExecution(query);
    return query;
  }
  
  schema.statics.findOneAndDeleteOrFail = function(...args: Parameters<Model<Document>["findOneAndDelete"]>) {
    const query = this.findOneAndDelete(...args);
    assertExistsOnExecution(query);
    return query;
  }
  
  schema.statics.findByIdOrFail = function(id: string) {
    const query = this.findById(id);
    assertExistsOnExecution(query);
    return query;
  }

  schema.statics.findByIdAndUpdateOrFail = function(...args: Parameters<Model<Document>["findByIdAndUpdate"]>) {
    const query = this.findByIdAndUpdate(...args);
    assertExistsOnExecution(query);
    return query;
  }
  
  schema.statics.findByIdAndRemoveOrFail = function(...args: Parameters<Model<Document>["findByIdAndRemove"]>) {
    const query = this.findByIdAndRemove(...args);
    assertExistsOnExecution(query);
    return query;
  }
  
  schema.statics.updateOneByIdOrFail = async function(id: string, data: object) {
    if(!await this.updateOneById(id, data)) {
      throw new DocumentNotFoundException(this.modelName)
    }
  }
  
  schema.statics.deleteOneByIdOrFail = async function(id: string) {
    if(!await this.deleteOneById(id)) {
      throw new DocumentNotFoundException(this.modelName)
    }
  }
  
  
  schema.methods.delete = async function() {
    await this.constructor.deleteOneById(this._id);
  }
  
  schema.methods.update = async function(data: object, overwrite = true) {
    const document = await this.constructor.findByIdAndUpdateOrFail(this._id, data, { new: true });
    overwrite && this.overwrite(document._doc);
    return document;
  }
  
  schema.methods.refresh = async function(this: Document) {
    const latestData = await this.constructor.findByIdOrFail(this._id);
    return this.overwrite(latestData._doc);
  }
  
  schema.virtual("exists").get(async function() {
    return await this.constructor.exists({ _id: this._id });
  });
}