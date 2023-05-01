const Exception = require(base('illuminate/exceptions/Exception'));

class ArtisanError extends Exception {
  static errors = {
    COMMAND_NOT_FOUND:{
      status: 404,
      message: 'Command not found!',
    },
    
    REQUIRED_PARAM_MISSING:{
      status: 400,
      message: 'The ":param" Param is Required!',
    }
  }
}

module.exports = ArtisanError;