import { Injectable } from '@nestjs/common';
import { GoalsService } from '../goals/goals.service';
import { TransactionsService } from '../transactions/transactions.service';
import { DashboardSummaryBuilder } from './builder/dashboard-summary.builder';
import { DashboardSummary } from './builder/dashboard-summary.model';

@Injectable()
export class DashboardService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly goalsService: GoalsService,
  ) {}

  async getSummaryForUser(userId: number): Promise<DashboardSummary> {
    const [transactions, goals] = await Promise.all([
      this.transactionsService.findAllForUser(userId),
      this.goalsService.findAllForUser(userId),
    ]);

    return new DashboardSummaryBuilder()
      .withIncomeAndExpense(transactions)
      .withTransactionsCount(transactions)
      .withGoals(goals)
      .build();
  }
}
