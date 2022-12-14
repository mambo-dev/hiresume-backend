import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/createuser.dto";
import * as argon2 from "argon2";
import { EmailService } from "src/email/email.service";
import { User } from "@prisma/client";
import { ResetPasswordDto } from "./dto/reset-pass.dto";

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private emailsService: EmailService
  ) {}
  async findOne(username: string) {
    return await this.prismaService.user.findUnique({
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

    await this.assignUserRole(user.user_role, this.prismaService, user);

    await this.sendVerificationCode(
      email,
      verificationCode,
      "http://localhost:3000"
    );

    const { user_password, ...returnUser } = user;

    return {
      ...returnUser,
      verificationCode,
    };
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
    verificationCode: string,
    frontEndLink: string
  ) {
    const sendEmail = await this.emailsService.sendEmail({
      to: user_email,
      from: "mambo.michael.22@gmail.com",
      subject: "verify your email",
      html: `<div
      class="email-div"
      style="width: 80%;height: 60%;display: flex;flex-direction:column;align-items: flex-start;justify-content: flex-start;background-color: white;border: 1px solid rgb(151, 151, 151);border-radius: 5px;padding: 5px;box-shadow: 6px 4px 13px -3px rgba(240,235,235,0.75);-webkit-box-shadow: 6px 4px 13px -3px rgba(240,235,235,0.75);-moz-box-shadow: 6px 4px 13px -3px rgba(240,235,235,0.75);margin: auto;"
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
        <a href="${frontEndLink}">
          <button style="background-color: rgb(114, 255, 255);border: 1px solid teal;border-radius: 5px;width: 100px;height: 30px;padding: 5px;color: rgb(0, 79, 79);font-weight: bolder;margin: auto;">
            verify
          </button>
        </a>
      </div>
    </div>;`,
    });

    if (!sendEmail) {
      throw new UnprocessableEntityException("could not send email");
    }
  }

  async verifyUser(verificationCode: string, user: any) {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        user_email: user.username,
      },
      include: {
        Account: true,
      },
    });
    if (!findUser) {
      throw new NotFoundException("could not find account");
    }

    if (findUser.Account.account_user_verified) {
      throw new BadRequestException("account is already verified");
    }

    const verify = await argon2.verify(
      findUser.Account.account_verification_code,
      verificationCode
    );

    if (!verify) {
      throw new ForbiddenException("could not verify account");
    }

    const account = await this.prismaService.account.update({
      where: {
        account_user_id: findUser.id,
      },
      data: {
        account_user_verified: true,
      },

      include: {
        account_user: true,
      },
    });

    return {
      email: account.account_user.user_email,
      verified: true,
    };
  }

  async initiatePasswordRecovery(email: string) {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        user_email: email,
      },
    });

    if (!findUser) {
      throw new Error("something went wrong ");
    }

    const passwordResetCode = generateRandomCode("res");

    const frontEndLink = "http://localhost:3000";
    const sendEmail = this.emailsService.sendEmail({
      to: email,
      subject: "Password reset request",
      html: `<div
        class="email-div"
        style="width: 80%;height: 60%;display: flex;flex-direction: column;align-items: flex-start;justify-content: flex-start;background-color: white;border: 1px solid rgb(151, 151, 151);border-radius: 5px;padding: 5px;box-shadow: 6px 4px 13px -3px rgba(240,235,235,0.75);-webkit-box-shadow: 6px 4px 13px -3px rgba(240,235,235,0.75);-moz-box-shadow: 6px 4px 13px -3px rgba(240,235,235,0.75);margin: auto;"
      >
        <h1 style="color: rgb(115, 115, 115);">Password Reset Request</h1>
        <p style="color: rgb(115, 115, 115);">
          Dear client,a password reset request has been sent to our server if this wasn't you you can safely ignore this email if it was
          your password reset code  <span>${passwordResetCode}</span>
          or click the button below to reset password
        </p>
        <div
          class="button-div"
          style="width: 100%;display: flex;flex-direction: column;align-items: center;justify-content: center;"
        >
          <a href="${frontEndLink}">
            <button style="background-color: rgb(114, 255, 255);border: 1px solid teal;border-radius: 5px;width: 100px;height: 30px;padding: 5px;color: rgb(0, 79, 79);font-weight: bolder;margin: auto;">
              verify
            </button>
          </a>
        </div>
      </div>;`,
      from: process.env.APP_USER_EMAIL,
    });

    if (!sendEmail) {
      throw new BadRequestException("something went wrong");
    }

    await this.prismaService.account.update({
      where: {
        account_user_id: findUser.id,
      },
      data: {
        account_password_reset: await argon2.hash(passwordResetCode),
      },
    });

    return true;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, newPassword, passwordResetCode } = resetPasswordDto;
    const findUser = await this.prismaService.user.findUnique({
      where: {
        user_email: email,
      },
      include: {
        Account: true,
      },
    });

    if (!findUser) {
      throw new UnprocessableEntityException("could not reset password");
    }

    const verify = await argon2.verify(
      findUser.Account.account_password_reset,
      passwordResetCode
    );

    if (!verify) {
      throw new ForbiddenException(
        "could not verify this code, please request again"
      );
    }

    const hashNewPassword = await argon2.hash(newPassword);

    await this.prismaService.user.update({
      where: {
        id: findUser.id,
      },
      data: {
        user_password: hashNewPassword,
      },
    });

    return true;
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

export let testVerification: string;
