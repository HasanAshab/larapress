import { Schema } from 'mongoose';

export type ITimestamps = {
  whereDateBetween(startDate: Date, endDate: Date): Promise<typeof schema>
}

export default (schema: Schema) => {
  schema.add({
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  });

  schema.statics.whereDateBetween = async function (startDate: Date, endDate: Date): Promise<typeof schema> {
    return await this.find({
      date: { $gte: startDate, $lte: endDate },
    });
  };
};
