import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 'INGRESO', description: 'Tipo de transaccion: INGRESO o GASTO' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'Salario mensual', description: 'Descripcion corta de la transaccion' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1200.5, description: 'Monto de la transaccion' })
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2024-12-01T00:00:00Z', description: 'Fecha de la transaccion' })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({
    example: 'Trabajo',
    description: 'Categoria asociada a la transaccion',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  category?: string;
}
