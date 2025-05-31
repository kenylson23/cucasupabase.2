# CUCA Beer - Landing Page

Landing page profissional para a marca de cerveja angolana CUCA.

## Características

- Design responsivo com cores da marca CUCA (amarelo, vermelho, preto, branco)
- Logotipo oficial da CUCA
- Imagem de hero com latas douradas da CUCA
- Slogan "Em Angola, cerveja é CUCA"
- Seções: Hero, Produtos, História, Depoimentos, Contato
- Formulário de contato integrado

## Deployment no Netlify

### Preparação dos arquivos

1. **Arquivo `_redirects`** - Criado em `client/public/_redirects` para roteamento SPA
2. **Arquivo `netlify.toml`** - Configuração de build do Netlify
3. **Formulário de contato** - Configurado para usar Netlify Forms

### Passos para deploy

1. Faça push do código para um repositório Git (GitHub, GitLab, etc.)

2. No Netlify:
   - Conecte seu repositório
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `client/dist`
   - Deploy

3. O formulário de contato funcionará automaticamente via Netlify Forms

### Estrutura do projeto

```
├── client/
│   ├── public/
│   │   ├── _redirects          # Configuração de roteamento
│   │   └── images/
│   │       ├── cuca-hero.jpg   # Imagem de fundo do hero
│   │       └── cuca-logo.png   # Logotipo oficial
│   └── src/
│       ├── components/         # Componentes React
│       └── pages/             # Páginas da aplicação
├── netlify.toml               # Configuração do Netlify
└── README.md                 # Este arquivo
```

### Tecnologias utilizadas

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animações)
- Vite (build tool)
- Wouter (roteamento)

### Desenvolvimento local

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5000`