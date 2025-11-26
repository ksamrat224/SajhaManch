import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePollOptionDto } from './dto/create-poll-option.dto';
import { UpdatePollOptionDto } from './dto/update-poll-option.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PollOptionsService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createPollOptionDto: CreatePollOptionDto) {
    try {
      return await this.prisma.pollOption.create({
        data: createPollOptionDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new NotFoundException(
          'Poll option with the given name already exists for this poll',
        );
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.pollOption.findMany();
  }

  async findOne(id: number) {
    const pollOption = await this.prisma.pollOption.findUnique({
      where: { id },
    });
    if (!pollOption) {
      throw new NotFoundException('pollOption not found');
    }
    return pollOption;
  }

  async update(id: number, updatePollOptionDto: UpdatePollOptionDto) {
    await this.findOne(id);
    return this.prisma.pollOption.update({
      where: { id },
      data: updatePollOptionDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.pollOption.delete({
      where: { id },
    });
  }
}
