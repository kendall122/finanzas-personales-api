import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  url?: string;
  host?: string;
  port: number;
  username?: string;
  password?: string;
  name?: string;
  ssl: boolean;
  sync: boolean;
}

export default registerAs<DatabaseConfig>('database', () => {
  const sslRaw = process.env.DB_SSL ?? process.env.DATABASE_SSL ?? 'false';
  const ssl = String(sslRaw).toLowerCase() === 'true' || sslRaw === '1';
  const syncRaw = process.env.DB_SYNC ?? 'false';
  const sync = String(syncRaw).toLowerCase() === 'true' || syncRaw === '1';

  const url = process.env.DATABASE_URL ?? process.env.DB_URL ?? '';
  const port = parseInt(process.env.DB_PORT ?? '5432', 10);

  return {
    url,
    host: process.env.DB_HOST,
    port,
    username: process.env.DB_USER ?? process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME ?? 'postgres',
    ssl,
    sync,
  };
});
