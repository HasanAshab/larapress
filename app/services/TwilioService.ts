import { singleton } from "tsyringe";
import Config from 'Config';
import twilio from "twilio";

@singleton()
export default class TwilioService {
  readonly client: twilio.Twilio;
  constructor() {
    const { sid, authToken } = Config.get<{ sid: string, authToken: string }>("twilio");
    this.client = twilio(sid, authToken);
  }
  

  sendMessage(to: string, body: string) {
    return this.client.messages.create({ 
      from: Config.get("twilio.from"),
      to,
      body
    });
  }

  makeCall(to: string, twiml: string) {
    return this.client.calls.create({
      from: Config.get("twilio.from"),
      to, 
      twiml
    });
  }
}