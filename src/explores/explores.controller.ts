import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.gaurd";
import { FilterJobDto } from "./dto/filter-jobs.dto";
import { ExploresService } from "./explores.service";

@Controller("explores")
export class ExploresController {
  constructor(private readonly exploresService: ExploresService) {}
  //app(public) side of explore

  @Get("job-samples")
  async sampleJobs() {
    return await this.exploresService.findSampleJobs();
  }

  @Get("freelancer-samples")
  async sampleFreelancers() {
    return this.exploresService.findSampleFreelancers();
  }

  //freelancers side of explore
  @UseGuards(JwtAuthGuard)
  @Get("freelancer-job-recommendations/:cursor")
  async recommendJobs(
    @Req() req: any,
    @Param("cursor", ParseIntPipe) cursor: number
  ) {
    return this.exploresService.recommendJobs(req.user, cursor);
  }

  @UseGuards(JwtAuthGuard)
  @Get("get-job/:job_id")
  async getJob(@Param("job_id", ParseIntPipe) job_id: number) {
    return this.exploresService.getJob(job_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("search-jobs")
  async searchJobs(@Query("query") query: string) {
    return this.exploresService.searchJobs(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get("filter-jobs")
  async filterJobs(@Body() filter: FilterJobDto) {
    return this.exploresService.filterJobs(filter);
  }

  //client side of explore
  @UseGuards(JwtAuthGuard)
  @Get("contract/:contract_job_id")
  async getContract(
    @Param("contract_job_id", ParseIntPipe) contract_job_id: number
  ) {
    console.log("this", contract_job_id);
    return this.exploresService.getContract(contract_job_id);
  }
}
