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
        const models: (typeof Schema)[] = [];
        for (let i = 0; i < count; i++) {
          const model = new this(factory.merge(data));
          models.push(model);
        }
        await this.insertMany(models);
        return count === 1 ? models[0] : models;
      },
      dummyData: (data?: object) => {
        return factory.merge(data);
      },
    };
  };
}
