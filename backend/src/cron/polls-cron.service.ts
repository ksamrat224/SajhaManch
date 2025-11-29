import {  Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class PollsCronService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async closeExpiredPolls() {
    const now = new Date();
    const result = await this.prisma.poll.updateMany({
      where: {
        endsAt: { lte: now },
        isActive: true,
        NOT: { endsAt: null },
      },
      data: { isActive: false },
    });
    if (result.count > 0) {
      console.log(`Closed ${result.count} expired poll(s)`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async activateScheduledPolls() {
    const now = new Date();
    const result = await this.prisma.poll.updateMany({
      where: {
        startsAt: { lte: now },
        isActive: false,
        OR: [{ endsAt: { equals: null } }, { endsAt: { gt: now } }],
      },
      data: { isActive: true },
    });
    if (result.count > 0) {
      console.log(`Activated ${result.count} scheduled poll(s)`);
    }
  }
}
