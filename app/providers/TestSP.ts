import { asClass } from "awilix";
import TestS from "~/app/services/TestS";

export default class TestSP {
  constructor(c) {
    this.c = c;
  }
  
  register() {
    this.c.register({
      testS: asClass(TestS).inject(() => ({a:1, b:2})).singleton()
    });
  }
} 