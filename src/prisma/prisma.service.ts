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

  async cleanDb(array: string[]) {
    const prisma = new PrismaClient();
    const deleteMany = array.map(async (arr) => {
      await prisma[arr].deleteMany({});
    });
    // await this.user.deleteMany({});

    return Promise.all(deleteMany);
  }
  async restoreDb() {
    return this.$executeRaw`CREATE SCHEMA test_db`;
  }
}
