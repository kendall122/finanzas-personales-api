import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({ example: 'Fondo de emergencia', description: 'Nombre de la meta de ahorro' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 5000, description: 'Monto objetivo a alcanzar' })
  @Type(() => Number)
  @IsNumber()
  targetAmount: number;

  @ApiProperty({
    example: '2025-06-01T00:00:00Z',
    description: 'Fecha limite para lograr la meta',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deadline?: Date;
}
