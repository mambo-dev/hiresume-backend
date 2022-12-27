import { Injectable } from "@nestjs/common";
import * as sendGrid from "@sendgrid/mail";

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
type SendEmailMsg = {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html: string;
};

@Injectable()
export class EmailService {
  async sendEmail(message: SendEmailMsg) {
    try {
      await sendGrid.send(message);

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
