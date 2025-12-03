import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryPollDto } from './dto/query-poll.dto';
import { fuzzySearch } from 'src/common/utils/fuzzy-search.utils';
import { Trie } from 'src/common/utils/trie.utils';

@Injectable()
export class PollsService {
  constructor(private readonly prisma: PrismaService) {}
  private pollTrie: Trie = new Trie();

  async create(createPollDto: CreatePollDto) {
    try {
      return await this.prisma.poll.create({
        data: createPollDto,
      });
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

    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    let polls = await this.prisma.poll.findMany({
      where,
      orderBy: { [sortBy]: order },
      include: { options: true, _count: { select: { votes: true } } },
    });

    if (search) {
      const fuzzyResults = fuzzySearch(
        search,
        polls,
        (poll) => `${poll.title} ${poll.description || ''}`,
        3,
      );
      polls = fuzzyResults.map((result) => result.item);
    }

    const total = polls.length;
    const skip = (page - 1) * limit;
    const paginatedPolls = polls.slice(skip, skip + limit);

    return {
      data: paginatedPolls,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async buildSearchIndex() {
    const polls = await this.prisma.poll.findMany();
    polls.forEach((poll) => this.pollTrie.insert(poll.title, poll));
  }

  async autocomplete(prefix: string) {
    return this.pollTrie.search(prefix, 5);
  }

  async findOne(id: number) {
    const poll = await this.prisma.poll.findUnique({
      where: { id },
    });
    if (!poll) {
      throw new NotFoundException('poll not found');
    }
    return poll;
  }

  async update(id: number, updatePollDto: UpdatePollDto) {
    await this.findOne(id);
    return this.prisma.poll.update({
      where: { id },
      data: updatePollDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.poll.delete({
      where: { id },
    });
  }
}
