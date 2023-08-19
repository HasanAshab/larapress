import { Schema } from "mongoose";

export default (schema: Schema) => {  
  schema.statics.findOneOrCreate = async function (filter) {
    return await this.findOne(filter) 
      ?? await this.create(filter);
  }
}