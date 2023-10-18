import expect from "expect";
import Mailable from "~/core/abstract/Mailable";

export type MailMockedData = {
  total: number;
  recipients: Record < string, Record < string, {mailable: Mailable, count: number}>>;
}

export default class Mockable {
  static isMocked = false;

  static mocked: MailMockedData = {
    total: 0,
    recipients: {}
  }

  static mock() {
    this.isMocked = true;
    this.mocked = {
      total: 0,
      recipients: {}
    }
  }
  
  static to(email: string) {
    const send = async (mailable: Mailable) => {
      const mocked = this.mocked;
      mocked.total++;
      if (!mocked.recipients[email]) {
        mocked.recipients[email] = {}
        mocked.recipients[email][mailable.constructor.name] = {
          mailable: mailable,
          count: 1
        };
      } else {
        if (!mocked.recipients[email][mailable.constructor.name]) {
          mocked.recipients[email][mailable.constructor.name] = {
            mailable: mailable,
            count: 1
          }
        } else mocked.recipients[email][mailable.constructor.name].count++;
      }
      this.mocked = mocked;
      }
    return { send }
  }
  
  static assertNothingSent(){
    expect(this.mocked.total).toBe(0);
  }
  
  static assertSentTo(email: string, mailable: string){
    expect(this.mocked.recipients).toHaveProperty([email, mailable]);
  }
  
  static assertCount(expectedNumber: number){
    expect(this.mocked.total).toBe(expectedNumber);
  }
}