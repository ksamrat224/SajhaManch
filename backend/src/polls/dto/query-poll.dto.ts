import {
  IsOptional,
  IsInt,
  IsBoolean,
  IsEnum,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PollSortBy {
  CREATED_AT = 'createdAt',
  ENDS_AT = 'endsAt',
  TITLE = 'title',
}

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryPollDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(PollSortBy)
  sortBy?: PollSortBy = PollSortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(Order)
  order?: Order = Order.DESC;
}
