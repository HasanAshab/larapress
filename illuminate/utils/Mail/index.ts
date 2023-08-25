import { Recipient } from "types";
import { util } from "~/illuminate/decorators/class";
import config from 'config';
import Mockable from "~/illuminate/utils/Mail/Mockable";
import Mailable from "~/illuminate/mails/Mailable";
import { createTransport, Transporter, SendMailOptions, TransportOptions } from "nodemailer";
import { create as createHandlebars } from "express-handlebars";
import nodemailerHbs from "nodemailer-express-handlebars";

@util(Mockable)
export default class Mail {
  public mailable: Mailable = {} as Mailable;
  static transporter: Transporter < SendMailOptions > = {} as any;
  static email: string;
  static mailConfig = config.get("mail");

  static to(email: string) {
    this.email = email;
    return this
  }

  static setTransporter(customConfig?: TransportOptions) {
    if (typeof customConfig !== "undefined") {
      this.transporter = createTransport(customConfig);
    } else {
      this.transporter = createTransport({
        host: this.mailConfig.host,
        port: this.mailConfig.port,
        auth: {
          user: this.mailConfig.username ?? "",
          pass: this.mailConfig.password ?? "",
        },
      } as TransportOptions);
    }
    return this;
  }

  static setTemplateEngine() {
    this.transporter.use("compile", nodemailerHbs({
        viewEngine: createHandlebars({
          extname: ".handlebars",
          defaultLayout: "main",
          layoutsDir: "~/views/layouts",
          partialsDir: "~/views/partials",
        }),
        viewPath: "~/views/emails",
        extName: ".handlebars",
      })
    );
    return this;
  }
  
  static getRecipientConfig(mailable: Mailable): Recipient {
    return {
      from: `${this.mailConfig.fromName} <${this.mailConfig.fromAddress}>`,
      to: this.email,
      subject: mailable.subject,
      template: mailable.view,
      context: mailable.data,
    };
  }

  static send(mailable: Mailable) {
    Object.keys(this.transporter).length === 0 && this.setTransporter();
    this.setTemplateEngine();
    return this.transporter.sendMail(this.getRecipientConfig(mailable));
  }
}