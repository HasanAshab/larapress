const nodemailer = require("nodemailer");
const handlebars = require("express-handlebars");
const nodemailerMock = require("nodemailer-mock");
const nodemailerHbs = require("nodemailer-express-handlebars");

class Mail {
  static to(email){
    this.email = email;
    return this;
  };

  static setTransporter(data){
    if (data) {
      this.transporter = nodemailer.createTransport(data);
    } else if (process.env.NODE_ENV !== "test") {
      this.transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });
    } else {
      this.transporter = nodemailerMock.createTransport({
        host: "127.0.0.1",
        port: -100,
      });
    }
    return this;
  };

  static setTemplateEngine(){
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
  };

  static getRecipient(email){
    return {
      from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: this.mailable.subject,
      template: this.mailable.view,
      context: this.mailable.data,
    };
  };
  
  static after(miliseconds){
    this.delay = miliseconds;
    return this;
  }
  
  static async dispatch(mailable){
    this.mailable = mailable;
    this.setTransporter();
    this.setTemplateEngine();
    if (Array.isArray(this.email)) {
      for (email of this.email) {
        await this.transporter.sendMail(this.getRecipient(email));
      }
    } else {
      await this.transporter.sendMail(this.getRecipient(this.email));
    }
    return true;
  }

  static async send(mailable){
    if(mailable.shouldQueue){
      mailable.setQueue();
      mailable.queue.process(job => this.dispatch(job.data));
      return await mailable.queue.add(mailable, { delay: this.delay || 0 });
    }
    else{
      return await this.dispatch(mailable);
    }
  };
}

module.exports = Mail;
