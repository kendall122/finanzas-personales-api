import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'saving_goals' })
export class SavingGoal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: false })
  user: User;

  @Column()
  name: string;

  @Column('decimal', {
    precision: 14,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => Number(value),
    },
  })
  targetAmount: number;

  @Column('decimal', {
    precision: 14,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => Number(value),
    },
  })
  currentAmount: number;

  @Column({ type: 'timestamptz', nullable: true })
  deadline?: Date | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
