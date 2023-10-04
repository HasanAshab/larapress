import ApiException from "~/app/exceptions/ApiException";

export default class TestException extends ApiException {
  constructor(message = "Foooooo", status = 405){
    super(message, status);
  }
}