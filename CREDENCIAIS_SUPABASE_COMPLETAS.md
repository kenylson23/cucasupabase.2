# 🔑 Credenciais e Configuração Completa do Supabase

## ⚠️ Credenciais Necessárias

### 1. Usuário Administrador (Criação Manual)
O script SQL NÃO cria automaticamente um usuário admin. Você precisa criar manualmente:

#### No Painel do Supabase:
1. Vá para **Authentication > Users**
2. Clique em **"Add user"**
3. Configure:
   ```
   Email: admin@cuca.ao
   Password: cuca2024admin
   Email Confirm: true
   ```
4. Após criar, clique no usuário
5. Na aba **"Raw User Meta Data"**, adicione:
   ```json
   {
     "role": "admin",
     "name": "Administrador CUCA"
   }
   ```

### 2. Variáveis de Ambiente Netlify
Você precisa de 2 chaves do Supabase:

#### No Painel Supabase (Settings > API):
- **Project URL**: `https://xxxxxxxx.supabase.co`
- **anon public key**: `eyJhbGciOiJIUzI1NiIs...` (chave longa)

#### No Painel Netlify (Site settings > Environment variables):
```
VITE_SUPABASE_URL = [Project URL]
VITE_SUPABASE_ANON_KEY = [anon public key]
VITE_APP_ENV = netlify
```

## 📝 Ordem de Execução Correta

### Passo 1: Executar o Script SQL
1. No Supabase, vá para **SQL Editor**
2. Cole todo o conteúdo de `supabase-complete-setup.sql`
3. Clique **"Run"**
4. Deve aparecer: "Success. No rows returned"

### Passo 2: Criar Usuário Admin
1. Siga os passos da seção "Usuário Administrador"
2. Verifique se o metadata foi salvo corretamente

### Passo 3: Configurar Netlify
1. Adicione as 3 variáveis de ambiente
2. Faça um novo deploy

## 🔍 Verificação de Funcionamento

### Testar Autenticação:
1. Acesse `/login-netlify` no seu site
2. Use: `admin@cuca.ao` / `cuca2024admin`
3. Deve redirecionar para `/admin-netlify`

### Testar Formulário:
1. Preencha o formulário de contato na home
2. No admin, deve aparecer a mensagem

## 🚨 Problemas Comuns

### "Auth error: Invalid credentials"
- Verifique se criou o usuário no Supabase
- Confirme o metadata `{"role": "admin"}`

### "Table 'contact_messages' doesn't exist"
- Execute novamente o script SQL completo
- Verifique se não houve erro na execução

### "Environment variables not found"
- Confirme as 3 variáveis no Netlify
- Force um novo deploy após adicionar

## ✅ Checklist Final

- [ ] Script SQL executado sem erros
- [ ] Usuário admin criado no Supabase
- [ ] Metadata `{"role": "admin"}` adicionado
- [ ] 3 variáveis configuradas no Netlify
- [ ] Deploy realizado após configuração
- [ ] Login admin funcionando
- [ ] Formulário salvando no banco

Seguindo esta ordem, seu site funcionará perfeitamente no Netlify.