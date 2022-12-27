import { Module } from "@nestjs/common";
import { ExploresService } from "./explores.service";
import { ExploresController } from "./explores.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { FreelancersService } from "src/freelancers/freelancers.service";
import { UsersService } from "src/users/users.service";
import { EmailService } from "src/email/email.service";

@Module({
  controllers: [ExploresController],
  providers: [
    ExploresService,
    PrismaService,
    FreelancersService,
    UsersService,
    EmailService,
  ],
})
export class ExploresModule {}
