# Deploy CUCA no Netlify

## Passos Rápidos

### 1. Preparar Supabase (2 minutos)
- Criar projeto em supabase.com
- Executar SQL em `supabase-complete-setup.sql`
- Copiar URL e chave anônima

### 2. Configurar Netlify (1 minuto)
- Conectar repositório
- Build: `npm run build:netlify`
- Publish: `dist/public`

### 3. Variáveis de Ambiente
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_APP_ENV=netlify
```

### 4. Deploy Automático
Site ficará online em minutos após configuração.

## Funcionalidades
- Landing page completa
- Sistema de autenticação
- Painel administrativo
- Formulário de contato
- Galeria de fotos

## URLs
- `/` - Página principal
- `/login-netlify` - Login admin
- `/admin-netlify` - Painel admin

## Credenciais Padrão
- Email: admin@cuca.ao
- Senha: cuca2024admin
