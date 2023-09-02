import { Schema, Document } from "mongoose";

export interface HasFactoryModel {
  factory(options?: object): {
    create(data?: object): Promise<Document | Document[]>;
    dummyData(data?: object): object;
  };
}


export default (schema: Schema) => {
  let Factory: any;
  schema.statics.factory = function(options?: Record<string, any>) {
    const count = options?.count ?? 1;
    const events = options?.events ?? true;
    const modelName = this.modelName;
    Factory = Factory ?? require(`~/app/factories/${modelName}Factory`).default;
    const factory = new Factory(options);
    return {
      create: async (data?: object) => {
        const docsData: Schema[] = [];
        for (let i = 0; i < count; i++) {
          docsData.push(factory.merge(data));
        }
        const docs = await this.insertMany(docsData);
        if(events && factory.post){
          const postPromises: any = [];
          for(const doc of docs) {
            postPromises.push(factory.post(doc));
          }
          await Promise.all(postPromises)
        }
        return count === 1 ? docs[0] : docs;
      },
      dummyData: (data?: object) => {
        return factory.merge(data);
      },
    };
  };
}