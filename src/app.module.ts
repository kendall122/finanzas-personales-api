import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { GoalsModule } from './goals/goals.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV') ?? process.env.NODE_ENV ?? 'development';
        const isDevelopment = nodeEnv === 'development';
        const parsePort = (value: string | number | undefined, fallback = 5432) => {
          const parsed = Number(value ?? fallback);
          return Number.isNaN(parsed) ? fallback : parsed;
        };

        const dbUrl = configService.get<string>('DATABASE_URL');
        const sslEnabled = (configService.get<string>('DB_SSL') ?? 'true').toLowerCase() !== 'false';
        const synchronize = isDevelopment;

        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            autoLoadEntities: true,
            synchronize,
            ssl: sslEnabled ? { rejectUnauthorized: false } : false,
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: parsePort(configService.get('DB_PORT')),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize,
          ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    UsersModule,
    AuthModule,
    TransactionsModule,
    GoalsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
