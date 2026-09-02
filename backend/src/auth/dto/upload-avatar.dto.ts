import { IsIn, IsString, Matches, MaxLength } from 'class-validator';

export class UploadAvatarDto {
  @IsString()
  @Matches(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/)
  @MaxLength(2_900_000)
  data!: string;

  @IsIn(['image/jpeg', 'image/png', 'image/webp'])
  mimeType!: string;
}
