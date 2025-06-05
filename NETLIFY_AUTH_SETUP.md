# Configuração de Autenticação para Netlify

## Resumo da Situação

O sistema de autenticação **funcionará no Netlify** com as seguintes modificações implementadas:

### ✅ O que foi criado:
- `client/src/lib/supabaseAuth.ts` - Sistema de autenticação Supabase
- `client/src/components/AuthProvider.tsx` - Contexto de autenticação
- `client/src/pages/login-netlify.tsx` - Página de login compatível
- `client/src/pages/admin-netlify.tsx` - Painel admin compatível
- `client/src/App-netlify-auth.tsx` - App principal com autenticação

### 🔧 Configuração Necessária no Supabase

#### 1. Habilitar Autenticação no Supabase
No painel do Supabase:
1. Vá em **Authentication → Settings**
2. Configure **Site URL**: `https://seu-site.netlify.app`
3. Adicione **Redirect URLs**: `https://seu-site.netlify.app/**`

#### 2. Criar Usuário Admin Inicial

**Opção A: Via Dashboard Supabase**
1. Vá em **Authentication → Users**
2. Clique em **Add User**
3. Email: `admin@cuca.ao`
4. Senha: `cuca2024admin`
5. Adicione metadados:
   ```json
   {
     "name": "Administrador CUCA",
     "role": "admin"
   }
   ```

**Opção B: Via API (se tiver Service Role Key)**
Execute o script `setup-admin.js` uma vez

#### 3. Configurar Políticas RLS (Já implementado)
- ✅ Políticas criadas para `contact_messages`
- ✅ Políticas criadas para `fan_photos`
- ✅ Acesso adequado para usuários anônimos e autenticados

### 🌐 Configuração no Netlify

#### 1. Variáveis de Ambiente
Configure no painel do Netlify:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

#### 2. Build Settings
- Build command: `vite build`
- Publish directory: `dist/public`
- Node version: `20`

### 🔐 Como Acessar o Admin

1. **Login**: Vá para `/login-netlify`
2. **Credenciais**:
   - Email: `admin@cuca.ao`
   - Senha: `cuca2024admin`
3. **Funcionalidades**:
   - Ver estatísticas gerais
   - Gerenciar mensagens de contato
   - Aprovar/rejeitar fotos de fãs

### 📱 Funcionalidades que Funcionam no Netlify

#### ✅ Funcionam Perfeitamente:
- Site público completo
- Formulário de contato (salva no Supabase)
- Galeria de fotos de fãs (carrega do Supabase)
- Login administrativo via Supabase Auth
- Painel admin para gerenciar conteúdo
- Aprovação de fotos de fãs
- Visualização de mensagens

#### ❌ Não Funcionam (requerem servidor):
- Sistema de sessões Express
- Middleware de autenticação servidor
- APIs que dependem do backend Express

### 🚀 Deploy no Netlify

1. **Conecte seu repositório** ao Netlify
2. **Configure as variáveis de ambiente** (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)
3. **Configure o build**:
   - Build command: `vite build`
   - Publish directory: `dist/public`
4. **Deploy** - o site funcionará completamente

### 🔍 Diferenças entre Local e Netlify

| Funcionalidade | Local (Express) | Netlify (Supabase) |
|---|---|---|
| Autenticação | Sessões Express | Supabase Auth |
| Banco de dados | PostgreSQL direto | Supabase (PostgreSQL) |
| Admin | `/admin` | `/admin` (mesmo painel) |
| Login | `/login` | `/login-netlify` |
| APIs | Servidor Express | Cliente Supabase direto |

### 📞 Suporte

Se precisar de ajuda:
1. Verifique se as variáveis de ambiente estão corretas
2. Confirme se o usuário admin foi criado no Supabase
3. Verifique os logs do navegador para erros de autenticação
4. Teste a conexão com Supabase no console do navegador