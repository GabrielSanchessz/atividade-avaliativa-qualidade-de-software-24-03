# 🚀 Deployment Guide

Guia completo para deploy no GitHub Pages e melhorias futuras.

## Deploy Automático (GitHub Pages)

### Pré-requisitos

1. **Repositório público** (ou Pages habilitado em privado)
2. **Branch main** pronta com código
3. **GitHub Actions enabled** (padrão)

### Configuração Automática

O workflow `.github/workflows/ci.yml` já está configurado:

```yaml
deploy:
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  uses: actions/deploy-pages@v2
```

**Executa automaticamente quando**:
- ✅ Push para `main`
- ✅ CI checks passam
- ❌ Pull Request (não publica)

### Verificar Configuração nas Settings

1. Ir a: **Settings → Pages**

2. Verificar:
   - **Source**: "GitHub Actions"
   - **Branch**: (não ativo, deployment via Actions)

3. URL será: `https://GabrielSanchessz.github.io/atividade-avaliativa-qualidade-de-software-24-03`

### Monitorar Deploy

1. **Actions tab**
   - Ver workflow em progresso
   - Clicar em "deploy" job para detalhes

2. **Deployments tab**
   - Ver histórico completo
   - Revert para deployment anterior se necessário

3. **Verificar Site Live**
   - `https://GabrielSanchessz.github.io/atividade-avaliativa-qualidade-de-software-24-03`
   - Esperar até 5 minutos após push

### Troubleshooting Deploy

#### Site não aparece

```bash
# 1. Verificar workflow completou
# Ir a Actions → workflow recent

# 2. Verificar Pages settings
# Settings → Pages: Source deve ser "GitHub Actions"

# 3. Cache do navegador
# Limpar cache ou abrir em incognito

# 4. Aguardar propagação DNS
# GitHub Pages pode levar até 5 minutos
```

#### 404 Page Not Found

```bash
# Verificar arquivo correto foi deployado
# Workflow deve ter uploadado:
# - index.html
# - src/ folder

# Se usar pasta diferente:
# Editar .github/workflows/ci.yml
- uses: actions/upload-pages-artifact@v2
  with:
    path: './docs'  # mudar de path se necessário
```

#### Arquivo CSS/JS não carrega

```bash
# Problema: Paths relativos incorretos

# Verificar:
# index.html
<link rel="stylesheet" href="src/css/styles.css" />
<script src="src/js/todoManager.js"></script>

# Se usar subfolder, adicionar prefix:
# <link rel="stylesheet" href="/atividade-avaliativa-qualidade-de-software-24-03/src/css/styles.css" />
```

## Ambiente de Produção

### Build para Produção

```bash
# Não há build customizado, arquivo estático funciona direto
# Mas poderia fazer minification:

npm run build

# Seria interessante minificar:
# - index.html
# - src/css/styles.css (após processar)
# - src/js/*.js (concatenar em um)
```

### Variáveis de Ambiente

Não são necessárias, mas se necessário usar:

```bash
# .env
REACT_APP_API_URL=https://api.example.com

# Em .github/workflows/ci.yml
- name: Deploy
  env:
    CI: true
    PUBLIC_URL: https://GabrielSanchessz.github.io/atividade-avaliativa-qualidade-de-software-24-03
```

## Deploy Manual

### Se precisar fazer deploy manualmente

```bash
# 1. Build local
npm run build

# 2. Fazer push (dispara CI)
git add .
git commit -m "Update"
git push origin main

# 3. Aguardar Actions completarem
# Verificar em: github.com/.../actions
```

### Deploy via gh CLI

```bash
# Instalar gh
# https://cli.github.com

gh repo view --web  # Abre repo no navegador
gh workflow list    # Lista workflows
gh workflow run ci.yml -b main  # Rodar workflow manualmente
```

## Deploy para Outros Serviços

### Vercel (alternativa moderna)

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Output: https://projeto.vercel.app

# Configurar CI/CD:
# - Conectar repositório GitHub
# - Deploy automático em cada push
```

### Netlify

```bash
# Instalar CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir .

# Output: https://seu-projeto.netlify.app

# Configurar CI/CD:
# Settings → Build & Deploy
# Add GitHub App
```

### Firebase Hosting

```bash
# Instalar
npm i -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy --only hosting

# Configurar CI/CD:
# firebase.json e .firebaserc
# GitHub Actions workflow customizado
```

### AWS S3 + CloudFront

```bash
# GitHub Actions workflow
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --acl public-read --delete
        env:
          AWS_S3_BUCKET: my-bucket
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      
      - name: Invalidate CloudFront
        uses: aws-actions/cloudfront-invalidation-action@v1
        with:
          distribution-id: ${{ secrets.AWS_DISTRIBUTION_ID }}
```

## Performance em Produção

### Otimizar Assets

```javascript
// index.html
<!-- Minify CSS e JS em produção -->
<link rel="stylesheet" href="src/css/styles.min.css" />
<script src="src/js/app.min.js"></script>

<!-- Lazy load images -->
<img loading="lazy" src="..." />

<!-- Preload recursos críticos -->
<link rel="preload" href="src/css/styles.css" as="style" />
```

### Cache Strategy

```yaml
# .github/workflows/ci.yml
- name: Setup Pages
  uses: actions/configure-pages@v3
  with:
    static_site_generator: none
    caching: enabled  # Caching automático
```

### CDN (Content Delivery Network)

GitHub Pages usa CDN global automaticamente:
- ✅ Distribui em 100+ servidores ao redor do mundo
- ✅ Cache de 10 minutos
- ✅ Sem custos adicionais

### Monitorar Performance

```bash
# Lighthouse
# https://pagespeed.web.dev
# Inserir URL e analisar

# Resultados esperados:
# Performance: 90+
# Accessibility: 90+
# Best Practices: 90+
# SEO: 90+
```

## Rollback

### Revert de Deploy

#### Via GitHub UI

1. **Actions → workflow → deployment**
2. **"Re-run" ou "Re-run failed jobs"**
3. Ou revert para commit anterior:

```bash
# Revert commit
git revert <commit-hash>
git push origin main

# Deploy inicia automaticamente
```

#### Via CLI

```bash
# Voltar um commit
git revert HEAD
git push origin main

# Deploy automático inicia
```

#### Deployments Tab

1. **Deployments tab no repo**
2. Ver histórico completo
3. Clicar "Roll back deployment"

## Monitoramento e Alertas

### GitHub Notifications

- Configurar para receber alerts de workflow failures
- Settings → Notifications → Actions

### Uptime Monitoring

```javascript
// Serviços recomendados:
// - UptimeRobot (free)
// - Statuspage.io
// - Pingdom

// Monitorar: https://GabrielSanchessz.github.io/...
```

### Log Aggregation

```javascript
// ErrorTracking (opcional):
// - Sentry (free tier)
// - LogRocket
// - Datadog

// Adicionar a app.js:
Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  environment: "production"
});
```

## Documentação de Deploys

### Manter Changelog

**CHANGELOG.md**:
```markdown
# Changelog

## [1.0.0] - 2026-03-31
### Added
- Initial release
- To-Do CRUD functionality
- Dark mode support
- localStorage persistence

### Changed
- Improved mobile responsiveness

### Fixed
- CSS alignment issues
```

### Tag Releases

```bash
# Criar tag ao fazer release
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0

# GitHub cria Release automaticamente
# Documentar mudanças em Description
```

## Backup e Recuperação

### Backup do Código

```bash
# Git é seu backup automático
# Mas também fazer:
git clone --mirror https://github.com/GabrielSanchessz/repo.git

# Ou usar GitHub CLI:
gh repo clone GabrielSanchessz/repo --bare repo.bare

# Guardar em local seguro (USB, cloud, etc)
```

### Backup dos Dados (localStorage)

Usuários podem exportar:

```javascript
// No console:
const todos = localStorage.getItem('todolist_todos');
console.log(todos);  // Copy this
navigator.clipboard.writeText(todos);  // Copy to clipboard
```

## Roadmap de Deployment

### Curto Prazo (agora)
- ✅ GitHub Pages com Actions
- ✅ CI/CD automático
- ✅ Branch protection

### Médio Prazo (próximos meses)
- [ ] Cloud Storage (S3 ou similiar)
- [ ] CDN customizado
- [ ] Monitaramento de performance
- [ ] Análitica (Google Analytics)
- [ ] Error tracking (Sentry)

### Longo Prazo (próximo ano)
- [ ] Multi-region deployment
- [ ] Blue-green deployment
- [ ] Canary releases
- [ ] Feature flags
- [ ] API backend (Node.js)
- [ ] Database (PostgreSQL)

---

**Versão**: 1.0  
**Última atualização**: Março 2026
