const Mail = require(base('illuminate/utils/Mail'));

module.exports = schema => {
  schema.methods.notify = function(mailable) {
    return Mail.to(this.email).send(mailable);
  };
};