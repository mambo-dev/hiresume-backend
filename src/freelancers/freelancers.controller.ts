import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Put,
  Patch,
  Get,
  ParseIntPipe,
  StreamableFile,
} from "@nestjs/common";
import {
  Delete,
  Param,
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
import { BidJobDto } from "./dto/bid-job.dto";
import {
  AddSkillsDto,
  CreateBioDto,
  CreateEducationDto,
  CreateExperienceDto,
} from "./dto/create-bio.dto";
import { DeleteAnyProfileDto } from "./dto/delete-any.dto";
import { UpdateAllProfileDto } from "./dto/update-all.dto";
import { FreelancersService } from "./freelancers.service";

@Controller("freelancers")
export class FreelancersController {
  constructor(private freelancersService: FreelancersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("full-profile")
  async getFullProfile(
    @Request() req,
    @Res({
      passthrough: true,
    })
    res: any
  ) {
    return this.freelancersService.getFullProfile(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post("bio")
  @UseInterceptors(
    FileInterceptor("image", {
      limits: { fileSize: 100000 },
      storage: diskStorage({
        destination: "./uploads/images",
        async filename(req, file, callback) {
          callback(null, `${uuid()}-${file.originalname}`);
        },
      }),

      fileFilter(req, file, callback) {
        if (!Boolean(file.mimetype.match(/(jpeg|png|jpg|svg)/)))
          callback(new Error("file type not allowed"), false);
        callback(null, true);
      },
    })
  )
  async createBio(
    @Request() req,
    @Body() createBioDto: CreateBioDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.freelancersService.createBio(req.user, createBioDto, image);
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
  @Patch("update-any/:freelancer_id/:idOfEntity")
  async updateFullProfile(
    @Request() req,
    @Body() updateFullProfiledto: UpdateAllProfileDto,
    @Param("freelancer_id", ParseIntPipe) freelancer_id: number,
    @Param("idOfEntity", ParseIntPipe) idOfEntity: number
  ) {
    return this.freelancersService.updateFullProfile(
      updateFullProfiledto,
      freelancer_id,
      idOfEntity
    );
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
  @Get("files/:filename")
  async getFreelancerFile(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
    @Param("filename") filename
  ): Promise<StreamableFile> {
    return this.freelancersService.getFreelancerFile(req.user, res, filename);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("delete-any/:type/:freelancer_id/:idOfEntity")
  async deleteFullProfile(
    @Param("type") type: string,
    @Param("freelancer_id", ParseIntPipe) freelancer_id: number,
    @Param("idOfEntity", ParseIntPipe) idOfEntity: number
  ) {
    let deleteAnyProfile: DeleteAnyProfileDto = {
      //@ts-ignore
      type: `${type}`,
      freelancer_id,
      idOfEntity,
    };
    return this.freelancersService.deleteFullProfile(deleteAnyProfile);
  }

  @UseGuards(JwtAuthGuard)
  @Post("bid-job/:job_id")
  @UseInterceptors(
    FilesInterceptor("files", 4, {
      limits: { fileSize: 100000 },
      storage: diskStorage({
        destination: "./uploads/bids",
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
  async bidForJob(
    @Param("job_id", ParseIntPipe) job_id: number,
    @Request() req,
    @Body() bidJobDto: BidJobDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return this.freelancersService.bidForJob(
      req.user,
      job_id,
      bidJobDto,
      files
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete("remove-bid/:bid_id")
  async removeBid(
    @Param("bid_id", ParseIntPipe) bid_id: number,
    @Request() req
  ) {
    return this.freelancersService.removeBid(req.user, bid_id);
  }
  @UseGuards(JwtAuthGuard)
  @Get("approved-jobs")
  async getApprovedJobs(@Request() req) {
    return this.freelancersService.getApprovedJobs(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("update-availability")
  async updateAvailability(@Request() req) {
    return this.freelancersService.updateAvailability(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("sign-contract/:contract_id")
  async signContract(
    @Request() req,
    @Body() { contract_accepted, contract_denied_reason },
    @Param("contract_id", ParseIntPipe) contract_id: number
  ) {
    return this.freelancersService.signContract(
      req.user,
      contract_id,
      contract_accepted,
      contract_denied_reason
    );
  }
}
