import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { google } from "googleapis";

const transport = nodemailer.createTransport({
  //@ts-ignore
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: "mambo.michael.22@gmail.com",
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: process.env.ACCESS_TOKEN,
  },
});

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
      // const url = jwt.generateAuthUrl({
      //   redirect_uri: "http://localhost:3000",
      //   scope: ["https://mail.google.com/"],
      // });

      //await transport.sendMail(message);

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
