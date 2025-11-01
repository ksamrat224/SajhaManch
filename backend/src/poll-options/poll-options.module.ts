import { Module } from '@nestjs/common';
import { PollOptionsService } from './poll-options.service';
import { PollOptionsController } from './poll-options.controller';
import { PrismaClient } from 'generated/prisma';

@Module({
  controllers: [PollOptionsController],
  providers: [PollOptionsService,PrismaClient],
})
export class PollOptionsModule {}
