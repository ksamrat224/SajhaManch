import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { Payload } from 'src/interfaces/payload';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  create(@Body() createVoteDto: CreateVoteDto, @Req() req: Payload) {
    createVoteDto.userId = req.payload.id;
    return this.votesService.create(createVoteDto);
  }

  @Get()
  findAll(@Req() req: Payload) {
    return this.votesService.findAll(req.payload.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Payload) {
    return this.votesService.findOne(+id, req.payload.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVoteDto: UpdateVoteDto,
    @Req() req: Payload,
  ) {
    updateVoteDto.userId = req.payload.id;
    return this.votesService.update(+id, updateVoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Payload) {
    return this.votesService.remove(+id, req.payload.id);
  }

  @Get('poll/:pollId/results')
  getPollResults(@Param('pollId', ParseIntPipe) pollId: number,@Req() req:Payload) {
    return this.votesService.getPollResults(pollId,req.payload.id);
  }

  @Get('poll/:pollId/check')
  async checkIfVoted(
    @Param('pollId', ParseIntPipe) pollId: number,
    @Req() req: Payload,
  ) {
    const hasVoted = await this.votesService.hasUserVoted(
      req.payload.id,
      pollId,
    );
    return { hasVoted };
  }
  
}
