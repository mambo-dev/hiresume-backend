import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Put,
  Patch,
  Get,
} from "@nestjs/common";
import {
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common/decorators";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from "@nestjs/platform-express/multer";
import { Response } from "express";
import { diskStorage } from "multer";
import { JwtAuthGuard } from "src/auth/jwt-auth.gaurd";
import { uuid } from "uuidv4";
import {
  AddSkillsDto,
  CreateBioDto,
  CreateEducationDto,
  CreateExperienceDto,
} from "./dto/create-bio.dto";
import { UpdateAllProfileDto } from "./dto/update-all.dto";
import { FreelancersService } from "./freelancers.service";

@Controller("freelancers")
export class FreelancersController {
  constructor(private freelancersService: FreelancersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("full-profile")
  async getFullProfile(@Request() req) {
    return this.freelancersService.getFullProfile(req.user);
  }

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

  //updates any feature of a freelancers profile
  @UseGuards(JwtAuthGuard)
  @Patch("update-any")
  async updateFullProfile(
    @Request() req,
    @Body() updateFullProfiledto: UpdateAllProfileDto
  ) {
    return this.freelancersService.updateFullProfile(updateFullProfiledto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("upload-files")
  @UseInterceptors(
    FilesInterceptor("files", 4, {
      limits: { fileSize: 100000 },
      storage: diskStorage({
        destination: "./uploads/freelancer",
        async filename(req, file, callback) {
          callback(null, `${uuid()}-${file.originalname}`);
        },
      }),

      fileFilter(req, file, callback) {
        if (!Boolean(file.mimetype.match(/(pdf|doc|msword)/)))
          callback(new Error("file type not allowed"), false);
        callback(null, true);
      },
    })
  )
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() req
  ) {
    return this.freelancersService.uploadFiles(req.user, files);
  }

  @UseGuards(JwtAuthGuard)
  @Get("files")
  async getFreelancerFile(
    @Request() req,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.getFreelancerFile(req.user, res);
  }
}
