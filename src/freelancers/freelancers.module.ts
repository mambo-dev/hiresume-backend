import { Module } from "@nestjs/common";
import { FreelancersService } from "./freelancers.service";
import { FreelancersController } from "./freelancers.controller";
import { UsersModule } from "src/users/users.module";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [FreelancersController],
  providers: [FreelancersService, PrismaService],
  imports: [UsersModule],
})
export class FreelancersModule {}
