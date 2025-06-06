# Guia Completo de Deploy - CUCA no Netlify com Supabase

## 📋 Arquivos Criados para Deploy

### ✅ Configurações de Build
- `netlify.toml` - Configuração do Netlify
- `vite.config.netlify-auth.ts` - Build config com autenticação
- `client/index-netlify-auth.html` - HTML principal
- `client/public/_redirects` - Roteamento SPA
- `build-netlify.js` - Script automatizado de build

### ✅ Base de Dados
- `supabase-complete-setup.sql` - Script completo das tabelas
- `client/src/lib/supabaseClient.ts` - Cliente configurado

## 🚀 Passos para Deploy

### 1. Configurar Banco de Dados no Supabase

1. Acesse o painel do Supabase
2. Vá em **SQL Editor**
3. Execute o script `supabase-complete-setup.sql`
4. Verifique se todas as tabelas foram criadas

### 2. Configurar Autenticação no Supabase

1. **Authentication → Settings**
   - Site URL: `https://seu-site.netlify.app`
   - Redirect URLs: `https://seu-site.netlify.app/**`

2. **Criar usuário admin inicial**:
   - Vá em **Authentication → Users**
   - Clique em **Add User**
   - Email: `admin@cuca.ao`
   - Senha: `cuca2024admin`
   - User Metadata:
     ```json
     {
       "name": "Administrador CUCA",
       "role": "admin"
     }
     ```

### 3. Configurar Netlify

1. **Conectar repositório** ao Netlify
2. **Build settings**:
   - Build command: `vite build --config vite.config.netlify-auth.ts`
   - Publish directory: `dist/public`
   - Node version: `20`

3. **Environment variables**:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

### 4. Fazer Deploy

1. Faça commit de todos os arquivos
2. Push para o repositório
3. Netlify fará o build automaticamente

## 🔐 Funcionalidades Disponíveis

### Site Público
- ✅ Landing page completa
- ✅ Formulário de contato (salva no Supabase)
- ✅ Galeria de fotos de fãs
- ✅ Seções: Hero, Heritage, Products, Testimonials, Contact

### Sistema Admin
- ✅ Login em `/login-netlify`
- ✅ Painel admin em `/admin-netlify`
- ✅ Gerenciar mensagens de contato
- ✅ Aprovar/rejeitar fotos de fãs
- ✅ Visualizar estatísticas

### Credenciais Admin
- **Email**: `admin@cuca.ao`
- **Senha**: `cuca2024admin`

## 📊 Tabelas Criadas no Supabase

1. **contact_messages** - Mensagens do formulário
2. **fan_photos** - Fotos enviadas pelos fãs
3. **products** - Produtos para showcase
4. **analytics_events** - Eventos e estatísticas

## 🛠️ Comandos Úteis

```bash
# Build local para teste
node build-netlify.js

# Verificar build
cd dist/public && python -m http.server 8000
```

## 🔧 Resolução de Problemas

### Build falha
- Verifique se as variáveis VITE_SUPABASE_* estão configuradas
- Confirme que Node.js é versão 20

### Autenticação não funciona
- Verifique URLs de redirect no Supabase
- Confirme que o usuário admin foi criado
- Teste as credenciais no painel do Supabase

### Base de dados não conecta
- Execute novamente o script SQL
- Verifique se RLS está habilitado
- Confirme que as políticas foram criadas

## ✨ Status Final

**PRONTO PARA DEPLOY** - Todos os arquivos necessários foram criados e configurados.