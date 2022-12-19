import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";
import { PaymentDto } from "./dto/payment.dto";

@Injectable()
export class PaymentsService {
  private stripe: any;
  constructor(private prismaService: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
    });
  }

  async payHiresume(amount, currency, paymentMethod) {
    return true;
  }

  private async confirm_payment(paymentIntentId, paymentMethod) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: paymentMethod,
        }
      );

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
  async payFreelancer() {
    return true;
  }
}
