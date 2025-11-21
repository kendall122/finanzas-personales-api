import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { DashboardSummary } from './builder/dashboard-summary.model';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
  };
}

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Obtener resumen financiero del usuario' })
  @ApiResponse({ status: 200, description: 'Resumen generado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getSummary(@Req() req: AuthenticatedRequest): Promise<DashboardSummary> {
    const userId = req.user.userId;
    return this.dashboardService.getSummaryForUser(userId);
  }
}
