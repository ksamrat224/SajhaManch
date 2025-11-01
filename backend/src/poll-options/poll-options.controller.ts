import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PollOptionsService } from './poll-options.service';
import { CreatePollOptionDto } from './dto/create-poll-option.dto';
import { UpdatePollOptionDto } from './dto/update-poll-option.dto';

@Controller('poll-options')
export class PollOptionsController {
  constructor(private readonly pollOptionsService: PollOptionsService) {}

  @Post()
  create(@Body() createPollOptionDto: CreatePollOptionDto) {
    return this.pollOptionsService.create(createPollOptionDto);
  }

  @Get()
  findAll() {
    return this.pollOptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollOptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollOptionDto: UpdatePollOptionDto) {
    return this.pollOptionsService.update(+id, updatePollOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollOptionsService.remove(+id);
  }
}
