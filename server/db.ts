import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.SUPABASE_URL) {
  throw new Error(
    "SUPABASE_URL must be set. Did you forget to provision a Supabase database?",
  );
}

// Extract connection details from Supabase URL for direct PostgreSQL connection
const supabaseUrl = new URL(process.env.SUPABASE_URL);
const connectionString = `postgresql://postgres.${supabaseUrl.hostname.split('.')[0]}:${process.env.SUPABASE_PASSWORD || '[YOUR-PASSWORD]'}@${supabaseUrl.hostname}:5432/postgres`;

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
export const db = drizzle({ client: pool, schema });