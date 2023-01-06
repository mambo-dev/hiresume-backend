import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { Response } from "express";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await argon2.verify(user.user_password, pass))) {
      const { user_password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, res: Response) {
    const payload = { username: user.user_email, sub: user.user_id };

    const findUser = await this.usersService.findOne(user.user_email);

    const user_id = await this.prismaService.user.findUnique({
      where: {
        user_email: user.user_email,
      },
      include: {
        Freelancer: true,
        Client: true,
      },
    });
    const access_token = this.jwtService.sign(payload);

    res.cookie("access_token", access_token, {
      maxAge: 8.64e7,
    });

    // secure: process.env.NODE_ENV === "production" ? true : false,
    // path:
    //   process.env.NODE_ENV === "production"
    //     ? "http://localhost:3000"
    //     : "http://localhost:3000",

    const { user_password, ...result } = findUser;
    return {
      ...result,
      user_role_id:
        user_id.user_role === "client"
          ? user_id.Client.id
          : user_id.Freelancer.id,
    };
  }
}
