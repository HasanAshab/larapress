import {
  base
} from "helpers";
import {
  Recipient,
  RecipientEmails,
  Mailable
} from "types";
import ShouldQueue from "illuminate/queue/ShouldQueue";
import nodemailer, {
  Transporter,
  TransportConfig
} from "nodemailer";
import nodemailerMock from "nodemailer-mock";
import handlebars from "express-handlebars";
import nodemailerHbs from "nodemailer-express-handlebars";

export default class Mail {
  static email: RecipientEmails;
  static mailable: Mailable;
  static transporter: Transporter < TransportConfig >;
  static isMocked = false;
  static dispatchAfter = 0;

  static to(email: RecipientEmails): Mail {
    this.email = email;
    return this;
  }

  static mock(): void {
    this.isMocked = true;
  }

  static setTransporter(config?: TransportConfig): Mail {
    if (typeof this.transporter !== 'undefined') {
      return this;
    }
    if (typeof config !== "undefined") {
      this.transporter = nodemailer.createTransport(data);
    } else if (this.isMocked) {
      this.transporter = nodemailerMock.createTransport({
        host: "127.0.0.1",
        port: -100,
      });
    } else {
      this.transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });
    }
    return this;
  }

  static setTemplateEngine(): void {
    const hbs = handlebars.create({
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

  static delay(miliseconds: number): Mail {
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
  }

  static async send(mailable: Mailable): Promise < void > {
    function isQueueable(object: any): object is ShouldQueue {
      return "queue" in object;
    }
    if (!this.isMocked && isQueueable(mailable) && mailable.shouldQueue) {
      mailable.setQueue();
      mailable.queue.process((job) => this.dispatch(job.data));
      await mailable.queue.add(mailable, {
        delay: this.dispatchAfter,
      });
    } else {
      await this.dispatch(mailable);
    }
  }
}