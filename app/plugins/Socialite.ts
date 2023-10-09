import { Schema, Document } from "mongoose";

export interface SocialiteDocument extends Document {
  //
}

export interface SocialiteModel {
  //
}

export default (schema: Schema) => {
  schema.add({
    externalId: Object
  });
  
  schema.statics.socialite = function(provider: string) {
    const upsert = async profile => {
      const { sub, email, picture } = profile._json;
      return await this.findOneAndUpdate(
        { [`externalId.${provider}`]: sub },
        { 
          email,
          verified: true,
          "logo.url": picture
        },
        { upsert: true, new: true }
      );
    }
    
    return { upsert };
  }
}