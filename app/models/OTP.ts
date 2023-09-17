import { model, Schema, Model, Document, InferSchemaType } from "mongoose";

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
{
  timestamps: { createdAt: true }
}
);

export interface IOTP extends InferSchemaType<typeof OTPSchema> {};
export interface OTPDocument extends Document, IOTP {};
interface OTPModel extends Model<OTPDocument> {};
export default model<OTPDocument, OTPModel>("OTP", OTPSchema);