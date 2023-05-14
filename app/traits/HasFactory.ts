import { Schema, Document } from 'mongoose';

export type IHasFactory<T extends Document> = {
  factory(count?: number): {
    create(data?: object): Promise<T | T[]>;
    dummyData(data?: object): object;
  };
}


export default function hasFactory<T extends Document>(schema: Schema<T>): void {
  schema.statics.factory = function(count = 1) {
    const modelName = new this().constructor.modelName;
    const Factory = require(base(`app/factories/${modelName}Factory`));
    const factory = new Factory();
    return {
      create: async (data?: object): Promise<T | T[]> => {
        const models: T[] = [];
        for (let i = 0; i < count; i++) {
          const model = new this(factory.merge(data));
          await model.save();
          models.push(model);
        }
        return models.length <= 1 ? models[0] : models;
      },
      dummyData: (data?: object): object => {
        return factory.merge(data);
      },
    };
  };
}
