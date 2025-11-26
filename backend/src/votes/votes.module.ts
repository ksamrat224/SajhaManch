import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [VotesController],
  providers: [VotesService,PrismaClient],
})
export class VotesModule {}
