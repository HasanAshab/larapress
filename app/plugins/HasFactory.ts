import { Schema, Document } from "mongoose";
import { base } from "helpers";

export interface HasFactoryModel {
  factory(count?: number): {
    create(data?: object): Promise<Document | Document[]>;
    dummyData(data?: object): object;
  };
}


export default (schema: Schema) => {
  schema.statics.factory = function(count = 1) {
    const modelName = this.modelName;
    const Factory = require(base(`app/factories/${modelName}Factory`)).default;
    const factory = new Factory();
    return {
      create: async (data?: object) => {
        const docs: Schema[] = [];
        for (let i = 0; i < count; i++) {
          const doc = new this(factory.merge(data));
          docs.push(doc);
        }
        await this.insertMany(docs);
        return count === 1 ? docs[0] : docs;
      },
      dummyData: (data?: object) => {
        return factory.merge(data);
      },
    };
  };
}