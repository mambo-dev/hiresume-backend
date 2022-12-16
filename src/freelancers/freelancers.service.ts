import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import {
  AddSkillsDto,
  CreateBioDto,
  CreateEducationDto,
  CreateExperienceDto,
} from "./dto/create-bio.dto";
import { UpdateAllProfileDto } from "./dto/update-all.dto";
import { Response } from "express";
import { DeleteAnyProfileDto } from "./dto/delete-any.dto";
import { BidJobDto } from "./dto/bid-job.dto";

export type SkillData = {
  skill_id: number;
};

@Injectable()
export class FreelancersService {
  constructor(
    private usersService: UsersService,
    private prismaService: PrismaService
  ) {}

  private async confirm_freelancer_exists(user: any) {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        user_email: user.username,
      },
    });

    const freelancer = await this.prismaService.freelancer.findUnique({
      where: {
        freelancer_user_id: findUser.id,
      },
    });

    if (!freelancer) {
      throw new ConflictException("freelancer not found please sign up");
    }

    return freelancer;
  }

  async createBio(user: any, createBioDto: CreateBioDto) {
    const { title, description, hourly_rate } = createBioDto;
    const freelancer = await this.confirm_freelancer_exists(user);

    return await this.prismaService.bio.create({
      data: {
        bio_title: title,
        bio_hourly_rate: hourly_rate,
        bio_description: description,
        Freelancer: {
          connect: {
            id: freelancer.id,
          },
        },
      },
    });
  }

  async createExperience(user: any, createExperienceDto: CreateExperienceDto) {
    const { company, year_from, year_to } = createExperienceDto;
    const freelancer = await this.confirm_freelancer_exists(user);

    return await this.prismaService.experience.create({
      data: {
        experience_company: company,
        experience_year_from: year_from,
        experience_year_to: year_to,
        Freelancer: {
          connect: {
            id: freelancer.id,
          },
        },
      },
    });
  }

  async updateFullProfile(updateFullProfiledto: UpdateAllProfileDto) {
    try {
      const { type, freelancer_id, data, idOfEntity } = updateFullProfiledto;

      const freelancer = await this.prismaService.freelancer.findUnique({
        where: {
          id: freelancer_id,
        },
      });

      if (!freelancer) {
        throw new NotFoundException("could not find profile to update");
      }

      if (`${type}` === "bio") {
        return await this.prismaService[type].update({
          where: {
            freelancer_id,
          },
          data: data,
        });
      } else if (`${type}` === "education") {
        return this.prismaService.education.update({
          where: {
            id: idOfEntity,
          },
          //@ts-ignore
          data: data,
        });
      } else {
        return this.prismaService.experience.update({
          where: {
            id: idOfEntity,
          },
          //@ts-ignore
          data: data,
        });
      }
    } catch (error) {
      console.log(error.message);
      throw new NotFoundException("try creating instead");
    }
  }

  async createEducation(user: any, createEducationDto: CreateEducationDto) {
    const { school, year_from, year_to } = createEducationDto;
    const freelancer = await this.confirm_freelancer_exists(user);

    return await this.prismaService.education.create({
      data: {
        education_school: school,
        education_year_from: year_from,
        education_year_to: year_to,
        Freelancer: {
          connect: {
            id: freelancer.id,
          },
        },
      },
    });
  }

  async addSkills(user: any, addSkillsDto: AddSkillsDto) {
    try {
      const { skills } = addSkillsDto;
      const freelancer = await this.confirm_freelancer_exists(user);

      const data = skills.map((skill) => {
        return {
          skill_id: skill.skill_id,
          assignedBy: user.username,
        };
      });

      await this.prismaService.freelancer.update({
        where: { id: freelancer.id },
        data: {
          Skill_Freelancer: {
            createMany: {
              data: data,
            },
          },
        },
        include: {
          Skill_Freelancer: true,
        },
      });

      return true;
    } catch (error) {
      throw new BadRequestException(`could not add skill ${error.message}`);
    }
  }

  async getFullProfile(user: any) {
    const freelancer = await this.confirm_freelancer_exists(user);

    const fullProfile = await this.prismaService.freelancer.findUnique({
      where: {
        id: freelancer.id,
      },
      include: {
        freelancer_experience: true,

        freelancer_education: true,
        freelancer_Bio: true,
      },
    });

    return fullProfile;
  }

  async uploadFiles(user: any, files: Array<Express.Multer.File>) {
    try {
      const freelancer = await this.confirm_freelancer_exists(user);

      console.log(files);

      const fileNames: string[] = files.map((file) => {
        return `${file.filename}`;
      });

      await this.prismaService.freelancer.update({
        where: {
          id: freelancer.id,
        },
        data: {
          //@ts-ignore
          freelancer_files: [...fileNames],
        },
      });

      return true;
    } catch (error) {
      throw new Error("could not upload your files");
    }
  }

  async getFreelancerFile(user: any, res: Response, filename: string) {
    try {
      const freelancer = await this.confirm_freelancer_exists(user);

      const file = freelancer.freelancer_files
        .map((file) => {
          if (file === filename.split(":")[1]) {
            return file;
          }
          return null;
        })
        .filter((file) => {
          return file === filename.split(":")[1];
        });

      return res.sendFile(`${file[0]}`, { root: "uploads/freelancer" });
    } catch (error) {
      console.log(error);
      throw new BadRequestException("could not find file");
    }
  }

  async deleteFullProfile(deleteAnyProfile: DeleteAnyProfileDto) {
    const { type, freelancer_id, idOfEntity } = deleteAnyProfile;
    try {
      const freelancer = await this.prismaService.freelancer.findUnique({
        where: {
          id: freelancer_id,
        },
      });

      if (!freelancer) {
        throw new NotFoundException("could not find profile to update");
      }

      if (`${type}` === "bio") {
        return await this.prismaService[type].delete({
          where: {
            freelancer_id,
          },
        });
      } else if (`${type}` === "education") {
        return await this.prismaService.education.delete({
          where: {
            id: idOfEntity,
          },
        });
      } else if (`${type}` === "skill") {
        return await this.prismaService.skill.delete({
          where: {
            id: idOfEntity,
          },
        });
      } else {
        return this.prismaService.experience.delete({
          where: {
            id: idOfEntity,
          },
        });
      }
    } catch (error) {
      console.log(error.message);
      throw new NotFoundException(`could not delete your ${type} entity`);
    }
  }

  async bidForJob(
    user: any,
    job_id: number,
    bidJobDto: BidJobDto,
    files: Array<Express.Multer.File>
  ) {
    const freelancer = await this.confirm_freelancer_exists(user);

    //if freelancer has bid for the job he should not bid again
    //i achive this by looking at the bid if bid has freelancer id already on the job

    const bids = await this.prismaService.job
      .findUnique({
        where: {
          id: job_id,
        },
      })
      .job_bid();

    const freelancer_already_bid = bids.some((bid) => {
      return bid.freelancer_id === freelancer.id;
    });

    if (freelancer_already_bid) {
      throw new BadRequestException("cannot bid twice");
    }

    if (files) {
      const fileNames = await this.uploadBidFiles(files);

      return await this.prismaService.bid.create({
        data: {
          ...bidJobDto,
          bid_attachments: [...fileNames],
          Freelancer: {
            connect: {
              id: freelancer.id,
            },
          },
          Job: {
            connect: {
              id: job_id,
            },
          },
          bid_approval_status: false,
        },
      });
    }

    return await this.prismaService.bid.create({
      data: {
        ...bidJobDto,
        bid_attachments: [],
        Freelancer: {
          connect: {
            id: freelancer.id,
          },
        },
        Job: {
          connect: {
            id: job_id,
          },
        },
        bid_approval_status: false,
      },
    });
  }

  async removeBid(user: any, bid_id: number) {
    const freelancer = await this.confirm_freelancer_exists(user);

    const findBid = await this.prismaService.bid.findUnique({
      where: {
        id: bid_id,
      },
    });

    if (!findBid) {
      throw new NotFoundException("could not find bid to delete");
    }

    if (findBid.freelancer_id !== freelancer.id) {
      throw new ForbiddenException("cannot complete this action");
    }

    await this.prismaService.bid.delete({
      where: {
        id: bid_id,
      },
    });

    return true;
  }

  private async uploadBidFiles(files: Array<Express.Multer.File>) {
    try {
      const fileNames: string[] = files.map((file) => {
        return `${file.filename}`;
      });

      return fileNames;
    } catch (error) {
      throw new Error("could not upload your files");
    }
  }

  async getApprovedJobs(user: any) {
    const freelancer = await this.confirm_freelancer_exists(user);

    return await this.prismaService.job.findMany({
      where: {
        job_bid: {
          every: {
            bid_approval_status: true,
          },
        },
        freelancerId: freelancer.id,
      },
    });
  }
}
