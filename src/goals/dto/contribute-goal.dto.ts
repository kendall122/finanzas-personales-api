import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ContributeGoalDto {
  @ApiProperty({ example: 150, description: 'Monto a aportar a la meta' })
  @Type(() => Number)
  @IsNumber()
  amount: number;
}
