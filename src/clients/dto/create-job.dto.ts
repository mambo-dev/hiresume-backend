import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateJobDto {
  @IsNotEmpty({
    message: "cannot have an empty title",
  })
  @MaxLength(40, {
    message: "cannot exceed  forty words",
  })
  @MinLength(10, {
    message: "title length should be more than ten words",
  })
  job_title: string;
  @IsNotEmpty({
    message: "description is required",
  })
  @MinLength(60, {
    message: "description length should be more than sixty words",
  })
  job_description: string;
  @IsNotEmpty({
    message: "this field is required",
  })
  job_length: string;

  job_hourly_from: number;

  job_hourly_to: number;

  job_fixed_price?: number;

  job_level: string;

  skills: string[];
}
