import { Schema, Model, Document } from "mongoose";
import DocumentNotFoundException from "~/app/exceptions/DocumentNotFoundException";

/**
 * Core plugin to add base helpers
*/
export default (schema: Schema) => {

  schema.statics.findOneOrFail = function(...args: Parameters<Model<Document>["findOne"]>) {
    const query = this.findOne(...args);
    
    query.then = function(onFullFill, onReject) {
      this.exec().catch(onReject).then(doc => {
        if(doc) {
          onFullFill(doc);
        }
        onReject(new DocumentNotFoundException());
      });
    }

    return query;
  }
  
  schema.statics.findByIdOrFail = async function(id: string) {
    const query = this.findById(id)
        
    query.then = function(onFullFill, onReject) {
      this.exec().catch(onReject).then(doc => {
        if(doc) {
          onFullFill(doc);
        }
        onReject(new DocumentNotFoundException());
      });
    }

    return query;
  }
  
  schema.methods.refresh = async function() {
    const latestData = await (this.constructor as typeof Model).findById(this._id);
    return Object.assign(this, latestData._doc);
  }
}