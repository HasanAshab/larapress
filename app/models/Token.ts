import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import crypto from "crypto";

const TokenSchema = new Schema({
  key: {
    required: true,
    type: String
  },
  data: {
    type: Object,
    default: null
  },
  secret: {
    type: String,
    default: () => crypto.randomBytes(32).toString('hex')
  },
  type: {
    required: true,
    type: String
  },
  expiresAt: {
    type: Date,
    expires: 0,
    default: null
  }
});

TokenSchema.statics.isValid = async function(key: string, type: string, secret: string) {
  const token = await this.findOne({ key, type, secret });
  if(!token) return false;
  token.expiresAt && this.deleteOne({ _id: token._id });
  return true;
}


TokenSchema.plugin(HasFactory);

export interface IToken extends Document, InferSchemaType<typeof TokenSchema> {};
interface TokenModel extends Model<IToken>, HasFactoryModel {};
export default model<IToken, TokenModel>("Token", TokenSchema);