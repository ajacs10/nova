import { IsInt, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateActivityEntryDto {
  @IsString() @MaxLength(120) activity!: string;
  @IsInt() @Min(1) @Max(1440) durationMinutes!: number;
  @IsInt() @Min(0) @Max(10) headacheBefore!: number;
  @IsInt() @Min(0) @Max(10) fatigueBefore!: number;
  @IsInt() @Min(0) @Max(10) dizzinessBefore!: number;
  @IsInt() @Min(0) @Max(10) headacheAfter!: number;
  @IsInt() @Min(0) @Max(10) fatigueAfter!: number;
  @IsInt() @Min(0) @Max(10) dizzinessAfter!: number;
  @IsString() @MaxLength(2000) note!: string;
}