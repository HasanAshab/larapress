import { injectable } from "tsyringe";
import TestR from "~/app/repo/TestR";

@injectable()
export default class TestS {
  constructor(public testR: TestR) {}
  
  fetch() {
    console.log(this.testR)
    console.log(this.testR.getAll())
  }
}