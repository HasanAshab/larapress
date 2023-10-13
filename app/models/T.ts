import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";

const TSchema = new Schema(
{
  //
},
{ timestamps: true }
);

TSchema.plugin(HasFactory);


export interface IT extends Document, InferSchemaType<typeof TSchema> {};
interface TModel extends Model<IT>, HasFactoryModel {};
export default model<IT, TModel>("T", TSchema);