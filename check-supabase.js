import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Variáveis de ambiente do Supabase não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabaseSetup() {
  console.log('🔍 Verificando configuração do Supabase...');
  console.log('URL:', supabaseUrl);
  
  const tables = [
    'contact_messages',
    'fan_photos', 
    'products',
    'analytics_events'
  ];
  
  let allTablesExist = true;
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Tabela ${table}: ${error.message}`);
        allTablesExist = false;
      } else {
        console.log(`✅ Tabela ${table} existe`);
        if (table === 'products') {
          console.log(`   📦 Produtos encontrados: ${data?.length || 0}`);
        }
      }
    } catch (error) {
      console.log(`❌ Erro ao verificar ${table}:`, error.message);
      allTablesExist = false;
    }
  }
  
  if (allTablesExist) {
    console.log('\n✅ Todas as tabelas estão configuradas corretamente!');
    console.log('O script SQL foi executado com sucesso.');
  } else {
    console.log('\n❌ Algumas tabelas estão faltando.');
    console.log('Execute o script supabase-complete-setup.sql no SQL Editor do Supabase.');
  }
  
  return allTablesExist;
}

checkSupabaseSetup();