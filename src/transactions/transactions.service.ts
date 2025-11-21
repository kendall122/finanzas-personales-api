import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from '../users/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  createForUser(userId: number, dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionsRepository.create({
      ...dto,
      user: { id: userId } as User,
    });

    return this.transactionsRepository.save(transaction);
  }

  findAllForUser(userId: number): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
    });
  }

  async findOneForUser(userId: number, id: number): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found for user`);
    }

    return transaction;
  }

  async updateForUser(
    userId: number,
    id: number,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findOneForUser(userId, id);
    const updatedTransaction = this.transactionsRepository.merge(transaction, dto);
    return this.transactionsRepository.save(updatedTransaction);
  }

  async removeForUser(userId: number, id: number): Promise<void> {
    const transaction = await this.findOneForUser(userId, id);
    await this.transactionsRepository.remove(transaction);
  }
}
