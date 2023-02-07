import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JobsService } from "src/jobs/jobs.service";
import { PaymentDto } from "src/payments/dto/payment.dto";
import { PaymentsService } from "src/payments/payments.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateContractDto, UpdateContractDto } from "./dto/contract.dto";
import { CreateJobDto } from "./dto/create-job.dto";
import { RateReviewDto, UpdateRateReviewDto } from "./dto/rate-review.dto";
import { UpdateJobDto } from "./dto/update-job.dto";

@Injectable()
export class ClientsService {
  constructor(
    private prismaService: PrismaService,
    private jobsService: JobsService,
    private paymentsService: PaymentsService
  ) {}

  async confirmUserExistsAndIsClient(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        user_email: username,
      },
    });

    if (!user) {
      throw new NotFoundException("user not found");
    }

    if (user.user_role !== "client") {
      throw new BadRequestException("cannot access this request");
    }

    return await this.prismaService.client.findUnique({
      where: {
        client_user_id: user.id,
      },
      include: {
        client_user: true,
      },
    });
  }

  async getClientJobs(user: any) {
    try {
      const client = await this.confirmUserExistsAndIsClient(user.username);
      const client_jobs = await this.prismaService.job.findMany({
        where: {
          Client: {
            id: client.id,
          },
        },
        include: {
          job_bid: true,
        },
      });

      return client_jobs;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createJob(createJobDto: CreateJobDto, user: any) {
    try {
      const client = await this.confirmUserExistsAndIsClient(user.username);
      const { skills, ...job_details } = createJobDto;

      const job = await this.prismaService.job.create({
        data: {
          ...job_details,
          Client: {
            connect: {
              id: client.id,
            },
          },
        },
      });

      skills.map(async (skill) => {
        return await this.addOrAttachSkillToJob(user, job.id, skill);
      });

      return job;
    } catch (error) {
      console.log(error);
      throw new Error("could not create job");
    }
  }

  async addOrAttachSkillToJob(user: any, job_id: number, skill: string) {
    try {
      const client = await this.confirmUserExistsAndIsClient(user.username);

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

        const isSkillInJob = await this.prismaService.skill_Job.findUnique({
          where: {
            skill_id_job_id: {
              skill_id: createSkill.id,
              job_id: job_id,
            },
          },
        });

        if (isSkillInJob) {
          return true;
        }

        await this.prismaService.job.update({
          where: {
            id: job_id,
          },
          data: {
            Skill_Job: {
              create: {
                skill: {
                  connect: {
                    id: createSkill.id,
                  },
                },
                assignedBy: client.client_user.user_email,
              },
            },
          },
        });

        return true;
      }

      const isSkillInJob = await this.prismaService.skill_Job.findUnique({
        where: {
          skill_id_job_id: {
            skill_id: findSkill.id,
            job_id: job_id,
          },
        },
      });

      if (isSkillInJob) {
        return true;
      }

      await this.prismaService.job.update({
        where: {
          id: job_id,
        },
        data: {
          Skill_Job: {
            create: {
              skill: {
                connect: {
                  skill_name: skill,
                },
              },
              assignedBy: client.client_user.user_email,
            },
          },
        },
      });

      return true;
    } catch (error) {
      throw new BadRequestException(`could not add skill ${error.message}`);
    }
  }

  async updateJob(id: number, updateJobDto: UpdateJobDto, user: any) {
    const client = await this.confirmUserExistsAndIsClient(user.username);

    const findJobToUpdate = await this.prismaService.job.findUnique({
      where: {
        id,
      },
      include: {
        Client: true,
      },
    });

    if (!findJobToUpdate) {
      if (findJobToUpdate.Client.id !== client.id) {
        throw new ForbiddenException("cannot update this job");
      }
      throw new NotFoundException("did not find job you are trying to update");
    }

    return await this.prismaService.job.update({
      where: {
        id,
      },
      data: {
        ...updateJobDto,
      },
    });
  }

  async deleteJob(id: number, user: any) {
    await this.confirmUserExistsAndIsClient(user.username);

    return await this.prismaService.job.delete({
      where: { id },
    });
  }

  async approveBid(user: any, bid_id: number) {
    const client = await this.confirmUserExistsAndIsClient(user.username);

    const findBid = await this.prismaService.bid.findUnique({
      where: {
        id: bid_id,
      },
    });

    if (!findBid) {
      throw new NotFoundException("could not find bid to approve");
    }

    const findJob = await this.jobsService.findJob(findBid.job_id);

    if (findJob.clientId !== client.id) {
      throw new ForbiddenException(
        "cannot approve bids for jobs you did not create"
      );
    }

    if (findBid.bid_approval_status) {
      throw new ForbiddenException("bid already approved");
    }

    const approved_bid = await this.prismaService.bid.update({
      where: {
        id: bid_id,
      },
      data: {
        bid_approval_status: true,
      },
    });

    await this.prismaService.job.update({
      where: {
        id: approved_bid.job_id,
      },
      data: {
        Job_freelancer_table: {
          create: {
            assignedBy: user.username,
            freelancer_id: approved_bid.freelancer_id,
          },
        },
      },
    });

    return approved_bid;
  }

  async getAllJobBids(user: any, job_id: number) {
    const client = await this.confirmUserExistsAndIsClient(user.username);
    const findJob = await this.prismaService.job.findUnique({
      where: {
        id: job_id,
      },
    });

    if (!findJob) {
      throw new NotFoundException("could not return bids");
    }

    if (findJob.clientId !== client.id) {
      throw new BadRequestException("could not return bids");
    }

    return await this.prismaService.job
      .findUnique({
        where: {
          id: job_id,
        },
      })
      .job_bid();
  }

  async rateAndReviewFreelancer(
    user: any,
    job_id: number,
    freelancer_id: number,
    rateReviewDto: RateReviewDto
  ) {
    const client = await this.confirmUserExistsAndIsClient(user.username);
    const { rating, review } = rateReviewDto;

    const findJob = await this.prismaService.job.findUnique({
      where: {
        id: job_id,
      },
      include: {
        Job_freelancer_table: true,
      },
    });

    const findFreelancer = await this.prismaService.freelancer.findUnique({
      where: {
        id: freelancer_id,
      },
    });

    if (!findJob || !findFreelancer) {
      throw new NotFoundException("could not find job or freelancer");
    }

    if (!findJob.job_completion_status) {
      throw new ForbiddenException(
        "cannot review or rate if job was not completed"
      );
    }

    const freelancerWasApproved = findJob.Job_freelancer_table.some((job) => {
      return job.freelancer_id === findFreelancer.id;
    });

    if (!freelancerWasApproved) {
      throw new ForbiddenException(
        "cannot review a freelancer that did not work on this job"
      );
    }

    return await this.prismaService.ratings_Reviews.create({
      data: {
        rating,
        review,
        freelancer: {
          connect: {
            id: findFreelancer.id,
          },
        },
        client: {
          connect: {
            id: client.id,
          },
        },
      },
    });
  }

  async updateRateAndReview(
    user: any,
    rateReviewId: number,
    updateRateReviewDto: UpdateRateReviewDto
  ) {
    try {
      const client = await this.confirmUserExistsAndIsClient(user.username);

      const findRateOrReview =
        await this.prismaService.ratings_Reviews.findUniqueOrThrow({
          where: {
            id: rateReviewId,
          },
        });

      if (client.id !== findRateOrReview.client_id) {
        throw new ForbiddenException("could not update review ");
      }

      return await this.prismaService.ratings_Reviews.update({
        where: {
          id: rateReviewId,
        },
        data: {
          ...updateRateReviewDto,
        },
      });
    } catch (error) {
      throw new Error(`something went wrong - ${error.message}`);
    }
  }

  async updateJobCompletionStatus(user: any, job_id: number) {
    try {
      const client = await this.confirmUserExistsAndIsClient(user.username);

      const findJob = await this.prismaService.job.findUniqueOrThrow({
        where: {
          id: job_id,
        },
      });

      if (client.id !== findJob.clientId) {
        throw new ForbiddenException(
          "could not update job as you are not the creator"
        );
      }

      return await this.prismaService.job.update({
        where: {
          id: findJob.id,
        },
        data: {
          job_completion_status: true,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createContract(
    user: any,
    contractDto: CreateContractDto,
    job_id: number
  ) {
    const client = await this.confirmUserExistsAndIsClient(user.username);

    const { details, client_signed, date_signed, end, start } = contractDto;

    const findJob = await this.prismaService.job.findUnique({
      where: {
        id: job_id,
      },
    });

    if (findJob.clientId !== client.id) {
      throw new ForbiddenException("not allowed to access this resource");
    }

    if (!findJob) {
      throw new NotFoundException("could not find job");
    }

    const contract = await this.prismaService.contract.create({
      data: {
        contract_client_signed: client_signed,
        contract_date_signed: date_signed,
        contract_details: details,
        contract_end: end,
        contract_start: start,
        contract_job: {
          connect: {
            id: job_id,
          },
        },
      },
    });

    return contract;
  }

  async updateContract(
    user: any,
    contractDto: UpdateContractDto,
    contract_id: number
  ) {
    await this.confirmUserExistsAndIsClient(user.username);

    const { details, client_signed, date_signed, end, start } = contractDto;

    const findContract = await this.prismaService.contract.findUnique({
      where: {
        id: contract_id,
      },
    });

    if (!findContract) {
      throw new NotFoundException("could not find contract");
    }

    const contract = await this.prismaService.contract.update({
      where: {
        id: contract_id,
      },
      data: {
        contract_client_signed: client_signed,
        contract_date_signed: date_signed,
        contract_details: details,
        contract_end: end,
        contract_start: start,
      },
    });

    return contract;
  }

  //TODO: payment logic once frontend is done
  async payHiresumeForFreelancer(
    user: any,
    job_id: number,
    paymentsDto: PaymentDto
  ) {
    const client = await this.confirmUserExistsAndIsClient(user.username);
    //pay hiresume for freelancer.
  }
}
