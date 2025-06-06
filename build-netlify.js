#!/usr/bin/env node

import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildForNetlify() {
  try {
    console.log('🚀 Building for Netlify...');
    
    await build({
      configFile: path.resolve(__dirname, 'vite.config.netlify.ts'),
      mode: 'production',
      logLevel: 'info'
    });
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Output directory: dist/public');
    console.log('🌐 Ready for Netlify deployment');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildForNetlify();