import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.gaurd";
import { ReportsService } from "./reports.service";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Get("freelancer-reports")
  async generateFreelancerReports(@Req() req: any) {
    return this.reportsService.generateFreelancerReports(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("client-reports")
  async generateClientReports(@Req() req: any) {
    return this.reportsService.generateClientReports(req.user);
  }
}
