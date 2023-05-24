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

  static mock(): void {
    this.isMocked = true;
  }

  static setTransporter(config?: TransportOptions): typeof Mail {
    if (typeof this.transporter !== "undefined") {
      return this;
    }
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

  static setTemplateEngine(): void {
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

  static async dispatch(mailable: Mailable): Promise < void > {
    this.mailable = mailable;
    this.setTransporter();
    this.setTemplateEngine();
    if (Array.isArray(this.email)) {
      for (let email of this.email) {
        email = isObject(email) ? email.email: email;
        await this.transporter.sendMail(this.getRecipient(email));
      }
    } else {
      const email = isObject(this.email) ? this.email.email: this.email;
      await this.transporter.sendMail(this.getRecipient(email));
    }
    console.log("success");
  }

  static async send(mailable: Mailable): Promise < void > {
    if (!this.isMocked && Queueable.isQueueable(mailable) && mailable.shouldQueue) {
      const queue = mailable.createQueue();
      queue.process((job) => this.dispatch(job.data));
      await queue.add(mailable, {
        delay: this.dispatchAfter,
      });
    } else {
      await this.dispatch(mailable);
    }
  }
}