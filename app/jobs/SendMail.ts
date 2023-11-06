import Job from "~/core/abstract/Job";
import Mailable from "~/core/abstract/Mailable";
import MailService from "~/app/services/MailService";
import { singleton } from "tsyringe";

interface SendMailData {
  email: string;
  mailable: Mailable;
}

@singleton()
export default class SendMail extends Job {
  concurrency = 20;
  tries = 3;
  channel = "mail";
  
  constructor(private readonly mailService: MailService) {
    super();
  }
  
  async handle({ mailable, email }: SendMailData){
    await this.mailService.send(mailable, email);
  }
}