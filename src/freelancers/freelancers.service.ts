import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
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
import { createReadStream } from "fs";
import { join } from "path";
import { AmazonService } from "../amazon/amazon.service";

export type SkillData = {
  skill_name: string;
};

@Injectable()
export class FreelancersService {
  constructor(
    private usersService: UsersService,
    private prismaService: PrismaService,
    private amazonService: AmazonService
  ) {}

  async confirm_freelancer_exists(user: any) {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        user_email: user.username,
      },
    });

    const freelancer = await this.prismaService.freelancer.findUnique({
      where: {
        freelancer_user_id: findUser.id,
      },
      include: {
        freelancer_user: true,
      },
    });

    if (!freelancer) {
      throw new ConflictException("freelancer not found please sign up");
    }

    return freelancer;
  }

  async createBio(
    user: any,
    createBioDto: CreateBioDto,
    image: Express.Multer.File
  ) {
    const { title, description, hourly_rate } = createBioDto;
    const freelancer = await this.confirm_freelancer_exists(user);

    const imageFile = createReadStream(image.path);

    this.amazonService.uploadFile(imageFile, "hiresumefiles", image.filename);

    return await this.prismaService.bio.create({
      data: {
        bio_image_url: image.filename,
        bio_title: title,
        bio_hourly_rate: Number(hourly_rate),
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
    const { company, year_from, year_to, tag, position } = createExperienceDto;
    const freelancer = await this.confirm_freelancer_exists(user);

    return await this.prismaService.experience.create({
      data: {
        experience_company: company,
        experience_year_from: new Date(year_from),
        experience_year_to: new Date(year_to),
        experience_position: position,
        experience_tag: tag,
        Freelancer: {
          connect: {
            id: freelancer.id,
          },
        },
      },
    });
  }

  async updateFullProfile(
    updateFullProfiledto: UpdateAllProfileDto,
    freelancer_id: number,
    idOfEntity: number
  ) {
    try {
      const { type, data } = updateFullProfiledto;
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
        education_year_from: new Date(year_from),
        education_year_to: new Date(year_to),
        Freelancer: {
          connect: {
            id: freelancer.id,
          },
        },
      },
    });
  }

  async addSkillsOrAttach(user: any, skill: string) {
    try {
      const freelancer = await this.confirm_freelancer_exists(user);

      const findSkill = await this.prismaService.skill.findUnique({
        where: {
          skill_name: skill,
        },
      });

      if (!findSkill) {
        const createSkill = await this.prismaService.skill.create({
          data: {
            skill_name: skill,
          },
        });

        await this.prismaService.freelancer.update({
          where: {
            id: freelancer.id,
          },
          data: {
            Skill_Freelancer: {
              create: {
                skill: {
                  connect: {
                    id: createSkill.id,
                  },
                },
                assignedBy: freelancer.freelancer_user.user_email,
              },
            },
          },
        });

        return true;
      }

      await this.prismaService.freelancer.update({
        where: {
          id: freelancer.id,
        },
        data: {
          Skill_Freelancer: {
            create: {
              skill: {
                connect: {
                  skill_name: skill,
                },
              },
              assignedBy: freelancer.freelancer_user.user_email,
            },
          },
        },
      });

      return true;
    } catch (error) {
      throw new BadRequestException(`could not add skill ${error.message}`);
    }
  }

  async getFullProfile(user: any, res: any) {
    const freelancer = await this.confirm_freelancer_exists(user);

    const fullProfile = await this.prismaService.freelancer.findUnique({
      where: {
        id: freelancer.id,
      },
      include: {
        freelancer_experience: true,
        freelancer_education: true,
        freelancer_Bio: true,
        freelancer_user: true,
      },
    });

    const freelancer_skills =
      await this.prismaService.skill_Freelancer.findMany({
        where: {
          freelancer: {
            id: fullProfile.id,
          },
        },
        include: {
          skill: true,
        },
      });

    const returnSkill = freelancer_skills.map((skill) => {
      return {
        skill: { ...skill.skill },
      };
    });

    const image_url = this.amazonService.getObjectUrl(
      "hiresumefiles",
      fullProfile.freelancer_Bio?.bio_image_url
    );
    const { user_password, ...result } = fullProfile.freelancer_user;
    return {
      ...fullProfile,
      freelancer_Bio: {
        ...fullProfile.freelancer_Bio,
        bio_image_url: image_url,
      },
      freelancer_user: result,
      returnSkill,
    };
  }

  async uploadFiles(user: any, files: Array<Express.Multer.File>) {
    try {
      const freelancer = await this.confirm_freelancer_exists(user);

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

      const findFile = freelancer.freelancer_files.find((file) => {
        return file === filename;
      });

      const file = createReadStream(
        join(process.cwd(), `uploads/freelancer/${findFile}`)
      );

      res.set({
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename=${findFile}`,
      });

      return new StreamableFile(file);
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

    const bids = await this.prismaService.job.findUnique({
      where: {
        id: job_id,
      },
      include: {
        job_bid: true,
      },
    });

    if (!bids) {
      throw new BadRequestException("no job to bid");
    }

    const freelancer_already_bid = bids.job_bid.some((bid) => {
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

  async updateAvailability(user: any) {
    const freelancer = await this.confirm_freelancer_exists(user);

    return await this.prismaService.freelancer.update({
      where: {
        id: freelancer.id,
      },
      data: {
        freelancer_availability: freelancer.freelancer_availability
          ? false
          : true,
      },
    });
  }

  async signContract(
    user: any,
    contract_id: number,
    contract_accepted: boolean,
    contract_denied_reason?: boolean
  ) {
    const freelancer = await this.confirm_freelancer_exists(user);

    if (!contract_accepted) {
      return await this.prismaService.contract.update({
        where: {
          id: contract_id,
        },
        data: {
          contract_accepted: false,
          //@ts-ignore
          contract_denied_reason,
        },
      });
    }

    const signContract = await this.prismaService.contract.update({
      where: {
        id: contract_id,
      },
      data: {
        contract_accepted: true,
        contract_freelancer_signed: user.username,
        contract_freelancer: {
          connect: {
            id: freelancer.id,
          },
        },
      },
    });

    return signContract;
  }

  async getSkills(query: string) {
    try {
      const skills = await this.prismaService.skill.findMany({
        where: {
          skill_name: {
            search: query,
          },
        },
      });
      console.log(skills);
      return skills;
    } catch (error) {
      throw new BadRequestException("something went wrong");
    }
  }
}
