import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminsService {
  constructor(private prismaService: PrismaService) {}
}
