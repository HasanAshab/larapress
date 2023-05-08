import Exception from 'illuminate/exceptions/Exception';

export default class ArtisanError extends Exception {
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