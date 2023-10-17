import { singleton } from "tsyringe";
import config from 'config';
import twilio, { TwilioClient } from "twilio";

@singleton()
export default class TwilioService {
  readonly client: TwilioClient;
  constructor() {
    this.setupClient();
  }
  
  private setupClient() {
    const { sid, authToken } = config.get("twilio");
    this.client = twilio(sid, authToken);
  }
  
  sendMessage(to: string, body: string) {
    return this.client.messages.create({ 
      to,
      body,
      from: config.get("twilio.phoneNumber"),
    });
  }

  makeCall(to: string, twiml: string) {
    return this.client.calls.create({
      to, 
      twiml,
      from: config.get("twilio.phoneNumber")
    });
  }
}