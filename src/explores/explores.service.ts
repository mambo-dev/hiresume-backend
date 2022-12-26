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

    const freelancer_skills =
      await this.prismaService.skill_Freelancer.findMany({
        where: {
          freelancer_id: freelancer_logged_in.id,
        },
        include: {
          skill: true,
        },
      });

    const findSuitableJobs = await this.prismaService.skill_Job.findMany({
      take: 15,
      include: {
        skill: true,
        job: true,
      },
    });

    //look in array 1(jobs) skills and compare data in  array 2(freelancer)skills
    //todo add a satisfactory index i.e has two or more skills in this array required by jobs
    const recommended_jobs = [];
    for (let i = 0; i <= findSuitableJobs.length - 1; i++) {
      for (let j = 0; j <= freelancer_skills.length - 1; j++) {
        if (findSuitableJobs[i].skill.id === freelancer_skills[j].skill.id) {
          recommended_jobs.push(findSuitableJobs[i].job.id);
        }
      }
    }

    const removeDuplicates = (array: number[]) => {
      let unique = [];
      const sorted = array.sort((a, b) => {
        return a - b;
      });

      for (let i = 0; i <= sorted.length - 1; i++) {
        if (array[i] !== array[i + 1]) {
          unique.push(array[i]);
        }
      }
      return unique;
    };

    const return_jobs = removeDuplicates(recommended_jobs).map(async (id) => {
      const job = await this.prismaService.job.findUnique({
        where: {
          id,
        },
      });

      return { ...job };
    });

    const jobs_to_recommend = await Promise.all(return_jobs);

    return jobs_to_recommend;
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
