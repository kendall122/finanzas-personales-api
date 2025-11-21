import { Transaction } from '../../transactions/transaction.entity';
import { SavingGoal } from '../../goals/saving-goal.entity';
import { DashboardSummary } from './dashboard-summary.model';

export class DashboardSummaryBuilder {
  private readonly summary: DashboardSummary;

  constructor() {
    this.summary = new DashboardSummary();
  }

  withIncomeAndExpense(transactions: Transaction[]): this {
    for (const tx of transactions) {
      if (tx.type === 'INGRESO') {
        this.summary.totalIncome += tx.amount;
      } else if (tx.type === 'GASTO') {
        this.summary.totalExpense += tx.amount;
      }
    }
    return this;
  }

  withTransactionsCount(transactions: Transaction[]): this {
    this.summary.totalTransactions = transactions.length;
    return this;
  }

  withGoals(goals: SavingGoal[]): this {
    this.summary.totalGoals = goals.length;
    this.summary.totalSavedInGoals = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
    return this;
  }

  build(): DashboardSummary {
    this.summary.balance = this.summary.totalIncome - this.summary.totalExpense;
    return this.summary;
  }
}
