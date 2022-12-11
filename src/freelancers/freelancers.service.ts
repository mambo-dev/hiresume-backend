import {
  ConflictException,
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
import { CreateFreelancerDto } from "./dto/create-freelancer.dto";
import { UpdateAllProfileDto, UpdateBioDto } from "./dto/update-all.dto";
import { UpdateFreelancerDto } from "./dto/update-freelancer.dto";

export type SkillData = {
  skill_name: string;
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
    const { skills } = addSkillsDto;
    const freelancer = await this.confirm_freelancer_exists(user);

    //add skills to freelancer
    return this.prismaService.freelancer.update({
      where: {
        id: freelancer.id,
      },
      data: {
        freelancer_skills: {
          createMany: {
            data: [...skills],
          },
        },
      },
    });
  }

  async getFullProfile(user: any) {
    const freelancer = await this.confirm_freelancer_exists(user);

    return await this.prismaService.freelancer.findUnique({
      where: {
        id: freelancer.id,
      },
      include: {
        freelancer_experience: true,
        freelancer_skills: true,
        freelancer_education: true,
        freelancer_Bio: true,
        freelancer_active_job: true,
      },
    });
  }
}
