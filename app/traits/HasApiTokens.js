const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const tokenLifespan = Number(process.env.TOKEN_LIFESPAN);

module.exports = (schema) => {
  schema.add({
    tokenVersion: {
      type: Number,
      default: 0,
    },
  });
  
  schema.methods.createToken = function () {
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
