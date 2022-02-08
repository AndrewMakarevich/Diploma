import nodemailer from 'nodemailer';
import ApiError from '../apiError/apiError';

class MailService {
  static async sendMail(to: string, verificationCode: string) {
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
      const verificationLink = `${process.env.BACK_LINK}/api/user/activate/${verificationCode}`;
      await mailTransporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject: 'Verificate email',
        text: '',
        html:
          `
      <div>
          <h1>Для активации аккаунта перейдите по ссылке</h1>
          <a href=${verificationLink}>${verificationLink}</a>
          <h2>Время отправки сообщения: ${new Date()}</h2>
      </div>
      `
      });
    } catch (e) {
      throw ApiError.badRequest('Mail sending request');
    }

  }
}
export default MailService;