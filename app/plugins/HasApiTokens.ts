import { Schema, Document } from "mongoose";
import config from "config";
import jwt from "jsonwebtoken";

export interface HasApiTokensDocument extends Document {
  tokenVersion: number;
  createToken(): string;
  createTemporaryToken(): string;
}

export default (schema: Schema) => {
  schema.add({
    tokenVersion: {
      type: Number,
      default: 0
    },
  });

  schema.methods.createToken = function () {
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
  
  schema.methods.createTemporaryToken = function (audience: string, expiresIn?: number) {
    const options = { 
      audience,
      subject: this._id.toString(),
      issuer: config.get("app.name"),
    };
    
    if(expiresIn) {
      options.expiresIn = expiresIn;
    }
    return jwt.sign({}, config.get("app.key"), options);
  }
};