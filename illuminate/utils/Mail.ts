import {
  base
} from "helpers";
import {
  Recipient,
  RecipientEmails,
} from "types";
import Queueable from "illuminate/queue/Queueable";
import Mailable from "illuminate/mails/Mailable";
import { isObject } from "illuminate/guards";
import { createTransport, Transporter, SendMailOptions, TransportOptions } from "nodemailer";
import nodemailerMock from "nodemailer-mock";
import { create as createHandlebars } from "express-handlebars";
import nodemailerHbs from "nodemailer-express-handlebars";

export default class Mail {
  static email: RecipientEmails;
  static mailable: Mailable;
  static transporter: Transporter<SendMailOptions>;
  static isMocked = false;
  static dispatchAfter = 0;

  static to(email: RecipientEmails): typeof Mail {
    this.email = email;
    return Mail;
  }

  static mock() {
    this.isMocked = true;
  }

  static setTransporter(config?: TransportOptions): typeof Mail {
    if (typeof config !== "undefined") {
      this.transporter = createTransport(config);
    } else if (this.isMocked) {
      this.transporter = nodemailerMock.createTransport({
        host: "127.0.0.1",
        port: -100,
      });
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
    const hbs = createHandlebars({
      extname: ".handlebars",
      defaultLayout: "main",
      layoutsDir: base("views/layouts"),
      partialsDir: base("views/partials"),
    });

    this.transporter.use(
      "compile",
      nodemailerHbs({
        viewEngine: hbs,
        viewPath: base("views/emails"),
        extName: ".handlebars",
      })
    );
  }

  static getRecipient(email: string): Recipient {
    return {
      from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: this.mailable.subject,
      template: this.mailable.view,
      context: this.mailable.data,
    };
  }

  static delay(miliseconds: number): typeof Mail {
    this.dispatchAfter = miliseconds;
    return this;
  }

  static async dispatch(){
    if (typeof this.transporter === "undefined") this.setTransporter();
    this.setTemplateEngine();
    if (Array.isArray(this.email)) {
      const promises = [];
      for (let email of this.email) {
        email = isObject(email) ? email.email: email;
        const sendMailPromise = this.transporter.sendMail(this.getRecipient(email));
        promises.push(sendMailPromise);
      }
      await Promise.all(promises);
    } else {
      const email = isObject(this.email) ? this.email.email: this.email;
      await this.transporter.sendMail(this.getRecipient(email));
    }
  }

  static async send(mailable: Mailable){
    this.mailable = mailable;
    if (!this.isMocked && Queueable.isQueueable(mailable) && mailable.shouldQueue) {
      const queue = mailable.createQueue();
      queue.process(job => this.dispatch.bind(this));
      await queue.add({}, {
        delay: this.dispatchAfter,
      });
    } 
    else await this.dispatch();
  }
}