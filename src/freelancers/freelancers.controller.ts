import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.gaurd";
import {
  AddSkillsDto,
  CreateBioDto,
  CreateEducationDto,
  CreateExperienceDto,
} from "./dto/create-bio.dto";
import { FreelancersService } from "./freelancers.service";

@Controller("freelancers")
export class FreelancersController {
  constructor(private freelancersService: FreelancersService) {}

  @UseGuards(JwtAuthGuard)
  @Post("bio")
  async createBio(@Request() req, @Body() createBioDto: CreateBioDto) {
    return this.freelancersService.createBio(req.user, createBioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("experience")
  async createExperience(
    @Request() req,
    @Body() createExperienceDto: CreateExperienceDto
  ) {
    return this.freelancersService.createExperience(
      req.user,
      createExperienceDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post("education")
  async createEducation(
    @Request() req,
    @Body() createEducationDto: CreateEducationDto
  ) {
    return this.freelancersService.createEducation(
      req.user,
      createEducationDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post("skills")
  async addSkills(@Request() req, @Body() addSkillsDto: AddSkillsDto) {
    return this.freelancersService.addSkills(req.user, addSkillsDto);
  }
}
