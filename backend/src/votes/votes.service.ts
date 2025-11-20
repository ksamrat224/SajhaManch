import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createVoteDto: CreateVoteDto) {
    
    return this.prisma.vote.create({
      data: createVoteDto,
    });
  }

  async findAll() {
    return this.prisma.vote.findMany();
  }

  async findOne(id: number) {
    const vote = await this.prisma.vote.findUnique({
      where: { id },
    });
    if (!vote) {
      throw new NotFoundException('vote not found');
    }
    return vote;
  }

  async update(id: number, updateVoteDto: UpdateVoteDto) {
    await this.findOne(id);
    return this.prisma.vote.update({
      where: { id },
      data: updateVoteDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.vote.delete({
      where: { id },
    });
  }
}
