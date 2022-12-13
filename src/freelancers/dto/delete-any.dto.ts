import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { TYPE } from "./update-all.dto";

export class DeleteAnyProfileDto {
  @IsNotEmpty()
  freelancer_id: number;

  @IsNotEmpty()
  type: TYPE;
  @IsNotEmpty()
  idOfEntity: number;
}
