import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { PollsModule } from '../polls/polls.module';

@Module({
  imports: [PollsModule],
  controllers: [VotesController],
  providers: [VotesService, PrismaService],
})
export class VotesModule {}
