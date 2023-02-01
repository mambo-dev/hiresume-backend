import { Injectable } from "@nestjs/common";
import { FreelancersService } from "src/freelancers/freelancers.service";
import { PrismaService } from "src/prisma/prisma.service";
import { FilterJobDto } from "./dto/filter-jobs.dto";

@Injectable()
export class ExploresService {
  constructor(
    private prismaService: PrismaService,
    private freelancerService: FreelancersService
  ) {}

  async findSampleJobs() {
    return await this.prismaService.job.findMany({
      take: 10,

      include: {
        job_bid: false,
      },
      orderBy: {
        job_title: "asc",
      },
    });
  }

  async findSampleFreelancers() {
    //find best freelancers to display
    return this.prismaService.user.findMany({
      take: 10,
      where: {
        Freelancer: {
          freelancer_ratings: {
            every: {
              rating: {
                gte: 4,
              },
            },
          },
        },
      },
      include: {
        profile: true,
      },
      orderBy: {
        Freelancer: {
          freelancer_ratings: {
            _count: "asc",
          },
        },
      },
    });
  }

  //freelancers explore logged in

  async recommendJobs(user: any, cursor: any) {
    //recommend jobs based on skills freelncer has
    const freelancer_logged_in =
      await this.freelancerService.confirm_freelancer_exists(user);

    const find_freelancer_skills =
      await this.prismaService.skill_Freelancer.findMany({
        where: {
          freelancer: {
            id: freelancer_logged_in.id,
          },
        },
      });

    const find_jobs = await this.prismaService.job.findMany();
    return find_jobs;
  }

  async getJob(job_id: number) {
    try {
      const job = await this.prismaService.job.findUniqueOrThrow({
        where: {
          id: job_id,
        },
      });

      const bid_count = await this.prismaService.bid.aggregate({
        _count: {
          id: true,
        },
      });

      return {
        ...job,
        total_bids: bid_count._count.id,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
  async searchJobs(query: string) {
    //sends query gets job back
    const jobsFound = await this.prismaService.job.findMany({
      take: 15,
      where: {
        job_title: {
          search: query,
        },
        job_description: {
          search: query,
        },
      },
    });
    return jobsFound;
  }

  async filterJobs(filters: FilterJobDto) {
    const { skill_name, ...result } = filters;

    return await this.prismaService.job.findMany({
      where: {
        ...result,
        job_hourly_to: {
          lte: result.job_hourly_to,
        },
        job_hourly_from: {
          gte: result.job_hourly_to,
        },
        Skill_Job: {
          some: {
            skill: {
              skill_name: {
                contains: skill_name,
              },
            },
          },
        },
      },
    });
  }
}
