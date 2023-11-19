import { Schema, Model, Document } from "mongoose";
import DocumentNotFoundException from "~/app/exceptions/DocumentNotFoundException";

/**
 * Core plugin to add base helpers
*/
export default function Core(schema: Schema) {
  schema.statics.findOneOrFail = function(...args: Parameters<Model<Document>["findOne"]>) {
    const query = this.findOne(...args);
    const fetchDocument = query.exec.bind(query);

    query.exec = op => new Promise((resolve, reject) => {
      fetchDocument(op).catch(reject).then(doc => {
        if(doc) {
          resolve(doc);
        }
        reject(new DocumentNotFoundException(this.modelName));
      })
    });

    return query;
  }
  
  schema.statics.findByIdOrFail = function(id: string) {
    const query = this.findById(id)
    const fetchDocument = query.exec.bind(query);
    
    query.exec = op => new Promise((resolve, reject) => {
      fetchDocument(op).catch(reject).then(doc => {
        if(doc) {
          resolve(doc);
        }
        reject(new DocumentNotFoundException(this.modelName));
      })
    });
      
    return query;
  }
  
  schema.methods.refresh = async function() {
    const latestData = await (this.constructor as typeof Model).findById(this._id);
    return Object.assign(this, latestData._doc);
  }
}