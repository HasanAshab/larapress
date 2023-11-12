import Job from "~/core/abstract/Job";
import Mailable from "~/core/abstract/Mailable";
import MailService from "~/app/services/MailService";
import { singleton } from "tsyringe";

interface Data {
  email: string;
  mailable: Mailable;
}

@singleton()
class SendMail extends Job<Data> {
  concurrency = 20;
  tries = 3;
  channel = "mail";
  
  constructor(private readonly mailService: MailService) {
    super();
  }
  
  async handle({ mailable, email }: Data){
    await this.mailService.send(mailable, email);
  }
}

export default resolve<SendMail>(SendMail);