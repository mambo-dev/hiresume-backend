import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await argon2.verify(user.user_password, pass))) {
      const { user_password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, res: any) {
    const payload = { username: user.user_email, sub: user.user_id };

    const findUser = await this.usersService.findOne(user.user_email);

    const access_token = this.jwtService.sign(payload);

    res.cookie("access_token", access_token);

    const { user_password, ...result } = findUser;
    return {
      ...result,
      access_token,
    };
  }
}
