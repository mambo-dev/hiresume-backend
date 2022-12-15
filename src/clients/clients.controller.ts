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
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.gaurd";
import { ClientsService } from "./clients.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";

@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("create-job")
  createJob(@Body() createJobDto: CreateJobDto, @Request() req) {
    return this.clientsService.createJob(createJobDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put("update-job:id")
  updateJob(
    @Body() updateJobDto: UpdateJobDto,
    @Request() req,
    @Param("id") id: string
  ) {
    return this.clientsService.updateJob(
      Number(id.split("")[1]),
      updateJobDto,
      req.user
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete("delete-job:id")
  deleteJob(@Request() req, @Param("id") id: string) {
    return this.clientsService.deleteJob(Number(id.split("")[1]), req.user);
  }
}
