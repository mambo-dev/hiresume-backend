import { Module } from '@nestjs/common';
import { AmazonService } from './amazon.service';

@Module({
  providers: [AmazonService]
})
export class AmazonModule {}
