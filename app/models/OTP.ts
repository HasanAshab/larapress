import { model, Schema, Document } from "mongoose";
import { Model } from "~/core/mongoose";

const OTPSchema = new Schema(
{
  userId: {
    required: true,
    ref: "User",
    type: Schema.Types.ObjectId,
    cascade: true,
    index: true
  },
  code: {
    type: string,
    default: () => Math.floor(100000 + Math.random() * 900000),
    index: true
  },
  expiresAt: {
    type: Date,
    expires: 0,
    default: () => Date.now() + 60000
  }
},
{
  timestamps: { createdAt: true }
}
);

export interface IOTP {
  userId: string;
  code: string;
  expiresAt: Date;
};

export interface OTPDocument extends Document, IOTP {};
interface OTPModel extends Model<OTPDocument> {};

export default model<OTPDocument, OTPModel>("OTP", OTPSchema);