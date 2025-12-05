import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryPollDto } from './dto/query-poll.dto';
import { fuzzySearch } from 'src/common/utils/fuzzy-search.utils';
import { Trie } from 'src/common/utils/trie.utils';

@Injectable()
export class PollsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  private pollTrie: Trie = new Trie();
  async onModuleInit() {
    await this.initializeTrie();
  }
  private async initializeTrie() {
    const polls = await this.prisma.poll.findMany({
      select: { id: true, title: true, description: true, isActive: true },
    });
    polls.forEach((poll) => this.pollTrie.insert(poll.title, poll));
  }

  async create(createPollDto: CreatePollDto) {
    try {
      const poll = await this.prisma.poll.create({
        data: createPollDto,
      });
      this.pollTrie.insert(poll.title, poll);
      return poll;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Poll with the given title already exists',
        );
      }
      throw error;
    }
  }

  async findAll(queryDto: QueryPollDto) {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      sortBy = 'createdAt',
      order = 'desc',
    } = queryDto;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [polls, total] = await Promise.all([
      this.prisma.poll.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        include: { options: true, _count: { select: { votes: true } } },
      }),
      this.prisma.poll.count({ where }),
    ]);

    return {
      data: polls,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async autocomplete(prefix: string): Promise<any[]> {
    if (!prefix.trim()) return [];
    return this.pollTrie.search(prefix, 10);
  }

  async findOne(id: number) {
    const poll = await this.prisma.poll.findUnique({
      where: { id },
      include: { options: true, _count: { select: { votes: true } } },
    });
    if (!poll) {
      throw new NotFoundException('poll not found');
    }
    return poll;
  }

  async update(id: number, updatePollDto: UpdatePollDto) {
    const oldPoll = await this.findOne(id);
    const updatedPoll = await this.prisma.poll.update({
      where: { id },
      data: updatePollDto,
    });
    if (oldPoll.title !== updatedPoll.title) {
      this.pollTrie.remove(oldPoll.title);
      this.pollTrie.insert(updatedPoll.title, updatedPoll);
    } else {
      this.pollTrie.insert(updatedPoll.title, updatedPoll);
    }
    return updatedPoll;
  }

  async getTopPolls(limit = 5) {
    return await this.prisma.poll.findMany({
      where: { isActive: true },
      include: {
        options: true,
        _count: { select: { votes: true } },
      },
      orderBy: {
        votes: { _count: 'desc' },
      },
      take: limit,
    });
  }

  async getTrendingPolls(limit = 5) {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return this.prisma.poll.findMany({
      where: {
        isActive: true,
        votes: {
          some: { votedAt: { gte: last24h } },
        },
      },
      include: {
        _count: {
          select: {
            votes: {
              where: { votedAt: { gte: last24h } },
            },
          },
        },
        options: true,
      },
      orderBy: {
        votes: {
          _count: 'desc',
        },
      },
      take: limit,
    });
  }

  async remove(id: number) {
    const poll = await this.findOne(id);
    this.pollTrie.remove(poll.title);
    return this.prisma.poll.delete({
      where: { id },
    });
  }
}
