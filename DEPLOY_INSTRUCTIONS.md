# Instruções para Deploy no Netlify

## Arquivos Preparados

Os seguintes arquivos foram criados para garantir um deployment bem-sucedido no Netlify:

### 1. `netlify.toml` - Configuração do Build
```toml
[build]
  publish = "client/dist"
  command = "cd client && npx vite build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

### 2. `client/public/_redirects` - Roteamento SPA
```
/*    /index.html   200
```

### 3. Formulário de Contato
O formulário foi configurado para usar Netlify Forms automaticamente quando deployado.

## Passos para Deploy

1. **Faça push do seu código para um repositório Git**
   - GitHub, GitLab, ou Bitbucket

2. **No painel do Netlify:**
   - Clique em "New site from Git"
   - Conecte seu repositório
   - As configurações de build já estão no `netlify.toml`
   - Clique em "Deploy site"

3. **Configurações automáticas:**
   - Build command: `cd client && npx vite build`
   - Publish directory: `client/dist`
   - Node version: 20

## Recursos Incluídos

- ✅ Landing page responsiva
- ✅ Imagem de hero com latas da CUCA
- ✅ Logotipo oficial da CUCA
- ✅ Cores da marca (amarelo, vermelho, preto, branco)
- ✅ Formulário de contato funcional via Netlify Forms
- ✅ Otimização para SEO
- ✅ Configuração de roteamento para SPA

## Observações

- O formulário de contato funcionará automaticamente no Netlify
- As imagens estão otimizadas para web
- O site é totalmente responsivo
- Não há dependências de backend no deployment