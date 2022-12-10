import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { SkillData } from "../freelancers.service";

export class CreateBioDto {
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @MinLength(100)
  description: string;

  @IsNotEmpty()
  hourly_rate: number;
}

export class CreateEducationDto {
  @IsNotEmpty()
  school: string;
  @IsNotEmpty()
  year_from: string;
  @IsNotEmpty()
  year_to: string;
}

export class CreateExperienceDto {
  @IsNotEmpty()
  company: string;
  @IsNotEmpty()
  year_from: string;
  @IsNotEmpty()
  year_to: string;
}

export class AddSkillsDto {
  @IsNotEmpty()
  skills: SkillData[];
}
