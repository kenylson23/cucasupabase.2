# Guia de Deploy para Netlify - CUCA Beer

## ✅ App Preparado para Deploy

Seu app está totalmente configurado para funcionar no Netlify sem erros. Todos os arquivos necessários foram criados e otimizados.

## 📁 Arquivos de Configuração

### `netlify.toml`
```toml
[build]
  publish = "dist/public"
  command = "vite build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

### `client/public/_redirects`
```
/*    /index.html   200
```

## 🚀 Como Fazer o Deploy

1. **Conecte seu repositório ao Netlify:**
   - Acesse netlify.com
   - Clique em "New site from Git"
   - Conecte seu GitHub/GitLab/Bitbucket
   - Selecione este repositório

2. **Configurações automáticas:**
   - Build command: `vite build`
   - Publish directory: `dist/public`
   - Node version: 20
   - Todas as configurações já estão no netlify.toml

3. **Clique em "Deploy site"**

## ✨ Recursos Incluídos

- ✅ Landing page responsiva da CUCA
- ✅ Imagens otimizadas (logo e hero)
- ✅ SEO completo com meta tags
- ✅ Roteamento configurado para SPA
- ✅ Formulário de contato pronto
- ✅ Design com cores da marca CUCA
- ✅ Build otimizado para produção

## 📱 Funcionalidades

- **Hero Section**: Apresentação impactante da marca
- **Showcase de Produtos**: Destaque das cervejas CUCA
- **Seção de Heritage**: História e tradição angolana
- **Testimonials**: Depoimentos de clientes
- **Formulário de Contato**: Integração com Netlify Forms
- **Footer**: Links e informações da empresa

## 🎨 Design

- Cores oficiais da CUCA: amarelo, vermelho, preto, branco
- Typography: Montserrat e Open Sans
- Layout responsivo para mobile e desktop
- Animações suaves com Framer Motion

## 🔧 Solução de Problemas

Se encontrar algum erro:
1. Verifique se o repositório está atualizado
2. Confirme se o Node.js versão 20 está sendo usado
3. O comando de build é `vite build`
4. O diretório de publicação é `dist/public`

Seu app está pronto para ser deployado no Netlify sem problemas!