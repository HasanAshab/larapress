import { singleton } from "tsyringe";
import Config from 'Config';
import twilio, { TwilioClient } from "twilio";

@singleton()
export default class TwilioService {
  readonly client: TwilioClient;
  constructor() {
    this.setupClient();
  }
  
  private setupClient() {
    const { sid, authToken } = Config.get("twilio");
    this.client = twilio(sid, authToken);
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