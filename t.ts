import Dec from "~/core/decorators/RequestHandler";

export default class Foo {
  a = 84
  
  @Dec
  bar() {
    console.log(this)
  }
  
  @Dec
  baz() {
    return "worthless"
  }
}
