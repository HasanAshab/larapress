module.exports = (schema) => {
  schema.add({
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  });
};
