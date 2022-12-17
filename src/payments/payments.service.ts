import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";

@Injectable()
export class PaymentsService {
  private stripe;
  constructor(private prismaService: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
    });
  }

  async payHiresume(job_id: number, freelancer_id: number) {
    const job = await this.prismaService.job.findUniqueOrThrow({
      where: {
        id: job_id,
      },
      include: {
        job_bid: true,
      },
    });
  }
  async payFreelancer() {}
}
