import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @ApiProperty({
    example: 'GASTO',
    description: 'Tipo de transaccion: INGRESO o GASTO',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    example: 'Supermercado',
    description: 'Descripcion corta de la transaccion',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 200, description: 'Monto de la transaccion', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number;

  @ApiProperty({
    example: '2024-12-15T00:00:00Z',
    description: 'Fecha de la transaccion',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @ApiProperty({
    example: 'Alimentos',
    description: 'Categoria asociada a la transaccion',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  category?: string;
}
