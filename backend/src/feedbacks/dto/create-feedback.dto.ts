import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsInt()
  @IsNotEmpty()
  pollId: number;

  @IsInt()
  @IsOptional()
  userId?: number;
}
