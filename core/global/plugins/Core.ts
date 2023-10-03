import { Schema, Model, Document } from "mongoose";
  
export default (schema: Schema) => {
  Model.findOneOrFail = async function(...args: Parameters<Model<Document>["findOne"]>) {
    return await this.findOne(...args) 
      ?? res.status(404).message();
  }
  Model.findByIdOrFail = async function(id: string) {
    return await this.findById(id)
      ?? res.status(404).message();
  }
}