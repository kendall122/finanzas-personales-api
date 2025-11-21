import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'juan@example.com', description: 'Correo electronico registrado' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'p4ssw0rd', description: 'Contrasena del usuario' })
  @IsString()
  @MinLength(6)
  password: string;
}
