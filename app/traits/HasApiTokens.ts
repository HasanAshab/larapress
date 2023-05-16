import { Schema } from 'mongoose';
import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET || '';
const tokenLifespan = Number(process.env.TOKEN_LIFESPAN);

export type IHasApiTokens = {
  tokenVersion: number,
  createToken(): string,
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
      jwtSecret,
      {
        expiresIn: tokenLifespan,
      }
    );
  };
};
