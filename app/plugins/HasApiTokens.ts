import { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken";
const key = process.env.APP_KEY ?? "";
const tokenLifespan = Number(process.env.TOKEN_LIFESPAN);

export interface HasApiTokensDocument extends Document {
  tokenVersion: number;
  createToken(): string;
}

export default (schema: Schema) => {
  schema.add({
    tokenVersion: {
      type: Number,
      default: 0,
      required: true
    },
  });

  schema.methods.createToken = function (): string {
    return jwt.sign(
      {
        userId: this._id,
        version: this.tokenVersion,
      },
      key,
      {
        expiresIn: tokenLifespan,
      }
    );
  };
};