import { model, Schema, Document, Model } from "mongoose";

const OTPSchema = new Schema<OTPDocument>(
{
  userId: {
    required: true,
    ref: "User",
    type: Schema.Types.ObjectId,
    cascade: true,
    index: true
  },
  code: {
    type: String,
    default: () => Math.floor(100000 + Math.random() * 900000).toString(),
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
  userId: Schema.Types.ObjectId;
  code: string;
  expiresAt: Date;
};

export interface OTPDocument extends Document, IOTP {};
interface OTPModel extends Model<OTPDocument> {};

export default model<OTPDocument, OTPModel>("OTP", OTPSchema);