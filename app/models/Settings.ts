import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "app/plugins/HasFactory";

const SettingsSchema = new Schema(
{
  userId: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  data: Object
},
{ timestamps: true }
);

SettingsSchema.plugin(HasFactory);


export interface ISettings extends Document, InferSchemaType<typeof SettingsSchema> {};
interface SettingsModel extends Model<ISettings>, HasFactoryModel {};
export default model<ISettings, SettingsModel>("Settings", SettingsSchema);