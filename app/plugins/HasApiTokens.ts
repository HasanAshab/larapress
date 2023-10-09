import { Schema, Document } from "mongoose";
import config from "config";
import jwt from "jsonwebtoken";

export interface HasApiTokensDocument extends Document {
  tokenVersion: number;
  createToken(): string;
}

export default (schema: Schema) => {
  schema.add({
    tokenVersion: {
      type: Number,
      default: 0
    },
  });

  schema.methods.createToken = function (): string {
    return jwt.sign(
      { version: this.tokenVersion },
      config.get("app.key"),
      { 
        expiresIn: 2592000,
        subject: this._id.toString(),
        issuer: config.get("app.name"),
        audience: "auth"
      }
    );
  };
};