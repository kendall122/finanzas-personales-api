import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';

type MockRepository = Partial<Record<keyof Repository<Transaction>, jest.Mock>>;

const createMockRepository = (): MockRepository => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
});

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<MockRepository>(getRepositoryToken(Transaction));
  });

  describe('createForUser', () => {
    it('crea una transacción asociada al usuario', async () => {
      const userId = 1;
      const dto: CreateTransactionDto = {
        type: 'INGRESO',
        description: 'Salario',
        amount: 1000,
        date: new Date('2024-01-01T00:00:00Z'),
        category: 'Trabajo',
      };
      const created: Transaction = { ...dto, id: 1, user: { id: userId } as any };

      repository.create?.mockReturnValue(created);
      repository.save?.mockResolvedValue(created);

      const result = await service.createForUser(userId, dto);

      expect(repository.create).toHaveBeenCalledWith({
        ...dto,
        user: { id: userId },
      });
      expect(repository.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(created);
    });
  });

  describe('findAllForUser', () => {
    it('devuelve todas las transacciones del usuario', async () => {
      const userId = 2;
      const transactions: Transaction[] = [
        {
          id: 1,
          type: 'GASTO',
          description: 'Comida',
          amount: 20,
          date: new Date('2024-01-02T00:00:00Z'),
          category: 'Alimentos',
          user: { id: userId } as any,
        },
      ];

      repository.find?.mockResolvedValue(transactions);

      const result = await service.findAllForUser(userId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        order: { date: 'DESC' },
      });
      expect(result).toEqual(transactions);
    });
  });

  describe('findOneForUser', () => {
    it('devuelve la transacción cuando pertenece al usuario', async () => {
      const userId = 3;
      const transaction: Transaction = {
        id: 5,
        type: 'INGRESO',
        description: 'Bonus',
        amount: 200,
        date: new Date('2024-01-03T00:00:00Z'),
        category: 'Trabajo',
        user: { id: userId } as any,
      };

      repository.findOne?.mockResolvedValue(transaction);

      const result = await service.findOneForUser(userId, transaction.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: transaction.id, user: { id: userId } },
      });
      expect(result).toEqual(transaction);
    });

    it('lanza NotFoundException si no existe o no pertenece al usuario', async () => {
      repository.findOne?.mockResolvedValue(null);

      await expect(service.findOneForUser(1, 99)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateForUser', () => {
    it('actualiza una transacción del usuario', async () => {
      const userId = 4;
      const existing: Transaction = {
        id: 7,
        type: 'GASTO',
        description: 'Taxi',
        amount: 30,
        date: new Date('2024-01-04T00:00:00Z'),
        category: 'Transporte',
        user: { id: userId } as any,
      };
      const dto: UpdateTransactionDto = { description: 'Uber', amount: 35 };
      const merged: Transaction = { ...existing, ...dto };

      jest.spyOn(service, 'findOneForUser').mockResolvedValue(existing);
      repository.merge?.mockReturnValue(merged);
      repository.save?.mockResolvedValue(merged);

      const result = await service.updateForUser(userId, existing.id, dto);

      expect(service.findOneForUser).toHaveBeenCalledWith(userId, existing.id);
      expect(repository.merge).toHaveBeenCalledWith(existing, dto);
      expect(repository.save).toHaveBeenCalledWith(merged);
      expect(result).toEqual(merged);
    });
  });

  describe('removeForUser', () => {
    it('elimina una transacción del usuario', async () => {
      const userId = 5;
      const transaction: Transaction = {
        id: 8,
        type: 'GASTO',
        description: 'Libro',
        amount: 15,
        date: new Date('2024-01-05T00:00:00Z'),
        category: 'Educacion',
        user: { id: userId } as any,
      };

      jest.spyOn(service, 'findOneForUser').mockResolvedValue(transaction);
      repository.remove?.mockResolvedValue(undefined);

      await service.removeForUser(userId, transaction.id);

      expect(service.findOneForUser).toHaveBeenCalledWith(userId, transaction.id);
      expect(repository.remove).toHaveBeenCalledWith(transaction);
    });
  });
});
