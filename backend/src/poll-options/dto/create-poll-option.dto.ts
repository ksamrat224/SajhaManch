import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreatePollOptionDto {
    @IsNotEmpty()
    @IsString()
    text:string;
    
    @IsNotEmpty()
    @IsInt()
    pollId:number;
}
