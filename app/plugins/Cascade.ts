import { model, Schema } from "mongoose";
import { log } from "helpers";


export interface CascadeOption {
  ref: string,
  foreignField: string
  justOne?: boolean
}

export default (schema: Schema, options: CascadeOption[]) => {
  schema.pre(["deleteOne", "deleteMany"], function(next) {
    const query = this.getQuery();
    for(const option of options) {
      const ChieldModel = model(option.ref);
      if(query._id) {
        ChieldModel.deleteMany({ [option.foreignField]: query._id }).catch(log);
        //return next();
      }
      this.model[this.op === "deleteMany" ? "find": "findOne"](query).select("_id").then(parentDocs => {
        //next();
        const parentsId = Array.isArray(parentDocs) 
          ? parentDocs.map(doc => doc._id)
          : [parentDocs._id];
        console.log(parentsId)
        ChieldModel.deleteMany({ [option.foreignField]: { $in: parentsId }}).then(console.log).catch(log);
      }).catch(log);
    }
  });

}