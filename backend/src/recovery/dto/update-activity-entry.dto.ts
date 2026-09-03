import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateActivityEntryDto {
	@IsOptional() @IsString() @MaxLength(120) activity?: string;
	@IsOptional() @IsInt() @Min(1) @Max(1440) durationMinutes?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) headacheBefore?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) fatigueBefore?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) dizzinessBefore?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) headacheAfter?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) fatigueAfter?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) dizzinessAfter?: number;
	@IsOptional() @IsString() @MaxLength(2000) note?: string;
}