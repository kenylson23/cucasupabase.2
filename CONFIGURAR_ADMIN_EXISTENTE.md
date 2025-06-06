# 👤 Configurar Admin Existente para CUCA

## Como verificar seu admin atual

### 1. Localizar o usuário no Supabase
1. Acesse seu projeto Supabase
2. Vá para **Authentication > Users**
3. Encontre seu usuário administrador

### 2. Verificar configurações necessárias

#### Email confirmado
- Certifique-se que **Email Confirmed** está marcado
- Se não estiver, clique em **Confirm email**

#### Metadata obrigatório
Clique no usuário e vá para **Raw User Meta Data**. Deve conter:
```json
{
  "role": "admin",
  "name": "Administrador CUCA"
}
```

Se não tiver, adicione este JSON exato.

### 3. Credenciais recomendadas para o sistema
Para compatibilidade total, configure:
- **Email**: `admin@cuca.ao`
- **Password**: `cuca2024admin`

Ou mantenha suas credenciais atuais, mas anote-as para usar no sistema.

## Teste rápido no sistema

### Após configurar as variáveis Netlify:
1. Acesse `/login-netlify` no seu site
2. Use as credenciais do seu admin
3. Deve redirecionar para `/admin-netlify`
4. Painel deve mostrar mensagens e fotos

## Se algo não funcionar

### Problema: "Invalid credentials"
- Confirme email e senha corretos
- Verifique se email está confirmado no Supabase

### Problema: "Access denied" 
- Adicione `{"role": "admin"}` no metadata
- Aguarde alguns minutos para sincronizar

### Problema: "User not found"
- Execute o script SQL se ainda não fez
- Verifique as políticas RLS das tabelas

## Verificação automática
Execute este comando com suas variáveis configuradas:
```bash
node verificar-admin-existente.js
```

O script testará automaticamente seu admin existente e mostrará o que precisa ser ajustado.