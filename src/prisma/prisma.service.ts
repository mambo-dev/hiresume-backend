// src/prisma/prisma.service.ts

import { INestApplication, Injectable } from "@nestjs/common";
import { PrismaClient, Prisma } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }

  async cleanDb() {
    return this.$executeRaw`DROP SCHEMA public CASCADE`;
  }
  async restoreDb() {
    return this.$executeRaw`CREATE SCHEMA public`;
  }
}
