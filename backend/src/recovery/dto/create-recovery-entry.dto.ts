import { IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateRecoveryEntryDto {
  @IsInt() @Min(0) @Max(10) headache!: number;
  @IsInt() @Min(0) @Max(10) dizziness!: number;
  @IsInt() @Min(0) @Max(10) fatigue!: number;
  @IsInt() @Min(0) @Max(10) nausea!: number;
  @IsInt() @Min(0) @Max(10) lightSensitivity!: number;
  @IsInt() @Min(0) @Max(10) noiseSensitivity!: number;
  @IsInt() @Min(0) @Max(10) concentration!: number;
  @IsInt() @Min(0) @Max(10) memory!: number;
  @IsInt() @Min(0) @Max(10) balance!: number;
  @IsInt() @Min(0) @Max(10) sleepDifficulty!: number;
  @IsOptional() @IsString() @MaxLength(2000) note?: string;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 1 }) @Min(0) @Max(24) sleepHours?: number;
}
