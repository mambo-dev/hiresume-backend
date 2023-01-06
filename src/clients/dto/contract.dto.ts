import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateContractDto {
  @IsNotEmpty({
    message: "cannot have empty details",
  })
  @MaxLength(1000, {
    message: "cannot exceed  1000 words",
  })
  @MinLength(100, {
    message: "contract details should be more than 100 words",
  })
  details: string;
  @IsNotEmpty({
    message: "this field is required",
  })
  start: string;
  @IsNotEmpty({
    message: "this field is required",
  })
  end: string;
  @IsNotEmpty({
    message: "this field is required",
  })
  date_signed: string;

  @IsNotEmpty({
    message: "this field is required",
  })
  client_signed: string;
}

export class UpdateContractDto extends PartialType(CreateContractDto) {}
