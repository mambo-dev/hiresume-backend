import { Module } from "@nestjs/common";
import { EmailService } from "src/email/email.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UsersService } from "./users.service";

@Module({
  providers: [UsersService, EmailService],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
