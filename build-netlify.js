#!/usr/bin/env node

import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildForNetlify() {
  try {
    console.log('🚀 Building for Netlify with Supabase Auth...');
    
    await build({
      configFile: path.resolve(__dirname, 'vite.config.netlify-auth.ts'),
      mode: 'production',
      logLevel: 'info'
    });
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Output directory: dist/public');
    console.log('🌐 Ready for Netlify deployment with authentication');
    console.log('');
    console.log('Next steps:');
    console.log('1. Execute o script SQL no Supabase');
    console.log('2. Configure as variáveis de ambiente no Netlify');
    console.log('3. Faça o deploy!');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildForNetlify();