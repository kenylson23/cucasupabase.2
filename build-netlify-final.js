#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Iniciando build para Netlify...');

// Verificar arquivos essenciais
const requiredFiles = [
  'netlify.toml',
  'client/public/_redirects',
  'client/src/App-netlify-auth.tsx',
  'client/src/main-netlify-auth.tsx',
  'vite.config.netlify-auth.ts',
  'client/index-netlify-auth.html'
];

console.log('📋 Verificando arquivos necessários...');
let missingFiles = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANDO`);
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log('\n⚠️ Arquivos faltando:', missingFiles.join(', '));
  console.log('Execute primeiro: node setup-netlify-deploy.js');
  process.exit(1);
}

// Executar build
try {
  console.log('\n🔧 Executando build...');
  execSync('vite build --config vite.config.netlify-auth.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ Build concluído com sucesso!');
  
  // Verificar arquivos gerados
  const distPath = 'dist/public';
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log(`📦 Arquivos gerados: ${files.length}`);
    
    if (fs.existsSync(path.join(distPath, 'index.html'))) {
      console.log('✅ index.html criado');
    }
    
    if (files.some(f => f.endsWith('.js'))) {
      console.log('✅ Arquivos JavaScript criados');
    }
    
    if (files.some(f => f.endsWith('.css'))) {
      console.log('✅ Arquivos CSS criados');
    }
  }
  
  console.log('\n🎉 Pronto para deploy no Netlify!');
  console.log('📁 Diretório de publicação: dist/public');
  
} catch (error) {
  console.error('\n❌ Erro durante o build:', error.message);
  process.exit(1);
}