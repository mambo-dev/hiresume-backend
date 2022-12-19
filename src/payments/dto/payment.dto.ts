import { IsNotEmpty } from "class-validator";

export class PaymentDto {
  @IsNotEmpty()
  freelancer_id: number;
  @IsNotEmpty()
  bid_id: number;
}
