import ServiceProvider from "~/core/abstract/ServiceProvider";
import TestS from "~/app/services/TestS";

export default class TestSP extends ServiceProvider {
  register() {
   // this.container.registerInstance(TestS, new TestS());
  }
}