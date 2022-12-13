import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UpdateAllProfileDto {
  @IsNotEmpty()
  freelancer_id: number;
  @IsNotEmpty()
  data: UpdateBioDto | UpdateEducationDto | UpdateExperienceDto;
  @IsNotEmpty()
  type: TYPE;
  @IsNotEmpty()
  idOfEntity: number;
}

export enum TYPE {
  bio,
  experience,
  education,
  skill,
}

export class UpdateBioDto {
  @MaxLength(50)
  bio_title: string;

  @MinLength(100)
  bio_description: string;

  bio_hourly_rate: number;
}

export class UpdateEducationDto {
  education_school: string;

  education_year_from: string;

  education_year_to: string;
}

export class UpdateExperienceDto {
  experience_company: string;

  experience_year_from: string;

  experience_year_to: string;
}
