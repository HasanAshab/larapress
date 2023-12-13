import d, { A, b } from "~/main/a"
import { RequestHandler } from "~/core/decorators";


export default class Aa {
  @RequestHandler
  foo(a: A) {}
}
log(d)
