import { Injectable } from "@nestjs/common";
import sendGrid from "@sendgrid/mail";
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
type SendEmailMsg = {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html: string;
};

/*
<body style="padding: 10px;">
 <div class="email-div" style="width: 50%;height: 50%;display: flex;flex-direction: column;align-items: flex-start;justify-content: flex-start;background-color: white;border: 1px solid rgb(151, 151, 151);border-radius: 5px;padding: 5px;box-shadow: 6px 4px 13px -3px rgba(240,235,235,0.75);-webkit-box-shadow: 6px 4px 13px -3px rgba(240,235,235,0.75);-moz-box-shadow: 6px 4px 13px -3px rgba(240,235,235,0.75);margin: auto;">
    <h1 style="color: rgb(115, 115, 115);">Welcome to Hiresume</h1>
    <p style="color: rgb(115, 115, 115);">we are glad you chose to join us. kindly verify your email yourverification code is<span>12312312</span>
        or click the button below to verify email</p>
<div class="button-div" style="width: 100%;display: flex;flex-direction: column;align-items: center;justify-content: center;">
    <a href="/frontend link"><button style="background-color: rgb(114, 255, 255);border: 1px solid teal;border-radius: 5px;width: 100px;height: 30px;padding: 5px;color: rgb(0, 79, 79);font-weight: bolder;margin: auto;">verify</button></a>
</div>
  </div>
  </body>
     */
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
