# Configuração Manual Final - Supabase

## Status Atual
✅ 41 produtos inseridos no banco
✅ Tabelas criadas corretamente
❌ Usuário admin precisa ser criado manualmente
❌ Políticas de acesso precisam ser ajustadas

## Ação Necessária no Painel Supabase

### 1. Criar Usuário Admin
No painel Supabase > Authentication > Users:
- Clique "Add User"
- Email: `admin@cuca.ao`
- Password: `cuca2024admin`
- Email Confirm: ✅ (marcado)
- User Metadata:
```json
{
  "name": "Administrador CUCA",
  "role": "admin"
}
```

### 2. Executar SQL para Políticas
No SQL Editor, execute:

```sql
-- Adicionar coluna active se necessário
ALTER TABLE products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Atualizar todos os produtos para ativo
UPDATE products SET active = true;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Allow public read active products" ON products;
DROP POLICY IF EXISTS "Allow admin full access products" ON products;

-- Criar políticas corretas
CREATE POLICY "Allow public read active products" ON products 
  FOR SELECT USING (active = true);

CREATE POLICY "Allow admin full access products" ON products 
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Verificar resultado
SELECT 'Produtos ativos:' as status, count(*) as total FROM products WHERE active = true;
```

### 3. Configurar Authentication Settings
Em Authentication > Settings:
- Site URL: `https://seu-site.netlify.app`
- Redirect URLs: `https://seu-site.netlify.app/**`

## Deploy no Netlify

Após configurar o Supabase:

### Build Settings
- Build command: `vite build --config vite.config.netlify-auth.ts`
- Publish directory: `dist/public`
- Node version: `20`

### Environment Variables
```
VITE_SUPABASE_URL=https://cgugnbhqstihltobzimn.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

## Funcionalidades Disponíveis

Após deploy completo:
- Site: Landing page com produtos do Supabase
- Login: `/login-netlify`
- Admin: `/admin-netlify`
- Formulário contato salva no Supabase
- Galeria de fotos conectada ao banco

Execute as configurações manuais no Supabase para finalizar.