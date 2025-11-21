import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: false })
  user: User;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => Number(value),
    },
  })
  amount: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  // Se fuerza varchar para evitar que TypeORM infiera tipo Object (problema con unions opcionales)
  @Column({ type: 'varchar', nullable: true })
  category?: string;
}
