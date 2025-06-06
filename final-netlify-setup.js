#!/usr/bin/env node
import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔧 Configuração Final para Deploy Netlify - CUCA');

// Criar arquivo de configuração de build otimizado
const packageJsonUpdate = {
  "scripts": {
    "build:netlify": "vite build --config vite.config.netlify-auth.ts",
    "preview:netlify": "vite preview --config vite.config.netlify-auth.ts"
  }
};

// Verificar e atualizar package.json se necessário
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!packageJson.scripts['build:netlify']) {
    packageJson.scripts = { ...packageJson.scripts, ...packageJsonUpdate.scripts };
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ Scripts de build atualizados no package.json');
  }
}

// Criar arquivo de verificação pré-deploy
const preDeployCheck = `#!/usr/bin/env node
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
`;

fs.writeFileSync('pre-deploy-check.js', preDeployCheck);

// Atualizar netlify.toml com configurações otimizadas
const netlifyConfig = `[build]
  publish = "dist/public"
  command = "npm run build:netlify"

[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "10"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers de segurança
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Cache otimizado para assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[context.production.environment]
  VITE_APP_ENV = "netlify"

[context.deploy-preview.environment]
  VITE_APP_ENV = "netlify"

[context.branch-deploy.environment]
  VITE_APP_ENV = "netlify"
`;

fs.writeFileSync('netlify.toml', netlifyConfig);
console.log('✅ netlify.toml otimizado criado');

// Criar README específico para deploy
const deployReadme = `# Deploy CUCA no Netlify

## Passos Rápidos

### 1. Preparar Supabase (2 minutos)
- Criar projeto em supabase.com
- Executar SQL em \`supabase-complete-setup.sql\`
- Copiar URL e chave anônima

### 2. Configurar Netlify (1 minuto)
- Conectar repositório
- Build: \`npm run build:netlify\`
- Publish: \`dist/public\`

### 3. Variáveis de Ambiente
\`\`\`
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_APP_ENV=netlify
\`\`\`

### 4. Deploy Automático
Site ficará online em minutos após configuração.

## Funcionalidades
- Landing page completa
- Sistema de autenticação
- Painel administrativo
- Formulário de contato
- Galeria de fotos

## URLs
- \`/\` - Página principal
- \`/login-netlify\` - Login admin
- \`/admin-netlify\` - Painel admin

## Credenciais Padrão
- Email: admin@cuca.ao
- Senha: cuca2024admin
`;

fs.writeFileSync('DEPLOY_README.md', deployReadme);

console.log('✅ Configuração completa para Netlify finalizada');
console.log('\n📋 Arquivos criados/atualizados:');
console.log('- netlify.toml (otimizado)');
console.log('- pre-deploy-check.js');
console.log('- DEPLOY_README.md');
console.log('- package.json (scripts atualizados)');

console.log('\n🚀 Pronto para deploy! Execute:');
console.log('git add .');
console.log('git commit -m "Deploy setup for Netlify"');
console.log('git push');