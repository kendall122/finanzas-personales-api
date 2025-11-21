import { Test, TestingModule } from '@nestjs/testing';
import { GoalsService } from '../goals/goals.service';
import { SavingGoal } from '../goals/saving-goal.entity';
import { Transaction } from '../transactions/transaction.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let transactionsService: jest.Mocked<TransactionsService>;
  let goalsService: jest.Mocked<GoalsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: TransactionsService,
          useValue: {
            findAllForUser: jest.fn(),
          },
        },
        {
          provide: GoalsService,
          useValue: {
            findAllForUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    transactionsService = module.get(TransactionsService);
    goalsService = module.get(GoalsService);
  });

  it('construye el resumen usando builder con transacciones y metas', async () => {
    const userId = 1;
    const transactions: Transaction[] = [
      { id: 1, type: 'INGRESO', description: 'Salario', amount: 1000, date: new Date(), category: 'Trabajo', user: { id: userId } as any },
      { id: 2, type: 'GASTO', description: 'Renta', amount: 400, date: new Date(), category: 'Vivienda', user: { id: userId } as any },
    ];
    const goals: SavingGoal[] = [
      { id: 1, name: 'Vacaciones', targetAmount: 2000, currentAmount: 300, deadline: null, createdAt: new Date(), user: { id: userId } as any },
    ];

    transactionsService.findAllForUser.mockResolvedValue(transactions);
    goalsService.findAllForUser.mockResolvedValue(goals);

    const summary = await service.getSummaryForUser(userId);

    expect(transactionsService.findAllForUser).toHaveBeenCalledWith(userId);
    expect(goalsService.findAllForUser).toHaveBeenCalledWith(userId);
    expect(summary.totalIncome).toBe(1000);
    expect(summary.totalExpense).toBe(400);
    expect(summary.balance).toBe(600);
    expect(summary.totalTransactions).toBe(2);
    expect(summary.totalGoals).toBe(1);
    expect(summary.totalSavedInGoals).toBe(300);
  });
});
