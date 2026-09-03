import { IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateReturnToLearnDto {
  @IsInt() @Min(1) @Max(5) currentStage!: number;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 1 }) @Min(0) @Max(24) schoolHours?: number;
  @IsOptional() @IsString() @MaxLength(500) breaks?: string;
  @IsOptional() @IsInt() @Min(0) @Max(1440) screenTimeMinutes?: number;
  @IsOptional() @IsString() @MaxLength(500) cognitiveActivity?: string;
  @IsOptional() @IsString() @MaxLength(1000) accommodations?: string;
  @IsOptional() @IsString() @MaxLength(1000) symptoms?: string;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
}

export class UpdateReturnToActivityDto {
  @IsInt() @Min(1) @Max(5) currentStage!: number;
  @IsOptional() @IsString() @MaxLength(120) activityType?: string;
  @IsOptional() @IsInt() @Min(0) @Max(1440) durationMinutes?: number;
  @IsOptional() @IsString() @MaxLength(120) intensity?: string;
  @IsOptional() @IsString() @MaxLength(500) symptomsBefore?: string;
  @IsOptional() @IsString() @MaxLength(500) symptomsAfter?: string;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
}
