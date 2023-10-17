import Job from "~/core/abstract/Job";
import MailService from "~/app/services/MailService";
import { singleton } from "tsyringe";

@singleton()
export default class SendMail extends Job {
  concurrency = 20;
  tries = 3;

  constructor(private readonly mailService: MailService) {
    super();
  }
  
  async handle({ mailable, email }){
    await this.mailService.send(mailable, email);
  }
}