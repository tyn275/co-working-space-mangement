import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables before TypeORM CLI reads config
config({ path: '.env.local' });

/**
 * AppDataSource — used exclusively by TypeORM CLI (migration:generate, migration:run, ...)
 * Do NOT use this in app runtime (the app uses TypeOrmModule.forRootAsync in AppModule).
 *
 * Uses DATABASE_URL_UNPOOLED (direct connection) because migrations require
 * a long-lived connection, which is incompatible with the Neon connection pooler.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL_UNPOOLED,
  ssl: { rejectUnauthorized: false },
  // Glob pattern: find all *.entity files across all modules
  entities: [__dirname + '/modules/**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // Always false — use migrations only to change schema
});
