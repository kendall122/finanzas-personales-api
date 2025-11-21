import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Perez', description: 'Nombre completo del usuario' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Correo electronico unico' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'p4ssw0rd', description: 'Contrasena de al menos 6 caracteres' })
  @IsString()
  @MinLength(6)
  password: string;
}
