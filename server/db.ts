import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Para desenvolvimento local, permite funcionar sem banco
let pool: Pool | null = null;
let db: any = null;

// Construir connection string correta a partir das variáveis do Supabase
let connectionString = null;

if (process.env.VITE_SUPABASE_URL && process.env.SUPABASE_DB_PASSWORD) {
  const supabaseUrl = new URL(process.env.VITE_SUPABASE_URL);
  const projectRef = supabaseUrl.hostname.split('.')[0];
  
  // Construir a string de conexão usando o pooler do Supabase (mais estável)
  const password = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD);
  connectionString = `postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;
  console.log('✓ Usando conexão construída a partir das variáveis Supabase');
  console.log(`✓ Conectando para: db.${projectRef}.supabase.co`);
} else if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('[')) {
  // Só usar DATABASE_URL se não contiver caracteres problemáticos
  connectionString = process.env.DATABASE_URL;
  console.log('✓ Usando DATABASE_URL fornecida');
} else {
  console.warn('⚠️ DATABASE_URL contém formato inválido, tentando construir a partir do Supabase');
}

if (connectionString) {
  try {
    pool = new Pool({ 
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 5000,
    });
    db = drizzle({ client: pool, schema });
    console.log('✓ Conexão com banco de dados estabelecida');
  } catch (error) {
    console.warn('Warning: Database connection failed, some features may not work:', error);
  }
} else {
  console.warn('Warning: DATABASE_URL not set, database features disabled');
  console.warn('Para conectar ao Supabase, forneça DATABASE_URL completa');
}

export { pool, db };