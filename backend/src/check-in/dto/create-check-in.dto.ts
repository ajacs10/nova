import { IsInt, Min, Max, IsNumber, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateCheckInDto {
  @IsInt()
  @Min(1)
  @Max(5)
  mood: number;

  @IsNumber()
  @Min(0)
  @Max(24)
  sleep: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  energy: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  workload: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
