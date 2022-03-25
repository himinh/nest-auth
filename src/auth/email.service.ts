import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { transEmail } from 'src/common/constants';
import { ConfigService } from '@nestjs/config';
import { emailConstants } from './constants';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;
  private readonly logger: Logger;

  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger();
    this.nodemailerTransport = createTransport(emailConstants.smtp);
    this.nodemailerTransport
      .verify()
      .then(() => this.logger.log('Connected to email server'))
      .catch(() =>
        this.logger.warn(
          'Unable to connect to email server. Make sure you have configured the SMTP options in .env',
        ),
      );
  }

  sendEmail(to: string, subject: string, htmlContent: string) {
    const info = {
      from: emailConstants.from,
      to,
      subject,
      html: htmlContent,
    };
    return this.nodemailerTransport.sendMail(info);
  }

  async sendMailResetPassword(to: string, token: string, name: string) {
    const subject = 'RESET YOUR PASSWORD';

    const url = `http://localhost:3000/auth/reset-password/${token}`;
    const text = 'Reset your password';
    const title = `<span>Hey</span> ${name}`;
    const desc = 'Please click the button below to reset your password.';

    const htmlContent = transEmail.template(title, desc, url, text);

    const info = await this.sendEmail(to, subject, htmlContent);
    return info;
  }

  async sendEmailRegister(to: string, token: string) {
    const subject = 'ACTIVATE YOUR ACCOUNT';
    // replace this url with the link to the reset password page of your front-end app
    const url = `http://localhost:8888/api/auth/activate/${token}`;
    const text = 'Verify your email';

    const title = `<span>Welcome !</span> And thank you for registering !`;
    const desc = `Please validate your email by clicking the button below 🙂`;
    const htmlContent = transEmail.template(title, desc, url, text);

    let info = await this.sendEmail(to, subject, htmlContent);
    return info;
  }
}
