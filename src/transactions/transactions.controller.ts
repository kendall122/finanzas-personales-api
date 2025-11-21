import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
  };
}

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar transacciones del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Listado de transacciones devuelto' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.transactionsService.findAllForUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una transaccion' })
  @ApiResponse({ status: 200, description: 'Transaccion devuelta' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Transaccion no encontrada' })
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.userId;
    return this.transactionsService.findOneForUser(userId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva transaccion' })
  @ApiResponse({ status: 201, description: 'Transaccion creada' })
  @ApiResponse({ status: 400, description: 'Datos invalidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateTransactionDto) {
    const userId = req.user.userId;
    return this.transactionsService.createForUser(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una transaccion' })
  @ApiResponse({ status: 200, description: 'Transaccion actualizada' })
  @ApiResponse({ status: 400, description: 'Datos invalidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Transaccion no encontrada' })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionDto,
  ) {
    const userId = req.user.userId;
    return this.transactionsService.updateForUser(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una transaccion' })
  @ApiResponse({ status: 200, description: 'Transaccion eliminada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Transaccion no encontrada' })
  async remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.userId;
    await this.transactionsService.removeForUser(userId, id);
  }
}
