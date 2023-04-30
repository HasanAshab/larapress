module.exports = (schema) => {
  schema.add({
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  });

  schema.statics.whereDateBetween = async function (startDate, endDate) {
    return await this.find({
      date: { $gte: startDate, $lte: endDate },
    });
  };
};
