import expect from "expect";
import { MailMockedData } from "types";
import Mailable from "~/illuminate/mails/Mailable";

export default class Mockable {
  static isMocked = false;
  static email: string;
  
  static mocked = {
    total: 0,
    recipients: {} as MailMockedData
  }

  static mock() {
    this.isMocked = true;
    this.mocked = {
      total: 0,
      recipients: {}
    }
  }
  
  static send(mailable: Mailable) {
    const mocked = this.mocked;
    mocked.total++;
    if (typeof mocked.recipients[this.email] === "undefined") {
      mocked.recipients[this.email] = {}
      mocked.recipients[this.email][mailable.constructor.name] = {
        mailable: mailable,
        count: 1
      };
    } else {
      if (typeof mocked.recipients[this.email][mailable.constructor.name] === "undefined") {
        mocked.recipients[this.email][mailable.constructor.name] = {
          mailable: mailable,
          count: 1
        }
      } else mocked.recipients[this.email][mailable.constructor.name].count++;
    }
    this.mocked = mocked;
  }
  
  static assertNothingSent(){
    expect(this.mocked.total).toBe(0);
  }
  
  static assertSentTo(email: string, mailable: string){
    expect(this.mocked.recipients).toHaveProperty([email, mailable]);
  }
  
  static assertCount(expectedNumber: number){
    console.log(this.mocked)
    expect(this.mocked.total).toBe(expectedNumber);
  }
}