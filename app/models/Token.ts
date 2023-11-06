import { model, Schema, Document } from "mongoose";
import { Model } from "~/core/mongoose";
import crypto from "crypto";
import InvalidTokenException from "~/app/exceptions/InvalidTokenException";

const TokenSchema = new Schema({
  key: {
    index: true,
    required: true,
    type: String
  },
  type: {
    index: true,
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
  expiresAt: {
    type: Date,
    expires: 0,
    default: null
  }
});

TokenSchema.statics.verify = async function(this: TokenModel, key: string, type: string, secret: string) {
  const token = await this.findOneAndDelete({ key, type, secret });
  if(!token)
    throw new InvalidTokenException();
  return token.data;
}

export interface IToken {
  key: string;
  data: object | null;
  type: string;
  secret: string;
  expiresAt: Date | null;
} 

export interface TokenDocument extends Document, IToken {};

interface TokenModel extends Model<TokenDocument> {
  verify<T extends object = null>(key: string, type: string, secret: string): T;
};


export default model<TokenDocument, TokenModel>("Token", TokenSchema);