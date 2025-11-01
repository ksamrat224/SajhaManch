import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PollsModule } from './polls/polls.module';

import { VotesModule } from './votes/votes.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { PollOptionsModule } from './poll-options/poll-options.module';

@Module({
  imports: [UsersModule, PollsModule, VotesModule, FeedbacksModule, PollOptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
