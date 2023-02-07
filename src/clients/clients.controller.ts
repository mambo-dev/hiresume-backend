import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
  ParseIntPipe,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.gaurd";
import { ClientsService } from "./clients.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { RateReviewDto, UpdateRateReviewDto } from "./dto/rate-review.dto";
import { PaymentDto } from "src/payments/dto/payment.dto";
import { CreateContractDto, UpdateContractDto } from "./dto/contract.dto";

@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("create-job")
  createJob(@Body() createJobDto: CreateJobDto, @Request() req) {
    return this.clientsService.createJob(createJobDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("add-or-attach-skill/:job_id/:skill_name")
  addOrAttachSkillToJob(
    @Param("job_id", ParseIntPipe) job_id: number,
    @Param("skill_name") skill_name: string,
    @Request() req
  ) {
    return this.clientsService.addOrAttachSkillToJob(
      req.user,
      job_id,
      skill_name
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("client-jobs")
  getClientJobs(@Request() req) {
    return this.clientsService.getClientJobs(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put("update-job/:id")
  updateJob(
    @Body() updateJobDto: UpdateJobDto,
    @Request() req,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.clientsService.updateJob(id, updateJobDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("delete-job/:id")
  deleteJob(@Request() req, @Param("id", ParseIntPipe) id: number) {
    return this.clientsService.deleteJob(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("approve-bid/:bid_id")
  approveBid(
    @Request() req,

    @Param("bid_id", ParseIntPipe) bid_id: number
  ) {
    return this.clientsService.approveBid(
      req.user,

      bid_id
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("get-bids/:job_id")
  getAllJobBids(@Request() req, @Param("job_id", ParseIntPipe) job_id: number) {
    return this.clientsService.getAllJobBids(req.user, job_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("rate-and-review/:job_id/:freelancer_id")
  rateAndReviewFreelancer(
    @Request() req,
    @Param("job_id", ParseIntPipe) job_id: number,
    @Param("freelancer_id", ParseIntPipe) freelancer_id: number,
    @Body() rateReviewDto: RateReviewDto
  ) {
    return this.clientsService.rateAndReviewFreelancer(
      req.user,
      job_id,
      freelancer_id,
      rateReviewDto
    );
  }
  @UseGuards(JwtAuthGuard)
  @Put("update-rate-review/:rateReviewId")
  updateRateAndReview(
    @Request() req,
    @Param("rateReviewId", ParseIntPipe) rateReviewId: number,
    updateRateReviewDto: UpdateRateReviewDto
  ) {
    return this.clientsService.updateRateAndReview(
      req.user,
      rateReviewId,
      updateRateReviewDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post("create-contract/:job_id")
  updateJobCompletionStatus(
    @Request() req,
    @Param("job_id", ParseIntPipe) job_id: number
  ) {
    return this.clientsService.updateJobCompletionStatus(req.user, job_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("update-contract/:contract_id")
  updateContract(
    @Request() req,
    @Body() updateContractDto: UpdateContractDto,
    @Param("contract_id", ParseIntPipe) contract_id: number
  ) {
    return this.clientsService.updateContract(
      req.user,
      updateContractDto,
      contract_id
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post("update-completion-status/:job_id")
  createContract(
    @Request() req,
    @Body() createContractDto: CreateContractDto,
    @Param("job_id", ParseIntPipe) job_id: number
  ) {
    return this.clientsService.createContract(
      req.user,
      createContractDto,
      job_id
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post("pay-hiresume/:job_id")
  async payHiresumeForFreelancer(
    @Request() req,
    @Param("job_id", ParseIntPipe) job_id: number,
    @Body() paymentsDto: PaymentDto
  ) {
    return this.clientsService.payHiresumeForFreelancer(
      req.user,
      job_id,
      paymentsDto
    );
  }
}
