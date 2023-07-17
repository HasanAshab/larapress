import { base } from "helpers";
import { Recipient } from "types";
import { util } from "illuminate/decorators/class";
import Mockable from "illuminate/utils/Mail/Mockable";
import Mailable from "illuminate/mails/Mailable";
import { createTransport, Transporter, SendMailOptions, TransportOptions } from "nodemailer";
import { create as createHandlebars } from "express-handlebars";
import nodemailerHbs from "nodemailer-express-handlebars";

@util(Mockable)
export default class Mail {
  public mailable: Mailable = {} as Mailable;
  static transporter: Transporter < SendMailOptions > = {} as any;
  static email: string;

  static to(email: string) {
    this.email = email;
    return this
  }

  static setTransporter(config?: TransportOptions) {
    if (typeof config !== "undefined") {
      this.transporter = createTransport(config);
    } else {
      this.transporter = createTransport({
        host: process.env.MAIL_HOST || "smtp-relay.sendinblue.com",
        port: process.env.MAIL_PORT || "587",
        auth: {
          user: process.env.MAIL_USERNAME || "",
          pass: process.env.MAIL_PASSWORD || "",
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
          layoutsDir: base("views/layouts"),
          partialsDir: base("views/partials"),
        }),
        viewPath: base("views/emails"),
        extName: ".handlebars",
      })
    );
    return this;
  }
  
  static getRecipientConfig(mailable: Mailable): Recipient {
    return {
      from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
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