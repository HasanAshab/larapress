import { model, Schema } from "mongoose";
import { log } from "helpers";


export interface CascadeOption {
  ref: string,
  foreignField: string
}

export default (schema: Schema, options: CascadeOption[]) => {
  schema.pre(["deleteOne", "deleteMany"], function(next) {
    const query = this.getQuery();
    if(query._id) {
      for(const option of options) {
        model(option.ref).deleteMany({ [option.foreignField]: query._id }).catch(log);
        
      }
      return next();
    }
    this.model[this.op === "deleteMany" ? "find" : "findOne"](query).select("_id").then(parentDocs => {
      next();
      const parentsId = Array.isArray(parentDocs) 
        ? parentDocs.map(doc => doc._id)
        : [parentDocs._id];
      console.log(parentsId)
      for(const option of options) {
        model(option.ref).deleteMany({ [option.foreignField]: { $in: parentsId }}).then(console.log).catch(log);
        console.log(model(option.ref))
        
      }
    }).catch(log);
  });

}