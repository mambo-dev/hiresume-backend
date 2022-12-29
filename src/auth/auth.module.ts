import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport/dist";

import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./jwt.strategy";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1h" },
    }),
    PrismaModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
