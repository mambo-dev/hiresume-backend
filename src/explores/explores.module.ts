import { Module } from "@nestjs/common";
import { ExploresService } from "./explores.service";
import { ExploresController } from "./explores.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { FreelancersService } from "src/freelancers/freelancers.service";
import { UsersService } from "src/users/users.service";

@Module({
  controllers: [ExploresController],
  providers: [ExploresService, PrismaService, FreelancersService, UsersService],
})
export class ExploresModule {}
