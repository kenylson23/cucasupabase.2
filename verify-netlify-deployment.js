#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

console.log('🔍 Verificando configuração completa para Netlify...\n');

// Arquivos essenciais para deploy
const essentialFiles = [
  { path: 'netlify.toml', description: 'Configuração de build' },
  { path: 'client/public/_redirects', description: 'Roteamento SPA' },
  { path: 'client/public/robots.txt', description: 'SEO' },
  { path: 'client/public/manifest.json', description: 'PWA' },
  { path: 'client/public/sitemap.xml', description: 'Sitemap' },
  { path: 'vite.config.netlify-auth.ts', description: 'Config Vite' },
  { path: 'client/index-netlify-auth.html', description: 'HTML principal' },
  { path: 'client/src/App-netlify-auth.tsx', description: 'App React' },
  { path: 'client/src/main-netlify-auth.tsx', description: 'Entry point' },
  { path: 'client/src/lib/supabaseClient.ts', description: 'Cliente Supabase' },
  { path: 'supabase-complete-setup.sql', description: 'Schema SQL' },
  { path: '.env.example', description: 'Exemplo env vars' }
];

let allFilesPresent = true;
let warnings = [];

console.log('📋 Verificando arquivos essenciais:');
essentialFiles.forEach(file => {
  if (fs.existsSync(file.path)) {
    console.log(`✅ ${file.path} - ${file.description}`);
  } else {
    console.log(`❌ ${file.path} - FALTANDO - ${file.description}`);
    allFilesPresent = false;
  }
});

// Verificar conteúdo do netlify.toml
console.log('\n🔧 Verificando configuração netlify.toml:');
if (fs.existsSync('netlify.toml')) {
  const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
  
  if (netlifyConfig.includes('vite build --config vite.config.netlify-auth.ts')) {
    console.log('✅ Comando de build correto');
  } else {
    console.log('⚠️ Comando de build pode estar incorreto');
    warnings.push('Verificar comando de build no netlify.toml');
  }
  
  if (netlifyConfig.includes('dist/public')) {
    console.log('✅ Diretório de publicação correto');
  } else {
    console.log('⚠️ Diretório de publicação pode estar incorreto');
    warnings.push('Verificar publish directory no netlify.toml');
  }
} else {
  console.log('❌ netlify.toml não encontrado');
}

// Verificar _redirects
console.log('\n🔄 Verificando _redirects:');
if (fs.existsSync('client/public/_redirects')) {
  const redirects = fs.readFileSync('client/public/_redirects', 'utf8');
  if (redirects.includes('/*    /index.html   200')) {
    console.log('✅ Redirecionamento SPA configurado');
  } else {
    console.log('⚠️ Redirecionamento SPA pode estar incorreto');
    warnings.push('Verificar configuração de _redirects');
  }
}

// Verificar variáveis de ambiente
console.log('\n🌍 Variáveis de ambiente necessárias no Netlify:');
console.log('📝 VITE_SUPABASE_URL - URL do projeto Supabase');
console.log('📝 VITE_SUPABASE_ANON_KEY - Chave anônima do Supabase');
console.log('📝 VITE_APP_ENV=netlify - Identificador do ambiente');

// Resumo final
console.log('\n📊 RESUMO DA VERIFICAÇÃO:');
if (allFilesPresent && warnings.length === 0) {
  console.log('🎉 TODOS OS ARQUIVOS ESTÃO PRONTOS PARA DEPLOY!');
  console.log('\n🚀 Próximos passos:');
  console.log('1. Configure Supabase executando o script SQL');
  console.log('2. Adicione as variáveis de ambiente no Netlify');
  console.log('3. Conecte seu repositório ao Netlify');
  console.log('4. O deploy será feito automaticamente');
} else {
  if (!allFilesPresent) {
    console.log('❌ ARQUIVOS FALTANDO - Alguns arquivos essenciais não foram encontrados');
  }
  if (warnings.length > 0) {
    console.log('⚠️ AVISOS:');
    warnings.forEach(warning => console.log(`  - ${warning}`));
  }
}

console.log('\n📁 Build command: vite build --config vite.config.netlify-auth.ts');
console.log('📁 Publish directory: dist/public');
console.log('📁 Node version: 20');

export { allFilesPresent, warnings };