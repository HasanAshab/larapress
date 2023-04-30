const Exception = require(base('illuminate/exceptions/Exception'));

class ArtisanError extends Exception {
  errors = {
    COMMAND_NOT_FOUND:{
      status: 404,
      message: 'Command not found!',
    },
    
    INVALID_ARG_COUNT:{
      status: 400,
      message: 'Number of Arguments Should be :',
    },
    
    REQUIRED_FLAG_MISSING:{
      status: 400,
      message: 'The ":" Flag is Required!',
    }
  }
}

module.exports = ArtisanError;