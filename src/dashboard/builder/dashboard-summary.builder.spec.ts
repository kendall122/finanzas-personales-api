import { DashboardSummaryBuilder } from './dashboard-summary.builder';
import { DashboardSummary } from './dashboard-summary.model';
import { SavingGoal } from '../../goals/saving-goal.entity';
import { Transaction } from '../../transactions/transaction.entity';

describe('DashboardSummaryBuilder', () => {
  const makeTransaction = (overrides: Partial<Transaction>): Transaction =>
    ({
      id: overrides.id ?? 1,
      type: overrides.type ?? 'INGRESO',
      description: overrides.description ?? '',
      amount: overrides.amount ?? 0,
      date: overrides.date ?? new Date(),
      category: overrides.category,
      user: overrides.user as any,
    } as Transaction);

  const makeGoal = (overrides: Partial<SavingGoal>): SavingGoal =>
    ({
      id: overrides.id ?? 1,
      name: overrides.name ?? 'Meta',
      targetAmount: overrides.targetAmount ?? 0,
      currentAmount: overrides.currentAmount ?? 0,
      deadline: overrides.deadline,
      createdAt: overrides.createdAt ?? new Date(),
      user: overrides.user as any,
    } as SavingGoal);

  it('calcula ingresos, gastos y balance', () => {
    const transactions: Transaction[] = [
      makeTransaction({ amount: 100, type: 'INGRESO' }),
      makeTransaction({ amount: 40, type: 'GASTO' }),
      makeTransaction({ amount: 10, type: 'GASTO' }),
    ];

    const summary = new DashboardSummaryBuilder()
      .withIncomeAndExpense(transactions)
      .build();

    expect(summary.totalIncome).toBe(100);
    expect(summary.totalExpense).toBe(50);
    expect(summary.balance).toBe(50);
  });

  it('cuenta transacciones', () => {
    const transactions: Transaction[] = [
      makeTransaction({ id: 1 }),
      makeTransaction({ id: 2 }),
    ];

    const summary = new DashboardSummaryBuilder()
      .withTransactionsCount(transactions)
      .build();

    expect(summary.totalTransactions).toBe(2);
  });

  it('cuenta metas y total ahorrado', () => {
    const goals: SavingGoal[] = [
      makeGoal({ currentAmount: 150 }),
      makeGoal({ currentAmount: 50 }),
    ];

    const summary = new DashboardSummaryBuilder().withGoals(goals).build();

    expect(summary.totalGoals).toBe(2);
    expect(summary.totalSavedInGoals).toBe(200);
  });

  it('encadena métodos y produce DashboardSummary', () => {
    const transactions: Transaction[] = [
      makeTransaction({ amount: 200, type: 'INGRESO' }),
      makeTransaction({ amount: 60, type: 'GASTO' }),
    ];
    const goals: SavingGoal[] = [makeGoal({ currentAmount: 30 })];

    const summary = new DashboardSummaryBuilder()
      .withIncomeAndExpense(transactions)
      .withTransactionsCount(transactions)
      .withGoals(goals)
      .build();

    expect(summary).toBeInstanceOf(DashboardSummary);
    expect(summary.totalIncome).toBe(200);
    expect(summary.totalExpense).toBe(60);
    expect(summary.balance).toBe(140);
    expect(summary.totalTransactions).toBe(2);
    expect(summary.totalGoals).toBe(1);
    expect(summary.totalSavedInGoals).toBe(30);
  });
});
