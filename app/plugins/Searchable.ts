import { Schema, Document, Query } from "mongoose";
import { constructor } from "types";

interface SearchableDocument extends Document {
 // search(query: string): Query;
}

/**
 * Plugin to add access controll to document
*/
export default function Searchable(schema: Schema) {

  schema.statics.search = function (query: string) {
    const q = this.find(
        { $text: { $search: query } },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .select('-score')
      log(q)
      return q
  };
  
}
