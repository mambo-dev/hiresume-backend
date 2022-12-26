import { Injectable } from "@nestjs/common";
import { ClientsService } from "src/clients/clients.service";
import { Freelancer } from "src/freelancers/entities/freelancer.entity";
import { FreelancersService } from "src/freelancers/freelancers.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ReportsService {
  constructor(
    private prismaService: PrismaService,
    private freelancerService: FreelancersService,
    private clientsService: ClientsService
  ) {}

  async generateFreelancerReports(user: any) {
    const freelancer = await this.freelancerService.confirm_freelancer_exists(
      user
    );
    //confirm is a freelancer and he exists
    //generate two types of reports one jobs done
    //customer ratings over time
    //I have done 3 jobs with 4.5 ratings this are the reports

    //report one jobs done
    const jobs_done = await this.prismaService.job.findMany({
      where: {
        Job_freelancer_table: {
          every: {
            freelancer_id: freelancer.id,
          },
        },
      },
    });

    const ratings = await this.prismaService.ratings_Reviews.findMany({
      where: {
        freelancer: {
          id: freelancer.id,
        },
      },
    });

    //add payments reports from stripe to this side of the reports
    return {
      jobs_done: [...jobs_done],
      ratings: [...ratings],
    };
  }

  async generateClientReports(user: any) {
    //jobs offered in the program
    const client = await this.clientsService.confirmUserExistsAndIsClient(
      user.username
    );
    const jobs_created = await this.prismaService.job.findMany({
      where: {
        Client: {
          id: client.id,
        },
      },
    });

    return jobs_created;
  }
}
