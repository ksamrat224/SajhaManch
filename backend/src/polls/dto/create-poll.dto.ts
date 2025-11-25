import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreatePollDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 200)
  description: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsDateString()
  @IsNotEmpty()
  endsAt: Date;
}
