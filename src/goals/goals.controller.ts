import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContributeGoalDto } from './dto/contribute-goal.dto';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalsService } from './goals.service';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
  };
}

@ApiTags('Goals')
@Controller('goals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar metas de ahorro del usuario' })
  @ApiResponse({ status: 200, description: 'Listado de metas devuelto' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.goalsService.findAllForUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una meta de ahorro' })
  @ApiResponse({ status: 201, description: 'Meta creada' })
  @ApiResponse({ status: 400, description: 'Datos invalidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateGoalDto) {
    const userId = req.user.userId;
    return this.goalsService.createForUser(userId, dto);
  }

  @Patch(':id/contribute')
  @ApiOperation({ summary: 'Aportar monto a una meta existente' })
  @ApiResponse({ status: 200, description: 'Meta actualizada' })
  @ApiResponse({ status: 400, description: 'Datos invalidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Meta no encontrada' })
  contribute(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ContributeGoalDto,
  ) {
    const userId = req.user.userId;
    return this.goalsService.contribute(userId, id, dto.amount);
  }
}
