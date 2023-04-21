const Mail = require(base('utils/Mail'));

module.exports = schema => {
  schema.methods.notify = function(mailable) {
    return Mail.to(this.email).send(mailable);
  };
};