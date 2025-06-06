# Configuração Manual do Sistema de Autenticação Supabase

## Status Atual
- ✅ Supabase conectado e funcionando
- ✅ Banco de dados com 46 produtos configurados
- ✅ Tabelas criadas corretamente
- ❌ Usuário administrativo precisa ser criado manualmente

## Passos para Ativar a Autenticação

### 1. Criar Usuário Admin no Painel Supabase

1. **Acesse seu painel Supabase**: https://supabase.com/dashboard
2. **Vá em Authentication → Users**
3. **Clique em "Add User"**
4. **Preencha os dados**:
   - Email: `admin@cuca.ao`
   - Password: `cuca2024admin`
   - Email Confirm: `true` (marcado)

### 2. Configurar Metadados do Usuário

Após criar o usuário, adicione os metadados:

1. **Clique no usuário criado**
2. **Na seção "User Metadata"**, adicione:
```json
{
  "role": "admin",
  "name": "Administrador CUCA"
}
```

### 3. Configurar Políticas RLS

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Políticas para contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on contact_messages" 
ON contact_messages FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow admin read on contact_messages" 
ON contact_messages FOR SELECT 
USING (auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin');

-- Políticas para fan_photos
ALTER TABLE fan_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on fan_photos" 
ON fan_photos FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public read approved fan_photos" 
ON fan_photos FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Allow admin full access on fan_photos" 
ON fan_photos FOR ALL 
USING (auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin');

-- Políticas para products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on products" 
ON products FOR SELECT 
WITH CHECK (true);

CREATE POLICY "Allow admin full access on products" 
ON products FOR ALL 
USING (auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin');
```

## Como Testar

### 1. Teste do Sistema Público
- Acesse o site: funciona sem autenticação
- Formulário de contato: deve funcionar
- Galeria de fotos: deve mostrar fotos aprovadas

### 2. Teste do Sistema Admin
- Acesse `/login-netlify`
- Use: `admin@cuca.ao` / `cuca2024admin`
- Deve acessar o painel administrativo

## URLs do Sistema

- **Site público**: `/`
- **Login admin**: `/login-netlify`
- **Painel admin**: `/admin-netlify`

## Credenciais de Teste

- **Email**: admin@cuca.ao
- **Senha**: cuca2024admin