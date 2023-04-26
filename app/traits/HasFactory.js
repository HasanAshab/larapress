module.exports = (schema) => {
  schema.statics.factory = function (count = 1) {
    const modelName = new this().constructor.modelName;
    const Factory = require(base(`app/factories/${modelName}Factory`));
    const factory = new Factory();
    return {
      create: async (data) => {
        const models = [];
        for(let i = 0; i < count; i++){
          const model = new this(factory.merge(data));
          await model.save();
          models.push(model);
        }
        return (models.length <= 1)
          ?models[0]
          :models;
      },
    }
  }
}
