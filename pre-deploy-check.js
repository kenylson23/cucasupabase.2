#!/usr/bin/env node
// Verificação automática antes do deploy
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_APP_ENV'
];

console.log('🔍 Verificando variáveis de ambiente...');
let missingVars = [];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    missingVars.push(envVar);
  }
});

if (missingVars.length > 0) {
  console.log('❌ Variáveis faltando:', missingVars.join(', '));
  console.log('Configure no painel do Netlify antes do deploy');
  process.exit(1);
}

console.log('✅ Todas as variáveis configuradas');
