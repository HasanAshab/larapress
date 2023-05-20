import { Schema } from 'mongoose';
import { base, route } from "helpers";
//TODO  statics interface
export type IHasFactory = {
  factory(count?: number): {
    create(data?: object): Promise<typeof Schema | (typeof Schema)[]>;
    dummyData(data?: object): object;
  };
}


export default function hasFactory(schema: Schema): void {
  schema.statics.factory = function(count = 1) {
    const modelName = this.modelName;
    const Factory = require(base(`app/factories/${modelName}Factory`));
    const factory = new Factory();
    return {
      create: async (data?: object): Promise<typeof Schema | (typeof Schema)[]> => {
        const models: (typeof Schema)[] = [];
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
