import { model, Schema, Model, Document } from "mongoose";
import crypto from "crypto";
import { log } from "~/core/utils";
import InvalidTokenException from "~/app/exceptions/InvalidTokenException";

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

TokenSchema.statics.isValid = async function(this: TokenModel, key: string, type: string, secret: string) {
  const token = await this.findOne({ key, type, secret });
  if(!token) return false;
  token.expiresAt && this.deleteOne({ _id: token._id }).catch(log);
  return true;
}

TokenSchema.statics.assertValid = async function(this: TokenModel, key: string, type: string, secret: string) {
  const isValid = await this.isValid(key, type, secret);
  if(!isValid)
    throw new InvalidTokenException();
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