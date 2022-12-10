import { Controller, Get, Post, Request, Res, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { UsersService } from "./users/users.service";
import { AuthService } from "./auth/auth.service";
import { LocalAuthGuard } from "./auth/local-auth.gaurd";
import { JwtAuthGuard } from "./auth/jwt-auth.gaurd";
import { Response } from "express";

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
  @Get("user/profile")
  getProfile(@Request() req) {
    return this.userService.findProfile(req.user.username);
  }
}
