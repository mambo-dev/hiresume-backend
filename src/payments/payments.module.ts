import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";

import { PrismaService } from "src/prisma/prisma.service";

@Module({
  providers: [PaymentsService, PrismaService],
  exports: [PaymentsModule],
})
export class PaymentsModule {}
