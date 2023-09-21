import config from "config";
import twilio from "twilio";

const twilioConfig = config.get<any>("twilio");
const client = twilio(twilioConfig.sid, twilioConfig.authToken);

export function sendMessage(to: string, body: string) {
  return client.messages.create({ from: twilioConfig.phoneNumber, to, body });
}

export function sendCall(to: string, twiml: string) {
  return client.calls.create({ from: twilioConfig.phoneNumber, to, twiml });
}

export default client;