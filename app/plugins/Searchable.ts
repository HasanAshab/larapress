import { Schema, Document } from "mongoose";


export interface SearchableModel<T> {
  search(query: string): T[]
}

export default (schema: Schema) => {
  schema.statics.example = function() {
    //
  }
  
  schema.methods.example = function() {
    //
  }
}