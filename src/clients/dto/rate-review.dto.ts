import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class RateReviewDto {
  @IsNotEmpty({
    message: "rating is required",
  })
  rating: number;
  @IsNotEmpty({
    message: "review is required",
  })
  @MaxLength(100, {
    message: "review should not be more than 100 words",
  })
  review: string;
}

export class UpdateRateReviewDto extends PartialType(RateReviewDto) {}
