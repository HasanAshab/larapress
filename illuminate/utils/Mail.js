const nodemailer = require("nodemailer");
const handlebars = require('express-handlebars');
const nodemailerHbs = require('nodemailer-express-handlebars');

class Mail {

  static to = (email) => {
    this.email = email;
    return this;
  }

  static send = async (mailable) => {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        }
      });

      const hbs = handlebars.create({
        extname: '.handlebars',
        defaultLayout: 'main',
        layoutsDir: base('views/layouts'),
        partialsDir: base('views/partials')
      });

      transporter.use('compile', nodemailerHbs({
        viewEngine: hbs,
        viewPath: base('views/emails'),
        extName: '.handlebars'
      }));
      if (typeof this.email === 'array'){
        for (email of this.email){
          await transporter.sendMail({
            from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
            to: email,
            subject: mailable.subject,
            template: mailable.view,
            context: mailable.data
          });
        }
      }
      else {
        await transporter.sendMail({
          from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
          to: this.email,
          subject: mailable.subject,
          template: mailable.view,
          context: mailable.data
        });
      }
      return true;
    } catch (error) {
      log(error)
      return false;
    }
  }
}


module.exports = Mail;