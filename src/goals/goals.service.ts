import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ContributeGoalDto } from './dto/contribute-goal.dto';
import { CreateGoalDto } from './dto/create-goal.dto';
import { SavingGoal } from './saving-goal.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(SavingGoal)
    private readonly goalsRepository: Repository<SavingGoal>,
  ) {}

  createForUser(userId: number, dto: CreateGoalDto): Promise<SavingGoal> {
    const goal = this.goalsRepository.create({
      ...dto,
      user: { id: userId } as User,
    });
    return this.goalsRepository.save(goal);
  }

  findAllForUser(userId: number): Promise<SavingGoal[]> {
    return this.goalsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneForUser(userId: number, goalId: number): Promise<SavingGoal> {
    const goal = await this.goalsRepository.findOne({
      where: { id: goalId, user: { id: userId } },
    });

    if (!goal) {
      throw new NotFoundException(`Goal ${goalId} not found for user`);
    }

    return goal;
  }

  async removeForUser(userId: number, goalId: number): Promise<void> {
    const goal = await this.findOneForUser(userId, goalId);
    await this.goalsRepository.remove(goal);
  }

  async contribute(userId: number, goalId: number, amount: number): Promise<SavingGoal> {
    const goal = await this.findOneForUser(userId, goalId);
    goal.currentAmount += amount;
    return this.goalsRepository.save(goal);
  }
}
