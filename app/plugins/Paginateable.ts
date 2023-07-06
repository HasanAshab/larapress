import { Schema } from "mongoose";

export type IPaginateable = {
  //
}

export default (schema: Schema) => {
  schema.query.paginate = async function (pageSize: number, cursor?: string) {
    if (cursor) {
      this.where('_id').gt(cursor);
    }
    const docs = await this.limit(pageSize+1).sort({_id: 1});
    let nextCursor = null;
    if (docs.length > pageSize) {
      nextCursor = docs[pageSize - 1]._id;
    }
    docs.pop();
    return {
      count: docs.length,
      [this._collection.collectionName]: docs,
      nextCursor,
    };
  };
}