import { IsString, IsNotEmpty, MaxLength, IsEmail, MinLength, Matches } from 'class-validator';

export class RegisterDto
{
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message: 'Password must include uppercase, lowercase, number, and special character',
  })
  password: string;
}
