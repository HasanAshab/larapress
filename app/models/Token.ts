import { model, Schema, Model, Document } from "mongoose";
import crypto from "crypto";
import InvalidTokenException from "~/app/exceptions/InvalidTokenException";

const TokenSchema = new Schema({
  key: {
    required: true,
    type: String
  },
  type: {
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

interface TokenModel extends Model<IToken> {
  isValid(key: string, type: string, secret: string): boolean;
};


export default model<TokenDocument, TokenModel>("Token", TokenSchema);