import { singleton } from "tsyringe";
import Config from 'Config';
import { createTransport, Transporter } from "nodemailer";
import nodemailerHbs from "nodemailer-express-handlebars";

@singleton()
export default class MailService {
  readonly transporter: Transporter;
  
  constructor() {
    this.setupTransporter();
    this.setupViewEngine();
  }
  
  private setupTransporter() {
    const { host, port, username: user = "", password: pass = "" } = Config.get("mail");
    this.transporter = createTransport({ host, port, auth: { user, pass } });
  }

  private setupViewEngine() {
    const handlebars = nodemailerHbs(Config.get("mail.template"));
    this.transporter.use("compile", handlebars);
  }

  generateRecipient(mailable: Mailable, toEmail: string) {
    return {
      from: `${Config.get("mail.fromName")} <${Config.get("mail.fromAddress")}>`,
      to: toEmail,
      subject: mailable.subject,
      template: mailable.view,
      context: mailable.data,
    };
  }
  
  send(mailable: Mailable, email: string) {
    const recipient = this.generateRecipient(mailable, email);
    return this.transporter.sendMail(recipient);
  }
}