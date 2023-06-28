import Exception from "illuminate/exceptions/Exception";

export default class CacheError extends Exception {
  static errors = {
    INVALID_DRIVER: {
      message: "The \":driverName\" Driver is Not Available",
      status: 500
    }
  }
}
