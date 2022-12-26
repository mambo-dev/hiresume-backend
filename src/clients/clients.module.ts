import { Module } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { ClientsController } from "./clients.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { JobsService } from "src/jobs/jobs.service";
import { PaymentsModule } from "src/payments/payments.module";
import { PaymentsService } from "src/payments/payments.service";

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, PrismaService, JobsService, PaymentsService],
  imports: [PaymentsModule],
})
export class ClientsModule {}
