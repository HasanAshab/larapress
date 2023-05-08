import Exception from 'illuminate/exceptions/Exception';

export default class FileValidatorError extends Exception {
  static errors = {
    REQUIRED_FIELD_MISSING:{
      status: 400,
      message: 'The :fieldName field is required!'
    },
    TOO_MANY_PARTS:{
      status: 400,
      message: 'The :fieldName field max file parts should be :maxLength !'
    },
    TOO_LARGE_FILE:{
      status: 400,
      message: 'The :fieldName field max size is :size !'
    },
    TOO_SMALL_FILE:{
      status: 400,
      message: 'The :fieldName field min size is :size !'
    },
    INVALID_MIMETYPE:{
      status: 400,
      message: 'The :fieldName field mimetype should be :mimetypes !'
    },
  }
}

