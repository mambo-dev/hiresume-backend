import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class BidJobDto {
  @IsNotEmpty()
  bid_rate: number;
  @IsNotEmpty()
  bid_coverletter: string;
}
