# 🔄 Pipeline CI/CD

Documentação completa sobre integração contínua, testes automatizados e deploy.

## Visão Geral

```
Developer Push   →  GitHub Webhook  →  GitHub Actions
                              ↓
                    ┌─────────────────┐
                    │   CI Pipeline   │
                    ├─────────────────┤
                    │ 1. Test         │ ← npm test (Jest)
                    │ 2. Lint         │ ← ESLint
                    │ 3. Build        │ ← npm run build
                    │ 4. Deploy       │ ← GitHub Pages
                    │ 5. Report       │ ← Summary
                    └─────────────────┘
                              ↓
                    PR aprovada? ✅ ──→ Merge
                                ❌ ──→ Feedback
```

## Arquivo de Configuração

**Localização**: `.github/workflows/ci.yml`

### Estrutura

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:      # Job 1: Testes
  lint:      # Job 2: Linting
  build:     # Job 3: Build (depende de 1 e 2)
  deploy:    # Job 4: Deploy (depende de 3)
  report:    # Job 5: Relatório (depende de todos)
```

## Jobs Detalhados

### 1. Job: Test

**Objetivo**: Executar testes unitários e gerar cobertura

```yaml
test:
  name: Tests & Coverage
  runs-on: ubuntu-latest
  
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - run: npm install
    - run: npm test -- --coverage
    
    - uses: codecov/codecov-action@v3
      with:
        files: ./coverage/coverage-final.json
```

**Outputs**:
- ✅/❌ Status de testes
- 📊 Relatório de cobertura
- 📤 Upload para Codecov

**Falha se**:
- Algum teste falha
- Cobertura < 80%

### 2. Job: Lint

**Objetivo**: Validar qualidade e estilo de código

```yaml
lint:
  name: Code Quality & Linting
  runs-on: ubuntu-latest
  
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
    - run: npm install
    - run: npm run lint
    - run: npm run format:check
```

**Ferramentas**:
- 🔍 ESLint - Validação sintática e regras
- ✨ Prettier - Formatação de código

**Falha se**:
- ESLint detecta violações (set como error)
- Código não está formatado

**Note**: `continue-on-error: true` no workflow permite passar mesmo com warnings

### 3. Job: Build

**Objetivo**: Compilar/empacotar o projeto

```yaml
build:
  name: Build Project
  runs-on: ubuntu-latest
  needs: [test, lint]
  
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
    - run: npm install
    - run: npm run build
    - uses: actions/upload-artifact@v3
      with:
        name: build-output
        path: |
          index.html
          src/
```

**Executado após**: test e lint completarem com sucesso

**Outputs**:
- 📦 Artefato com arquivos da build
- Usado pelo job de deploy

### 4. Job: Deploy

**Objetivo**: Publicar no GitHub Pages

```yaml
deploy:
  name: Deploy to GitHub Pages
  runs-on: ubuntu-latest
  needs: build
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  
  permissions:
    pages: write
    id-token: write
  
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
  
  steps:
    - uses: actions/checkout@v3
    - uses: actions/download-artifact@v3
    - uses: actions/configure-pages@v3
    - uses: actions/upload-pages-artifact@v2
    - uses: actions/deploy-pages@v2
```

**Condições**:
- ✅ Build passou com sucesso
- ✅ Push (não PR)
- ✅ Branch main

**Resultado**:
- 🚀 Aplicação live em `https://GabrielSanchessz.github.io/atividade-avaliativa-qualidade-de-software-24-03`

### 5. Job: Report

**Objetivo**: Gerar resumo do workflow

```yaml
report:
  name: Generate Report
  needs: [test, lint, build]
  if: always()
  
  steps:
    - run: |
        echo "## 📋 CI/CD Pipeline Report" >> $GITHUB_STEP_SUMMARY
        echo "- **Tests**: ${{ needs.test.result }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Linting**: ${{ needs.lint.result }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Build**: ${{ needs.build.result }}" >> $GITHUB_STEP_SUMMARY
```

**Executa**: Mesmo que outros falhem (`if: always()`)

**Output**: Resumo na PR/Workflow

## Gatilhos do Workflow

### Push
```yaml
on:
  push:
    branches: [main, develop]
```

Pipeline executa em:
- `git push origin main`
- `git push origin develop`
- `git push origin feature/* -u origin feature/...`

### Pull Request
```yaml
on:
  pull_request:
    branches: [main, develop]
```

Pipeline executa ao abrir/atualizar PR para:
- `main`
- `develop`

**Não executa**:
- Em branches locais
- Até fazer push

### Manual (Opcional)
```yaml
on:
  workflow_dispatch:
```

Permite rodar manualmente via GitHub UI

## Branch Protection Rules

Configure em: Settings → Branches → Add rule

### Regras Recomendadas

1. **Require a pull request before merging**
   - ✅ Exigir PR para merge
   - ✅ Exigir revisão (1 pessoa)
   - ❌ Descartar revisões após novo push (optional)

2. **Require status checks to pass before merging**
   - ✅ Exigir que CI checks passem
   - ✅ Selecionar:
     - `test (18.x)`
     - `lint (18.x)`
     - `build (18.x)`

3. **Additional settings**
   - ✅ Require branches to be up to date
   - ✅ Require conversation resolution
   - ✅ Include administrators

### Yaml (alternativo)
```yaml
# Salvar em: .github/policies/branches.yml
- Pattern: main
  Protection:
    RequiredPullRequestReviews:
      RequiredApprovingReviewCount: 1
    RequiredStatusChecks:
      - test
      - lint
      - build
    DismissStaleReviews: false
    AllowForcePushes: false
```

## Fluxo de Desenvolvimento

### Para Desenvolvedores

```bash
# 1. Criar feature branch
git checkout -b feature/nova-funcionalidade

# 2. Fazer mudanças
# ... editar arquivos ...

# 3. Testar localmente
npm test
npm run lint

# 4. Commit
git add .
git commit -m "feat: adicionar nova funcionalidade"

# 5. Push
git push origin feature/nova-funcionalidade

# 6. Abrir PR no GitHub
# - CI pipeline inicia automaticamente
# - Aguarda todos os checks verdes
# - Aguarda aprovação de revisor

# 7. Revisor aprova PR
# (GitHub App ou pessoa)

# 8. Merge (Pull Request → main)
# - Deploy automático ativado
# - Aplicação atualiza no GitHub Pages

# 9. Deletar branch
git branch -d feature/nova-funcionalidade
git push origin --delete feature/nova-funcionalidade
```

## Monitorar Pipeline

### No GitHub

1. **Actions tab**
   - Ver todos os workflows
   - Clicar em workflow para detalhar
   - Ver logs de cada job

2. **PR page**
   - Ver status dos checks
   - Clicar "Details" para logs completos

### Localmente

```bash
# Ver história de builds
git log --oneline --graph --all

# Ver status remoto
git remote show origin
```

## Troubleshooting

### Teste Falha no CI mas Passa Localmente

```bash
# Reproduzir exato ambiente CI
npm install  # CI usa npm 9.x
npm test -- --coverage

# Diferenças comuns:
# - Node version (use nvm)
# - Dependencies cache (rm node_modules)
# - Environment variables (check .env)
```

### Lint Falha

```bash
# Ver erros
npm run lint

# Corrigir automaticamente
npm run lint:fix

# Verificar formatação
npm run format:check

# Formatar tudo
npm run format
```

### Deploy não Funciona

1. **Verificar permissions**:
   - Ir a Settings → Actions → General
   - "Workflow permissions": Read and write
   - "Allow GitHub Actions to create and approve pull requests"

2. **Verificar Pages settings**:
   - Settings → Pages
   - Source: Deploy from branch → main (ou /docs)
   - Verificar URL está correta

3. **Limpar cache GitHub**:
   ```bash
   git rm -r --cached .
   git add .
   git commit -m "Clear cache"
   git push
   ```

### Build Cache Issues

Limpar cache de dependências:

```yaml
# Adicionar ao workflow
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

## Escalamento

### Para Múltiplos Ambientes

```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
        os: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: ${{ matrix.os }}
```

### Para Múltiplos Browsers

```yaml
jobs:
  test:
    services:
      chrome:
        image: chromium:latest
      firefox:
        image: firefox:latest
```

### Para Deploy Múltiplo

```yaml
deploy:
  strategy:
    matrix:
      environment:
        - staging
        - production
```

## Manutenção

### Verificar Atualização das Actions

```bash
# GitHub Actions avisa sobre versões antigas
# Exemplo: actions/checkout@v2 → @v3

# Manter atualizado:
# - Checklist GitHub Issues
# - Dependabot Pull Requests
```

### Limpar Workflows Antigos

```bash
# GitHub mantém histórico por 90 dias
# Workflows concluídos não ocupam armazenamento
# Logs ocupam 1GB por año
```

## Segurança

### Secrets

```yaml
# Usar para tokens, chaves, senhas
- name: Deploy
  run: npm run deploy
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    API_KEY: ${{ secrets.API_KEY }}
```

### Repository Secrets

Settings → Secrets and variables → Repository secrets

```bash
# Nunca fazer commit de secrets:
echo "API_KEY=xxx" > .env      # ❌
echo ".env" >> .gitignore       # ✅
```

## Métricas e Monitoramento

### Badges para README

```markdown
![Tests](https://github.com/owner/repo/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/owner/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/owner/repo)
```

### Codecov Dashboard

- Visualizar cobertura ao longo do tempo
- Comparar entre branches
- Ver mudanças em cada commit

---

**Versão**: 1.0  
**Última atualização**: Março 2026
