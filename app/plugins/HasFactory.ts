import { Schema } from "mongoose";
import { base } from "helpers";

export type IHasFactory = {
  factory(count?: number): {
    create(data?: object): Promise<typeof Schema | (typeof Schema)[]>;
    dummyData(data?: object): object;
  };
}


export default (schema: Schema) => {
  schema.statics.factory = function(count = 1) {
    const modelName = this.modelName;
    const Factory = require(base(`app/factories/${modelName}Factory`)).default;
    const factory = new Factory();
    return {
      create: async (data?: object): Promise<typeof Schema | (typeof Schema)[]> => {
        const models: (typeof Schema)[] = [];
        for (let i = 0; i < count; i++) {
          const model = new this(await factory.merge(data));
          models.push(model);
        }
        await this.insertMany(models);
        return models.length <= 1 ? models[0] : models;
      },
      dummyData: async (data?: object): Promise<object> => {
        return await factory.merge(data);
      },
    };
  };
}
