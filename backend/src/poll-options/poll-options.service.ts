import { Injectable } from '@nestjs/common';
import { CreatePollOptionDto } from './dto/create-poll-option.dto';
import { UpdatePollOptionDto } from './dto/update-poll-option.dto';

@Injectable()
export class PollOptionsService {
  create(createPollOptionDto: CreatePollOptionDto) {
    return 'This action adds a new pollOption';
  }

  findAll() {
    return `This action returns all pollOptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pollOption`;
  }

  update(id: number, updatePollOptionDto: UpdatePollOptionDto) {
    return `This action updates a #${id} pollOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} pollOption`;
  }
}
