import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { UsersService } from "./users/users.service";
import { AuthService } from "./auth/auth.service";
import { LocalAuthGuard } from "./auth/local-auth.gaurd";
import { JwtAuthGuard } from "./auth/jwt-auth.gaurd";
import { Response } from "express";
import { ResetPasswordDto } from "./users/dto/reset-pass.dto";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
    private authService: AuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
  }

  @Post("auth/signup")
  async signup(@Request() req) {
    return this.userService.create(req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Post("verify/:verificationCode")
  async verify(
    @Request() req,
    @Param("verificationCode") verificationCode: string
  ) {
    return this.userService.verifyUser(verificationCode, req.user);
  }

  @Post("forgot-password")
  async forgotPassword(@Request() req, @Body() { email }) {
    return this.userService.initiatePasswordRecovery(email);
  }

  @Post("reset-password")
  async resetPassword(
    @Request() req,
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("user/profile")
  getProfile(@Request() req) {
    return this.userService.findProfile(req.user.username);
  }

  @Get("oauth-success")
  oauthSuccess() {
    return true;
  }
}
