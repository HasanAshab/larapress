import { singleton } from "tsyringe";
import Config from 'Config';
import { Twilio } from "twilio";

@singleton()
export default class TwilioService {
  readonly client: Twilio;
  constructor() {
    const { sid, authToken } = Config.get<{ sid: string, authToken: string }>("twilio");
    this.client = new Twilio(sid, authToken);
  }
  

  sendMessage(to: string, body: string) {
    return this.client.messages.create({ 
      to,
      body,
      from: Config.get("twilio.from"),
    });
  }

  makeCall(to: string, twiml: string) {
    return this.client.calls.create({
      to, 
      twiml,
      from: Config.get("twilio.from")
    });
  }
}