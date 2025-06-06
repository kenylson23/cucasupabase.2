#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function setupNetlifyDeploy() {
  console.log('🔧 Configurando arquivos para deploy no Netlify...');
  
  const checks = [
    {
      name: 'netlify.toml',
      path: 'netlify.toml',
      required: true
    },
    {
      name: 'Vite config',
      path: 'vite.config.netlify-auth.ts',
      required: true
    },
    {
      name: 'HTML principal',
      path: 'client/index-netlify-auth.html',
      required: true
    },
    {
      name: 'Redirects SPA',
      path: 'client/public/_redirects',
      required: true
    },
    {
      name: 'Script SQL',
      path: 'supabase-complete-setup.sql',
      required: true
    },
    {
      name: 'Cliente Supabase',
      path: 'client/src/lib/supabaseClient.ts',
      required: true
    },
    {
      name: 'App Netlify Auth',
      path: 'client/src/App-netlify-auth.tsx',
      required: true
    },
    {
      name: 'Main Netlify Auth',
      path: 'client/src/main-netlify-auth.tsx',
      required: true
    }
  ];

  let allFilesReady = true;

  console.log('\n📋 Verificando arquivos necessários:');
  
  checks.forEach(check => {
    const filePath = path.join(__dirname, check.path);
    const exists = fs.existsSync(filePath);
    
    if (exists) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name} - FALTANDO`);
      if (check.required) allFilesReady = false;
    }
  });

  console.log('\n🔍 Verificando variáveis de ambiente:');
  
  const envVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  envVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar} configurada`);
    } else {
      console.log(`⚠️  ${envVar} não configurada (necessária no Netlify)`);
    }
  });

  console.log('\n📦 Status dos builds:');
  
  const distExists = fs.existsSync(path.join(__dirname, 'dist/public'));
  const indexExists = fs.existsSync(path.join(__dirname, 'dist/public/index.html'));
  
  if (distExists && indexExists) {
    console.log('✅ Build de produção disponível');
  } else {
    console.log('⚠️  Build de produção não encontrado (execute: node build-netlify.js)');
  }

  console.log('\n📋 Checklist para Deploy:');
  console.log('1. Execute o script SQL no Supabase');
  console.log('2. Crie usuário admin no Supabase');
  console.log('3. Configure variáveis de ambiente no Netlify');
  console.log('4. Conecte repositório ao Netlify');
  console.log('5. Aguarde o deploy automático');

  if (allFilesReady) {
    console.log('\n🎉 Todos os arquivos estão prontos para deploy!');
    return true;
  } else {
    console.log('\n❌ Alguns arquivos estão faltando. Verifique os erros acima.');
    return false;
  }
}

setupNetlifyDeploy();