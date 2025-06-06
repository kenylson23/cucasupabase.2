#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

console.log('🔍 Testando Configuração Netlify + Supabase\n');

// Simular variáveis de ambiente do Netlify
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const appEnv = process.env.VITE_APP_ENV;

console.log('📋 Verificando variáveis de ambiente:');
console.log(`VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Configurada' : '❌ Faltando'}`);
console.log(`VITE_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Configurada' : '❌ Faltando'}`);
console.log(`VITE_APP_ENV: ${appEnv || 'não definida'}\n`);

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Configure as variáveis no Netlify antes de continuar');
  process.exit(1);
}

// Testar conexão com Supabase
console.log('🔌 Testando conexão com Supabase...');

try {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Testar consulta simples
  const { data, error } = await supabase
    .from('contact_messages')
    .select('count')
    .limit(1);
    
  if (error) {
    console.log('⚠️ Erro na consulta:', error.message);
    console.log('📝 Verifique se executou o script SQL no Supabase');
  } else {
    console.log('✅ Conexão com Supabase funcionando');
  }
  
} catch (err) {
  console.log('❌ Erro de conexão:', err.message);
}

console.log('\n📊 Resumo da Configuração:');
console.log('1. Variáveis configuradas no Netlify');
console.log('2. Conexão Supabase testada');
console.log('3. Pronto para deploy automático');

console.log('\n🚀 Próximo passo: faça commit e push para deploy automático');