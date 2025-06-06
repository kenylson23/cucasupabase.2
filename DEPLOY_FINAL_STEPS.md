# Passos Finais para Deploy - CUCA Netlify + Supabase

## Status Atual
✅ Todos os arquivos de configuração criados
✅ Build testado e funcionando
✅ Tabelas criadas no Supabase
❌ Políticas de segurança precisam ser ajustadas
❌ Dados de exemplo precisam ser inseridos

## Ação Necessária: Execute no Supabase

1. Acesse o painel do seu projeto Supabase
2. Vá em **SQL Editor**
3. Cole e execute o script `supabase-fix-policies.sql`

Este script irá:
- Adicionar coluna 'active' se necessário
- Corrigir políticas de segurança
- Inserir produtos de exemplo
- Configurar acesso correto para o site

## Após Executar o Script

Execute novamente a verificação:
```bash
node check-supabase.js
```

Você deve ver:
- ✅ Todas as tabelas existem
- ✅ Produtos de exemplo inseridos (5 produtos)

## Configuração do Usuário Admin

No painel Supabase > Authentication > Users:
1. Clique em "Add User"
2. Email: `admin@cuca.ao`
3. Senha: `cuca2024admin`
4. User Metadata:
```json
{
  "name": "Administrador CUCA",
  "role": "admin"
}
```

## Deploy no Netlify

Com as configurações do Supabase prontas:
1. Conecte repositório ao Netlify
2. Configure variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Build automático utilizará: `vite build --config vite.config.netlify-auth.ts`

## Funcionalidades Disponíveis

Após deploy completo:
- Site público: Landing page completa
- Formulário contato: Salva no Supabase
- Admin login: `/login-netlify`
- Painel admin: `/admin-netlify`

Execute o script SQL no Supabase para prosseguir.