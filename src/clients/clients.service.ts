import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JobsService } from "src/jobs/jobs.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";

@Injectable()
export class ClientsService {
  constructor(
    private prismaService: PrismaService,
    private jobsService: JobsService
  ) {}

  private async confirmUserExistsAndIsClient(username: string) {
    try {
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
      });
    } catch (error) {
      console.log(error);

      throw new Error("could not complete the request at this time");
    }
  }

  async createJob(createJobDto: CreateJobDto, user: any) {
    const client = await this.confirmUserExistsAndIsClient(user.username);

    return this.prismaService.job.create({
      data: {
        ...createJobDto,
        Client: {
          connect: {
            id: client.id,
          },
        },
      },
    });
  }

  async updateJob(id: number, updateJobDto: UpdateJobDto, user: any) {
    const client = await this.confirmUserExistsAndIsClient(user.username);

    const findJobToUpdate = await this.prismaService.job.findUnique({
      where: {
        id,
      },
    });

    if (!findJobToUpdate) {
      if (findJobToUpdate.clientId !== client.id) {
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
        id: bid_id,
      },
      data: {
        Freelancer: {
          connect: {
            id: approved_bid.freelancer_id,
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
}
