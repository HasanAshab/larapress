import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";

const RoleSchema = new Schema({
  name: {
    required: true,
    type: String,
    unique: true
  }
});

RoleSchema.plugin(HasFactory);


export interface IRole extends Document, InferSchemaType<typeof RoleSchema> {};
interface RoleModel extends Model<IRole>, HasFactoryModel {};
export default model<IRole, RoleModel>("Role", RoleSchema);