import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

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
        const parseBool = (value: string | undefined, fallback = 'false') => {
          const raw = (value ?? fallback).toLowerCase();
          return raw === 'true' || raw === '1';
        };

        const parsePort = (value: string | number | undefined, fallback = 5432) => {
          const parsed = Number(value ?? fallback);
          return Number.isNaN(parsed) ? fallback : parsed;
        };

        const dbUrl = configService.get<string>('DATABASE_URL');
        const sslEnabled = parseBool(configService.get<string>('DB_SSL'), 'true');
        const synchronize = parseBool(configService.get<string>('DB_SYNC'), 'false');

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
