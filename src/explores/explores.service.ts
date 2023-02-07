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
          freelancer_id: freelancer_logged_in.id,
        },
        include: {
          skill: true,
        },
      });

    const skills = find_freelancer_skills.map((skills) => {
      return {
        id: skills.skill.id,
        skill_name: skills.skill.skill_name,
      };
    });

    const find_all_jobs = await this.prismaService.skill_Job.findMany({
      include: {
        job: true,
        skill: true,
      },
    });

    const jobs_skills = find_all_jobs.map((jobs) => {
      return {
        id: jobs.skill.id,
        skill_name: jobs.skill.skill_name,
        job_id: jobs.job.id,
      };
    });
    let recommendedJobs = [];
    for (let skill of skills) {
      for (let job of jobs_skills) {
        if (job.skill_name === skill.skill_name) {
          recommendedJobs.push(job);
        }
      }
    }
    const removeDuplicates = (array: Array<any>) => {
      const noDuplicates = array.filter(
        (obj, index, self) =>
          index === self.findIndex((t) => t.job_id === obj.job_id)
      );
      return noDuplicates;
    };

    const jobs = removeDuplicates(recommendedJobs).map(async (job) => {
      const find_job = await this.prismaService.job.findUnique({
        where: {
          id: job.job_id,
        },
      });

      return find_job;
    });

    return Promise.all(jobs);
  }

  async getJob(job_id: number) {
    try {
      const job = await this.prismaService.job.findUniqueOrThrow({
        where: {
          id: job_id,
        },
        include: {
          job_bid: true,
          Skill_Job: true,
        },
      });
      const findSkills = await this.prismaService.skill.findMany({
        where: {
          Skill_Job: {
            every: {
              job_id: job.id,
            },
          },
        },
      });
      const bid_count = await this.prismaService.bid.aggregate({
        _count: {
          id: true,
        },
        where: {
          Job: {
            id: job_id,
          },
        },
      });

      return {
        ...job,
        ...findSkills,
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
