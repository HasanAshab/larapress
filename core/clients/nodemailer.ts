import config from 'config';
import { createTransport } from "nodemailer";
import { create as createHandlebars } from "express-handlebars";
import nodemailerHbs from "nodemailer-express-handlebars";

const mailConfig = config.get("mail");

export const transporter = createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  auth: {
    user: mailConfig.username ?? "",
    pass: mailConfig.password ?? "",
  },
});

const viewEngine = createHandlebars({
  extname: ".handlebars",
  defaultLayout: "main",
  layoutsDir: "views/layouts",
  partialsDir: "views/partials",
});

transporter.use("compile", nodemailerHbs({
  viewEngine,
  viewPath: "views/emails",
  extName: ".handlebars",
}));

export function generateRecipient(mailable: Mailable, to: string) {
    return {
      from: `${mailConfig.fromName} <${mailConfig.fromAddress}>`,
      to,
      subject: mailable.subject,
      template: mailable.view,
      context: mailable.data,
    };
  }
