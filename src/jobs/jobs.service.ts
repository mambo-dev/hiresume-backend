import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JobsService {
  constructor(private prismaService: PrismaService) {}

  async findJob(id: number) {
    return await this.prismaService.job.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }
}
