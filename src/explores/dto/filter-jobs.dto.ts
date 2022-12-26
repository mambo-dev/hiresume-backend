import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class FilterJobDto {
  job_level: string;

  job_hourly_to: number;

  skill_name: string;
}
