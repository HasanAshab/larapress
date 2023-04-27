const Mail = require(base('illuminate/utils/Mail'));

module.exports = schema => {
  schema.methods.notify = async function(mailable) {
    return await Mail.to(this.email).send(mailable);
  };
};