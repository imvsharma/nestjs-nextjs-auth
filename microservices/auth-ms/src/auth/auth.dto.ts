import { IsNotEmpty } from 'class-validator';

export class AuthDTO {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}
