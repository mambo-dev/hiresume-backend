import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/createuser.dto";
import * as argon2 from "argon2";
import { EmailService } from "src/email/email.service";
import { User } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private emailsService: EmailService
  ) {}
  async findOne(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        user_email: username,
      },
    });
  }

  async create(createUserdto: CreateUserDto) {
    const { password, email, country, role, firstName, lastName } =
      createUserdto;

    const hash = await argon2.hash(password, {
      hashLength: 12,
    });

    const userExists = await this.findOne(email);

    if (userExists) {
      throw new ConflictException("user already exists");
    }

    const verificationCode = generateRandomCode("ver");

    const user = await this.prismaService.user.create({
      data: {
        user_email: email,
        user_country: country,
        user_password: hash,
        user_role: role,
        profile: {
          create: {
            profile_firstname: firstName,
            profile_secondname: lastName,
          },
        },
        Account: {
          create: {
            account_verification_code: await argon2.hash(verificationCode),
          },
        },
      },
    });

    this.assignUserRole(user.user_role, this.prismaService, user);

    await this.sendVerificationCode(email, verificationCode);

    const { user_password, ...returnUser } = user;

    return returnUser;
  }

  async assignUserRole(role: string, prisma: any, user: any) {
    switch (role) {
      case "admin":
        await prisma.admin.create({
          data: {
            admin_user_id: user.id,
          },
        });
        break;
      case "freelancer":
        await prisma.freelancer.create({
          data: {
            freelancer_user_id: user.id,
          },
        });
        break;
      case "client":
        await prisma.client.create({
          data: {
            client_user_id: user.id,
          },
        });
        break;
      default:
        throw new Error("could not create role");
    }
  }

  async sendVerificationCode(
    user_email: string,
    verificationCode?: string,
    frontEndLink?: string
  ) {
    const sendEmail = await this.emailsService.sendEmail({
      to: user_email,
      from: "mambo.michael.22@gmail.com",
      subject: "verify your email",
      html: `<div
      class="email-div"
      style="width: 50%;height: 50%;display: flex;flex-direction: column;align-items: flex-start;justify-content: flex-start;background-color: white;border: 1px solid rgb(151, 151, 151);border-radius: 5px;padding: 5px;box-shadow: 6px 4px 13px -3px rgba(240,235,235,0.75);-webkit-box-shadow: 6px 4px 13px -3px rgba(240,235,235,0.75);-moz-box-shadow: 6px 4px 13px -3px rgba(240,235,235,0.75);margin: auto;"
    >
      <h1 style="color: rgb(115, 115, 115);">Welcome to Hiresume</h1>
      <p style="color: rgb(115, 115, 115);">
        we are glad you chose to join us. kindly verify your email, your
        verification code is <span>${verificationCode}</span>
        or click the button below to verify email
      </p>
      <div
        class="button-div"
        style="width: 100%;display: flex;flex-direction: column;align-items: center;justify-content: center;"
      >
        <a href="/${frontEndLink}">
          <button style="background-color: rgb(114, 255, 255);border: 1px solid teal;border-radius: 5px;width: 100px;height: 30px;padding: 5px;color: rgb(0, 79, 79);font-weight: bolder;margin: auto;">
            verify
          </button>
        </a>
      </div>
    </div>;`,
    });

    console.log(sendEmail);
    if (!sendEmail) {
      throw new UnprocessableEntityException("could not send email");
    }
  }

  async findProfile(username: string) {
    return this.prismaService.user
      .findUnique({
        where: {
          user_email: username,
        },
      })
      .profile();
  }
}

export function generateRandomCode(resetOrVerify: string) {
  return `${resetOrVerify}-${Math.floor(Math.random() * 100000)}`;
}
