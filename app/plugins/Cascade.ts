import { model, Schema } from "mongoose";
import { log } from "helpers";


export interface CascadeOption {
  ref: string,
  foreignField: string
}

export default (schema: Schema, options: CascadeOption[]) => {
  async function performCascadeDeletions(ids: string | string[]) {
    for (const option of options) {
      try {
        const filter = { 
          [option.foreignField]: Array.isArray(ids)
            ? { $in: ids }
            : ids
        }
        await model(option.ref).deleteMany(filter).exec();
      } catch (error) {
        log(error);
      }
    }
  };

  schema.pre(["deleteOne", "deleteMany"], async function(next) {
    const query = this.getQuery();
    if(query._id) {
      next();
      await performCascadeDeletions(query._id);
    }
    else {
      const method = this.op === "deleteMany" ? "find" : "findOne";
      const parentDocs = await this.model[method](query).select("_id");
      next();
      const parentDocsId = Array.isArray(parentDocs) 
        ? parentDocs.map(doc => doc._id)
        : parentDocs;
      await performCascadeDeletions(parentDocsId);
    }
  });
  
}