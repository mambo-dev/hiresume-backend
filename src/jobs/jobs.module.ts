import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JobsService } from "./jobs.service";

@Module({
  providers: [JobsService, PrismaService],
  exports: [JobsModule],
})
export class JobsModule {}
