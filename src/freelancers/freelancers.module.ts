import { Module } from "@nestjs/common";
import { FreelancersService } from "./freelancers.service";
import { FreelancersController } from "./freelancers.controller";
import { UsersModule } from "src/users/users.module";
import { PrismaService } from "src/prisma/prisma.service";
import { AmazonService } from "../amazon/amazon.service";
import { AmazonModule } from "../amazon/amazon.module";

@Module({
  controllers: [FreelancersController],
  providers: [FreelancersService, PrismaService, AmazonService],
  imports: [UsersModule, AmazonModule],
})
export class FreelancersModule {}
