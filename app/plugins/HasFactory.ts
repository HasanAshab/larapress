import { Schema, Document } from "mongoose";

export interface HasFactoryModel {
  factory(options?: object): {
    create(data?: object): Promise<Document | Document[]>;
    dummyData(data?: object): object;
  };
}


export default (schema: Schema) => {
  let FactoryClass: any;
  schema.statics.factory = function(options?: Record<string, any>) {
    const count = options?.count ?? 1;
    const events = options?.events ?? true;
    const modelName = this.modelName;
    FactoryClass = FactoryClass ?? require(`~/app/factories/${modelName}Factory`).default;
    const factory = new FactoryClass(options);
    return {
      create: async (data?: object) => {
        const docsData: Schema[] = [];
        for (let i = 0; i < count; i++) {
          docsData.push(factory.merge(data));
        }
        const docs = await this.insertMany(docsData);
        if(events && factory.post){
          await factory.post(docs);
        }
        return count === 1 ? docs[0] : docs;
      },
      dummyData: (data?: object) => {
        return factory.merge(data);
      },
    };
  };
}