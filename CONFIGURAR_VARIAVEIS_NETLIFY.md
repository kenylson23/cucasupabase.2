# 🔧 Como Configurar Variáveis de Ambiente no Netlify

## Passo a Passo Detalhado

### 1. Acessar o Painel do Netlify
1. Acesse [netlify.com](https://netlify.com) e faça login
2. Vá para o seu site/projeto
3. Clique em **"Site settings"** (Configurações do site)

### 2. Navegar para Environment Variables
1. No menu lateral, clique em **"Environment variables"**
2. Ou acesse: `Site settings > Environment variables`

### 3. Adicionar as Variáveis Necessárias

Clique em **"Add variable"** para cada uma das seguintes:

#### Variável 1: VITE_SUPABASE_URL
```
Key: VITE_SUPABASE_URL
Value: https://SEU-PROJETO.supabase.co
Scopes: Todas (All deploy contexts)
```

#### Variável 2: VITE_SUPABASE_ANON_KEY
```
Key: VITE_SUPABASE_ANON_KEY
Value: sua-chave-anonima-do-supabase
Scopes: Todas (All deploy contexts)
```

#### Variável 3: VITE_APP_ENV
```
Key: VITE_APP_ENV
Value: netlify
Scopes: Todas (All deploy contexts)
```

## 🔍 Onde Encontrar os Valores do Supabase

### 1. URL do Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Abra seu projeto
3. Vá em **Settings > API**
4. Copie a **"Project URL"**
   - Formato: `https://abcdefgh.supabase.co`

### 2. Chave Anônima
1. Na mesma página (Settings > API)
2. Copie a **"anon/public key"**
   - É uma string longa que começa com `eyJ...`

## 📸 Interface do Netlify

A interface será assim:
```
Environment variables
┌─────────────────────────────────────────────────┐
│ Key                    │ Value                  │
├─────────────────────────────────────────────────┤
│ VITE_SUPABASE_URL      │ https://xxx.supabase.co│
│ VITE_SUPABASE_ANON_KEY │ eyJhbGciOiJIUzI1N...   │
│ VITE_APP_ENV           │ netlify                │
└─────────────────────────────────────────────────┘
```

## ⚡ Deploy Automático

Após configurar as variáveis:
1. Faça um novo commit no seu repositório
2. O Netlify fará rebuild automático
3. As variáveis estarão disponíveis no build

## 🔒 Segurança

- ✅ `VITE_SUPABASE_URL` - Público, sem problemas
- ✅ `VITE_SUPABASE_ANON_KEY` - Chave pública, segura para frontend
- ❌ **NUNCA** adicione chaves privadas/service keys

## 🛠️ Verificação

Após o deploy, verifique se as variáveis estão funcionando:
1. Abra o console do navegador no seu site
2. Digite: `console.log(import.meta.env)`
3. Deve mostrar suas variáveis VITE_*

## 📋 Checklist Final

- [ ] VITE_SUPABASE_URL configurada
- [ ] VITE_SUPABASE_ANON_KEY configurada  
- [ ] VITE_APP_ENV=netlify configurada
- [ ] Deploy realizado após configuração
- [ ] Site funcionando sem erros de conexão

Se seguir estes passos, seu site CUCA funcionará perfeitamente no Netlify!