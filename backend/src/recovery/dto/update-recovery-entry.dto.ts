import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateRecoveryEntryDto {
	@IsOptional() @IsInt() @Min(0) @Max(10) headache?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) dizziness?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) fatigue?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) nausea?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) lightSensitivity?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) noiseSensitivity?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) concentration?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) memory?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) balance?: number;
	@IsOptional() @IsInt() @Min(0) @Max(10) sleepDifficulty?: number;
	@IsOptional() @IsString() @MaxLength(2000) note?: string;
	@IsOptional() @IsInt() @Min(0) @Max(24) sleepHours?: number;
}