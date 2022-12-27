import { Module } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { ReportsController } from "./reports.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { FreelancersService } from "src/freelancers/freelancers.service";
import { UsersService } from "src/users/users.service";
import { ClientsService } from "src/clients/clients.service";
import { JobsService } from "src/jobs/jobs.service";
import { PaymentsService } from "src/payments/payments.service";
import { EmailService } from "src/email/email.service";

@Module({
  controllers: [ReportsController],
  providers: [
    ReportsService,
    PrismaService,
    FreelancersService,
    UsersService,
    ClientsService,
    JobsService,
    PaymentsService,
    EmailService,
  ],
})
export class ReportsModule {}
