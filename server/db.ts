import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Para desenvolvimento local, permite funcionar sem banco
let pool: Pool | null = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 5000,
    });
    db = drizzle({ client: pool, schema });
  } catch (error) {
    console.warn('Warning: Database connection failed, some features may not work:', error);
  }
} else {
  console.warn('Warning: DATABASE_URL not set, database features disabled');
}

export { pool, db };