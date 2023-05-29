import {
  base
} from "helpers";
import {
  Recipient,
  RecipientEmails,
  MailMockedData
} from "types";
import Queueable from "illuminate/queue/Queueable";
import Mailable from "illuminate/mails/Mailable";
import {
  isObject
} from "illuminate/guards";
import {
  createTransport,
  Transporter,
  SendMailOptions,
  TransportOptions
} from "nodemailer";
import nodemailerMock from "nodemailer-mock";
import {
  create as createHandlebars
} from "express-handlebars";
import nodemailerHbs from "nodemailer-express-handlebars";

export default class Mail {
  static isMocked = false;
  public dispatchAfter = 0;
  public mailable: Mailable;
  public transporter: Transporter < SendMailOptions >;

  constructor(public recipients: RecipientEmails) {
    this.recipients = recipients;
    this.mailable = {} as Mailable;
    this.transporter = {} as Transporter < SendMailOptions >;
  }

  static mocked = {
    sentMails = {
      total: 0,
      recipients: MailMockedData: {};
    },

    reset() {
      Mail.mocked.sentMails = {
        total: 0,
        recipients: {};
      }
    }
  }

  static to(recipients: RecipientEmails): Mail {
    const instance = new this(recipients);
    return instance;
  }

  static mock() {
    Mail.isMocked = true;
  }

  setTransporter(config?: TransportOptions): Mail {
    if (typeof config !== "undefined") {
      this.transporter = createTransport(config);
    } else if (Mail.isMocked) {
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

  setTemplateEngine(): Mail {
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
    return this;
  }

  delay(miliseconds: number): Mail {
    this.dispatchAfter = miliseconds;
    return this;
  }

  async send(mailable: Mailable) {
    if (Object.keys(this.transporter).length === 0) this.setTransporter();
    this.setTemplateEngine();
    this.mailable = mailable;
    if (!Mail.isMocked && Queueable.isQueueable(mailable) && mailable.shouldQueue) {
      const queue = mailable.createQueue();
      queue.process(job => this.dispatch.bind(this));
      await queue.add({}, {
        delay: this.dispatchAfter,
      });
    } else await this.dispatch();
  }

  private async dispatch() {
    if (Array.isArray(this.recipients)) {
      const promises = [];
      for (let email of this.recipients) {
        email = isObject(email) ? email.email: email;
        const sendMailPromise = this.transporter.sendMail(this.getRecipientConfig(email));
        promises.push(sendMailPromise);
        Mail.isMocked && this.pushMockData(email);
      }
      await Promise.all(promises);
    } else {
      const email = isObject(this.recipients) ? this.recipients.email: this.recipients;
      await this.transporter.sendMail(this.getRecipientConfig(email));
      Mail.isMocked && this.pushMockData(email);
    }
  }

  private getRecipientConfig(email: string): Recipient {
    return {
      from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: this.mailable.subject,
      template: this.mailable.view,
      context: this.mailable.data,
    };
  }

  private pushMockData(email: string) {
    const mocked = Mail.mocked;
    mocked.total++;
    if (typeof mocked.recipients[email] === "undefined") {
      const recipient: MailMockedData = {};
      recipient[this.mailable.view] = {
        mailable: this.mailable,
        count: 1
      };
      mocked.recipients[email] = recipient;
    } else {
      if (typeof mocked.recipients[email][this.mailable.view] === "undefined") {
        mocked.recipients[email][this.mailable.view] = {
          mailable: this.mailable,
          count: 1
        }
      } 
      else mocked.recipients[email][this.mailable.view].count++;
    }
    Mail.mocked = mocked;
  }
}