import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryPollDto } from './dto/query-poll.dto';

@Injectable()
export class PollsService {
  constructor(private readonly prisma: PrismaService) {}

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

    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (isActive !== undefined) {
      where.isActive = isActive;
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
