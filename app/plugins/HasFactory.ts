import { Schema, Document } from "mongoose";

export interface HasFactoryModel {
  factory(config?: number | Record<string, any>): {
    create(data?: object): Promise<Document | Document[]>;
    dummyData(data?: object): object;
  };
}


export default (schema: Schema) {
  let Factory: any;
  
  function importFactoryOnce(modelName: string) {
    if(!Factory)
      Factory = require(`~/app/factories/${modelName}Factory`).default;
  }
  
  function mergeFields(modelData: Record<string, any>, data?: Record<string, any>) {
    if(!data){
      return modelData;
    }
    for (const field in data){
      if(typeof data[field] !== "undefined")
        modelData[field] = data[field];
    }
    return modelData;
  };

  
  schema.statics.factory = function(configOrCount?: number | Record<string, any>) {
    importFactoryOnce(this.modelName);
    const factory = new Factory();
    
    const config = typeof configOrCount === "number"
      ? { count: configOrCount }
      : configOrCount;
    config.count = config.count ?? 1;
    factory.setConfig(config)
    
    return {
      create: async (data?: object) => {
        const docsData: Schema[] = [];
        for (let i = 0; i < factory.config.count; i++) {
          docsData.push(mergeFields(factory.definition(), data));
        }
        const docs = await this.insertMany(docsData);
        if(factory.config.events && factory.post){
          await factory.post(docs);
        }
        return factory.config.count === 1 ? docs[0] : docs;
      },
      dummyData: (data?: object) => {
        return factory.merge(data);
      },
    };
  };
}