import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createVoteDto: CreateVoteDto) {
    const pollOption = await this.prisma.pollOption.findUnique({
      where: { id: createVoteDto.pollOptionId },
    });
    if (!pollOption || pollOption.pollId !== createVoteDto.pollId) {
      throw new NotFoundException('Poll option not found for the given poll');
    }

    const poll = await this.prisma.poll.findUnique({
      where: { id: createVoteDto.pollId },
    });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }
    if (!poll.isActive) {
      throw new BadRequestException('Poll is not active');
    }

    const existing = await this.prisma.vote.findUnique({
      where: {
        userId_pollId: {
          userId: createVoteDto.userId,
          pollId: createVoteDto.pollId,
        },
      },
    });
    if (existing) {
      throw new BadRequestException('User has already voted in this poll');
    }

    return this.prisma.vote.create({
      data: createVoteDto,
    });
  }

  async findAll(userId: number) {
    return this.prisma.vote.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const vote = await this.prisma.vote.findUnique({
      where: { id, userId },
    });
    if (!vote) {
      throw new NotFoundException('vote not found');
    }
    return vote;
  }

  async update(id: number, updateVoteDto: UpdateVoteDto) {
    await this.findOne(id, updateVoteDto.userId as number);
    return this.prisma.vote.update({
      where: { id, userId: updateVoteDto.userId },
      data: updateVoteDto,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.prisma.vote.delete({
      where: { id, userId },
    });
  }

  async hasUserVoted(userId: number, pollId: number): Promise<boolean> {
    const vote = await this.prisma.vote.findUnique({
      where: {
        userId_pollId: {
          userId,
          pollId,
        },
      },
    });
    return !!vote;
  }

  async getPollResults(pollId: number,userId:number) {

    const hasVoted = await this.hasUserVoted(userId,pollId);
    if(!hasVoted) {
      throw new ForbiddenException('you must vote before viewing results');
    }
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: true,
      },
    });
    if (!poll) {
      throw new NotFoundException('poll not found');
    }
    const voteCounts = await this.prisma.vote.groupBy({
      by: ['pollOptionId'],
      where: { pollId },
      _count: { id: true },
    });
    const totalVotes = voteCounts.reduce((sum, v) => sum + v._count.id, 0);

    const results = poll.options.map((option) => {
      const voteCount =
        voteCounts.find((v) => v.pollOptionId === option.id)?._count.id || 0;
      const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
      return {
        optionId: option.id,
        optionName: option.name,
        voteCount,
        percentage: parseFloat(percentage.toFixed(2)),
      };
    });
    const maxVotes = Math.max(...results.map((r) => r.voteCount));
    const winners = results.filter(
      (r) => r.voteCount === maxVotes && maxVotes > 0,
    );

    return {
      pollId: poll.id,
      title: poll.title,
      description: poll.description,
      totalVotes,
      isActive: poll.isActive,
      results,
      winners: winners.map((w) => ({
        optionId: w.optionId,
        optionName: w.optionName,
        voteCount: w.voteCount,
        percentage: w.percentage,
      })),
    };
  }
}
