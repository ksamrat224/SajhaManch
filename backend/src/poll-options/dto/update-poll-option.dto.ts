import { PartialType } from '@nestjs/mapped-types';
import { CreatePollOptionDto } from './create-poll-option.dto';

export class UpdatePollOptionDto extends PartialType(CreatePollOptionDto) {}
