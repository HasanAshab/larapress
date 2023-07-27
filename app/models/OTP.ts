import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "app/plugins/HasFactory";

const OTPSchema = new Schema(
{
  userId: {
    required: true,
    type: Schema.Types.ObjectId
  },
  code: {
    required: true,
    type: Number
  },
  expiresAt: {
    required: true,
    type: Date,
    expires: 0
  }
},
{ createdAt: true }
);

OTPSchema.plugin(HasFactory);


export interface IOTP extends Document, InferSchemaType<typeof OTPSchema> {};
interface OTPModel extends Model<IOTP>, HasFactoryModel {};
export default model<IOTP, OTPModel>("OTP", OTPSchema);