import Mailable from "~/core/abstract/Mailable";
import MockDataContainer from "~/tests/MockDataContainer";

export default class Mail {
  static mockClear() {
    MockDataContainer.Mail = {
      total: 0,
      recipients: {}
    }
  }
  
  static to(email: string) {
    const send = async (mailable: Mailable) => {
      MockDataContainer.Mail.total++;
      return MockDataContainer.Mail.recipients[email]
        ? MockDataContainer.Mail.recipients[email].push(mailable.constructor)
        : MockDataContainer.Mail.recipients[email] = [mailable.constructor];
    }
    return { send }
  }
  
  static assertNothingSent(){
    expect(MockDataContainer.Mail.total).toBe(0);
  }
  
  static assertSentTo(email: string, Mailable: typeof Mailable){
    console.log(MockDataContainer.Mail)
    expect(MockDataContainer.Mail.recipients[email]).not.toBe(undefined);
    expect(MockDataContainer.Mail.recipients[email]).toContain(Mailable);
  }
  
  static assertCount(expectedNumber: number){
    expect(MockDataContainer.Mail.total).toBe(expectedNumber);
  }
}

Mail.mockClear();
