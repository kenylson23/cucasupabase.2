# 🎯 Guia Visual - Configurar Variáveis no Netlify

## Parte 1: Obter Dados do Supabase

### 1.1 - Acesse supabase.com
- Faça login na sua conta
- Clique no seu projeto CUCA

### 1.2 - Ir para Settings
```
Dashboard > Settings > API
```

### 1.3 - Copiar os Valores
```
📋 Project URL: https://xxxxxxxx.supabase.co
📋 anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Parte 2: Configurar no Netlify

### 2.1 - Acesse netlify.com
- Faça login
- Clique no seu site

### 2.2 - Ir para Site Settings
```
Site overview > Site settings
```

### 2.3 - Environment Variables
```
Site settings > Environment variables > Add variable
```

### 2.4 - Adicionar 3 Variáveis

#### Variável 1:
```
Name: VITE_SUPABASE_URL
Value: [Cole a Project URL do Supabase]
```

#### Variável 2:
```
Name: VITE_SUPABASE_ANON_KEY  
Value: [Cole a anon public key do Supabase]
```

#### Variável 3:
```
Name: VITE_APP_ENV
Value: netlify
```

### 2.5 - Salvar e Deploy
- Clique "Save" em cada variável
- Vá para "Deploys" e clique "Trigger deploy"

## ✅ Resultado Final

Após configurar, seu site deve:
- Carregar sem erros de conexão
- Formulário de contato funcionando
- Login administrativo operacional

## 🚨 Problemas Comuns

### Erro: "Supabase credentials not configured"
- Verifique se copiou as variáveis corretamente
- Confirme que não há espaços extras

### Erro: "Invalid API key"
- Use a chave "anon public", não a "service_role"
- Verifique se a chave está completa

### Site não atualiza
- Force um novo deploy em "Deploys > Trigger deploy"
- Aguarde alguns minutos para propagação