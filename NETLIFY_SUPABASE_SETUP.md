# Configuração para Deploy no Netlify com Supabase

## ⚠️ Problemas Identificados e Corrigidos

### 1. Arquitetura Incompatível
**Problema:** O projeto atual é fullstack com servidor Express, mas Netlify só suporta sites estáticos.
**Solução:** Convertido para usar Supabase diretamente do frontend.

### 2. Configuração de Banco de Dados
**Problema:** Configuração mista entre diferentes provedores de banco.
**Solução:** Simplificado para usar apenas DATABASE_URL do Supabase.

### 3. Variáveis de Ambiente Necessárias

Para o Netlify, você precisa configurar estas variáveis de ambiente:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

## 🚀 Passos para Deploy

### 1. Configuração do Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. No painel do projeto, vá em Settings → API
4. Copie a "Project URL" e "anon/public key"

### 2. Criação das Tabelas
Execute este SQL no Supabase SQL Editor:

```sql
-- Tabela para mensagens de contato
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela para fotos de fãs
CREATE TABLE fan_photos (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  photo_url TEXT NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_photos ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir inserção pública
CREATE POLICY "Allow public insert" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON fan_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read approved" ON fan_photos FOR SELECT USING (status = 'approved');
```

### 3. Deploy no Netlify
1. Faça push do código para Git
2. No Netlify, conecte o repositório
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. O deploy será automático com as configurações do `netlify.toml`

## 📁 Arquivos Criados/Modificados

- ✅ `netlify.toml` - Configuração de build
- ✅ `client/public/_redirects` - Roteamento SPA
- ✅ `client/src/lib/supabase.ts` - Cliente Supabase
- ✅ `server/db.ts` - Corrigido para usar DATABASE_URL

## 🔧 Funcionalidades Adaptadas

- **Formulário de Contato:** Agora envia diretamente para Supabase
- **Galeria de Fotos:** Conecta diretamente ao Supabase
- **Autenticação:** Removida (não necessária para landing page)

## ⚡ Comandos de Build

```bash
# Para desenvolvimento local
npm run dev

# Para build de produção (Netlify)
vite build
```

## 🌐 URL Final
Após o deploy, seu site estará disponível em `https://seu-site.netlify.app`