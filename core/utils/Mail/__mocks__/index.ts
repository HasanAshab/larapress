import expect from "expect";
import Mailable from "~/core/abstract/Mailable";

interface MailMockedData {
  total: number;
  recipients: Record<string, (typeof Mailable)[]>;
}

export default class Mail {
  static $data: MailMockedData = {
    total: 0,
    recipients: {}
  }

  static mockClear() {
    this.$data = {
      total: 0,
      recipients: {}
    }
  }
  
  static to(email: string) {
    const send = async (mailable: Mailable) => {
      this.$data.total++;
      console.log(this.$data)
      return this.$data.recipients[email]
        ? this.$data.recipients[email].push(mailable.constructor)
        : this.$data.recipients[email] = [mailable.constructor];
    }
    return { send }
  }
  
  static assertNothingSent(){
    expect(this.$data.total).toBe(0);
  }
  
  static assertSentTo(email: string, Mailable: typeof Mailable){
    expect(this.$data.recipients).toHaveProperty([email]);
    expect(this.$data.recipients[email]).toContain(Mailable);
  }
  
  static assertCount(expectedNumber: number){
    expect(this.$data.total).toBe(expectedNumber);
  }
}