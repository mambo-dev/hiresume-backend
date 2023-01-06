import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { FreelancersModule } from "./freelancers/freelancers.module";
import { ClientsModule } from "./clients/clients.module";
import { JobsModule } from "./jobs/jobs.module";
import { PaymentsModule } from "./payments/payments.module";
import { ExploresModule } from "./explores/explores.module";
import { ReportsModule } from "./reports/reports.module";
import { AdminsModule } from "./admins/admins.module";
import { EmailModule } from "./email/email.module";
import { AmazonModule } from './amazon/amazon.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    FreelancersModule,
    ClientsModule,
    JobsModule,
    PaymentsModule,
    ExploresModule,
    ReportsModule,
    AdminsModule,
    EmailModule,
    AmazonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppModule],
})
export class AppModule {}
