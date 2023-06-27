import { Schema } from "mongoose";

export type ITimestamps = {
  instance: {
    createdAt: Date
  },
  statics: {
    whereDateBetween(startDate: Date, endDate: Date): Promise<typeof Schema>;
  }
}

export default (schema: Schema) => {
  schema.add({
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  });

  schema.statics.whereDateBetween = async function (startDate: Date, endDate: Date): Promise<typeof Schema> {
    return await this.find({
      date: { $gte: startDate, $lte: endDate },
    });
  };
};
