import { Schema } from "mongoose";

export type IProductable = {
  //
}

export default (schema: Schema) => {
  schema.add({
    authorStripeId: String,
    productId: {
      type: String,
      nullable: true
    }
  });
  schema.statics.getOwned = function() {
    //
  }
}