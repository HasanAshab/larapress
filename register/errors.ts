export default {
  INVALID_OR_EXPIRED_TOKEN: {
    status: 401,
    message: "Invalid or expired token!"
  },

  COMMAND_NOT_FOUND: {
    status: 404,
    message: "Command not found!",
  },

  SUB_COMMAND_REQUIRED: {
    status: 400,
    message: "The Sub Command is Required as it\"s using as :name !",
  },

  REQUIRED_PARAM_MISSING: {
    status: 400,
    message: "The \":param\" Param is Required!",
  },
  
  INVALID_CACHE_DRIVER: {
    status: 500,
    message: "The \":driverName\" Cache Driver is Not Available!"
  }
} as const;