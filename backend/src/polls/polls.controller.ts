import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Roles } from 'src/helpers/roles';
import { QueryPollDto } from './dto/query-poll.dto';
import { Public } from 'src/helpers/public';

@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}
  @Roles('ADMIN')
  @Post()
  create(@Body() createPollDto: CreatePollDto) {
    return this.pollsService.create(createPollDto);
  }
  @Roles('ADMIN', 'USER')
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: QueryPollDto) {
    return this.pollsService.findAll(query);
  }
  @Roles('ADMIN', 'USER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollsService.findOne(+id);
  }
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {
    return this.pollsService.update(+id, updatePollDto);
  }
  @Roles('ADMIN', 'USER')
  @Get('top')
  async getTop(@Query('limit') limit: number = 5) {
    return await this.pollsService.getTopPolls(limit);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollsService.remove(+id);
  }
}
