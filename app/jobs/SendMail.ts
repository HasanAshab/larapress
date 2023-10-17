import Job from "~/core/abstract/Job";
import { transporter, generateRecipient } from "~/core/clients/nodemailer";

export default class SendMail extends Job {
  concurrency = 20;
  tries = 3;
  
  async handle({ mailable, email }){
    const recipient = generateRecipient(mailable, email);
    await transporter.sendMail(recipient);
  }
}