import nodemailer from 'nodemailer';
import ApiError from '../apiError/apiError';

class MailService {
  static async sendMail(to: string, letterHeader: string, messageHeader: string, verificationLink: string) {
    try {
      const mailTransporter = nodemailer.createTransport(
        {
          service: "gmail",
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
          }
        }
      );
      await mailTransporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject: letterHeader,
        text: '',
        html:
          `
      <div>
          <h1>${messageHeader}</h1>
          <a href=${verificationLink}>${verificationLink}</a>
          <h2>Время отправки сообщения: ${new Date()}</h2>
      </div>
      `
      });
    } catch (e) {
      throw ApiError.badRequest(JSON.stringify(e));
    }

  }
}
export default MailService;