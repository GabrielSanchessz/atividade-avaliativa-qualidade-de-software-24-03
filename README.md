# 📋 To-Do List - Aplicação com Persistência

Uma aplicação web moderna e responsiva para gerenciamento de tarefas com persistência local, desenvolvida com HTML5, CSS3 e JavaScript vanilla. Implementa testes automatizados, integração contínua e segue as melhores práticas de desenvolvimento.

## 🎯 Características Principais

- ✅ **Criar, editar e deletar tarefas** - Interface intuitiva e responsiva
- ✅ **Persistência Local** - Dados salvos automaticamente no localStorage
- ✅ **Filtros Avançados** - Visualizar todas, apenas ativas ou concluídas
- ✅ **Estatísticas em Tempo Real** - Total, pendentes e concluídas
- ✅ **Modo Escuro** - Toggle de tema persistente
- ✅ **Design Profissional** - Ícones Font Awesome 6.5.1, animações suaves
- ✅ **Testes Automatizados** - 62 testes unitários com Jest (80%+ cobertura)
- ✅ **Pipeline CI/CD** - Integração contínua com GitHub Actions
- ✅ **Deploy Automático** - GitHub Pages
- ✅ **Acessibilidade** - WCAG 2.1 compliant
- ✅ **Responsivo** - Mobile-first design (480px, 640px breakpoints)

## 🎨 Design & Ícones

A aplicação utiliza **Font Awesome 6.5.1** para um design profissional e polido:

- 📋 **fa-tasks** - Ícone do header
- ➕ **fa-plus** - Botão de adicionar
- ✏️ **fa-edit** - Button de editar (azul)
- 🗑️ **fa-trash-alt** - Botão de deletar (vermelho)
- 🌙/☀️ **fa-moon/fa-sun** - Toggle de tema
- 📊 **fa-list, fa-hourglass-half, fa-check-circle** - Estatísticas
- 🔍 **fa-filter** - Filtro
- 📮 **fa-inbox** - Estado vazio
- 🧹/🗑️ **fa-broom/fa-trash-alt** - Ações em massa

**Melhorias Visuais:**
- Gradiente aprimorado no header
- Animações suaves (hover, slide, float)
- Shadow effects contextuais
- Transições rápidas e responsivas
- Efeitos de ripple nos botões
- Iconts coloridos com diferentes contextos

## 🏗️ Arquitetura

### Stack Tecnológico

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Ícones**: Font Awesome 6.5.1 via CDN
- **Testes**: Jest + JavaScript (62 testes)
- **CI/CD**: GitHub Actions (5 jobs)
- **Persistência**: localStorage
- **Deploy**: GitHub Pages

### Estrutura de Arquivos

```
projeto/
├── index.html                          # Página principal com ícones FA
├── src/
│   ├── css/
│   │   └── styles.css                 # Estilos profissionais (1000+ linhas)
│   └── js/
│       ├── todoManager.js             # Lógica de negócio (180+ linhas)
│       ├── storage.js                 # Persistência (150+ linhas)
│       ├── ui.js                      # Controlador UI (350+ linhas)
│       └── app.js                     # Orquestração (40 linhas)
├── tests/
│   ├── todoManager.test.js            # 30+ testes
│   └── storage.test.js                # 32+ testes
├── .github/workflows/
│   └── ci.yml                         # Pipeline CI/CD (5 jobs)
├── docs/
│   ├── ARCHITECTURE.md                # Detalhes arquitetura
│   ├── TESTING.md                     # Guia de testes
│   ├── CI_CD.md                       # Documentação pipeline
│   └── DEPLOYMENT.md                  # Guia deploy
├── package.json                       # Dependências e scripts
├── jest.config.js                     # Configuração Jest
├── .eslintrc.json                     # Configuração ESLint (strict)
├── .prettierrc.json                   # Configuração Prettier
└── README.md                          # Este arquivo
```

## 🚀 Começar Rápido

### Pré-requisitos

- Node.js 18+ (apenas para desenvolvimento/testes)
- Um navegador moderno (Chrome, Firefox, Safari, Edge)
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/atividade-avaliativa-qualidade-de-software-24-03
cd atividade-avaliativa-qualidade-de-software-24-03

# Instale as dependências
npm install

# Execute os testes
npm test

# Execute com servidor local
npm run dev
```

A aplicação será acessível em `http://localhost:8000`

## � Desenvolvimento em Tempo Real

Para ver suas mudanças refletidas **instantaneamente** enquanto programa:

```bash
# Servidor com hot reload automático
npm run live
```

Isso vai:
- ✅ Iniciar servidor na porta **8080**
- ✅ **Abrir no navegador** automaticamente
- ✅ **Recarregar** quando você salva qualquer arquivo
- ✅ **Preservar dados** (localStorage continua funcionando)

**Exemplo:**
1. Execute `npm run live`
2. Edite `src/css/styles.css` (mude uma cor, por exemplo)
3. Salve o arquivo (Ctrl+S)
4. **Veja a mudança aparecer instantaneamente no navegador!**

Para mais detalhes, veja [LIVE_DEVELOPMENT.md](./LIVE_DEVELOPMENT.md)

## �💡 Como Usar

### Adicionar Tarefa

1. Digite sua tarefa no campo de input
2. Pressione Enter ou clique no botão "Adicionar" (com ícone ➕)
3. A tarefa aparecerá na lista

### Gerenciar Tarefas

- **Marcar como Concluída**: Clique no checkbox
- **Editar**: Clique no botão 🔵 (ícone azul de edição)
- **Deletar**: Clique no botão 🔴 (ícone vermelho de lixeira)

### Filtrar

Use o select "Filtrar por:" para visualizar:
- Todas as tarefas
- Apenas tarefas pendentes
- Apenas tarefas concluídas

### Estatísticas

Visualize em tempo real:
- Total de tarefas
- Tarefas pendentes
- Tarefas concluídas

### Tema

Clique no botão de tema (🌙 ou ☀️) para alternar entre tema claro e escuro.

## 🧪 Testes

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar em modo watch
npm test:watch

# Gerar relatório de cobertura
npm test:coverage
```

### Cobertura de Testes

- **TodoManager**: 30+ testes (100% cobertura)
- **Storage**: 25+ testes (100% cobertura)
- **Cobertura Mínima**: 80% (branches, functions, lines, statements)

### Testes Implementados

#### TodoManager
- ✅ Criação de tarefas com validação
- ✅ Validação de títulos vazios/nulos
- ✅ Incremento automático de IDs
- ✅ Atualização de tarefas
- ✅ Deleção com verificação de existência
- ✅ Toggle de status de conclusão
- ✅ Filtros por status
- ✅ Cálculo de estatísticas
- ✅ Limpeza de tarefas concluídas
- ✅ Limpeza de todas as tarefas

#### Storage
- ✅ Save/Load de dados com integridade
- ✅ Tratamento de localStorage indisponível
- ✅ Validação de estrutura de dados
- ✅ Persistência de tema
- ✅ Export/Import de dados
- ✅ Conversão JSON com caracteres especiais

## 🔄 Pipeline CI/CD

### Executado em:
- Cada push para `main` ou `develop`
- Cada Pull Request

### Etapas

1. **Test** - Executa testes com Jest e gera cobertura
2. **Lint** - Valida código com ESLint
3. **Build** - Compila o projeto
4. **Deploy** - Envia para GitHub Pages (apenas main)
5. **Report** - Gera relatório resumido

### Status Checks Obrigatórios

Impedir merge para PR sem aprovação e testes verdes:
```yaml
Branch Protection Rules:
- Exigir PR review
- Exigir CI checks
- Incluir admins
```

## 📊 Métricas de Qualidade

- **Cobertura de Testes**: 80%+ de todas as linhas
- **ESLint**: Zero warnings, regras strict
- **Prettier**: Formatação consistente
- **Acessibilidade**: WCAG 2.1 AA
- **Performance**: Lighthouse 90+

## 🔐 Segurança

- Validação de entrada em todas as funções
- Sanitização de dados no localStorage
- Sem dependências externas perigosas
- CSP-friendly (Content Security Policy)
- Sem localStorage direto de user input

## 📱 Responsividade

Breakpoints:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px
- **Pequenos**: < 480px

Testado em:
- Chrome, Firefox, Safari, Edge
- iOS Safari, Chrome Mobile
- Android Chrome

## ♿ Acessibilidade

- ARIA labels e roles
- Semantic HTML
- Navegação por teclado
- Alto contraste visual
- Suporte a leitores de tela

## 📚 Documentação Adicional

- [Arquitetura Técnica](docs/ARCHITECTURE.md)
- [Guia de Testes](docs/TESTING.md)
- [Pipeline CI/CD](docs/CI_CD.md)
- [Deployment](docs/DEPLOYMENT.md)

## 🛠️ Scripts Disponíveis

```bash
npm test              # Rodar testes
npm test:watch       # Testes em modo watch
npm test:coverage    # Cobertura de testes
npm run lint         # Validar código com ESLint
npm run lint:fix     # Corrigir automaticamente
npm run format       # Formatar com Prettier
npm run format:check # Validar formatação
npm run build        # Build e compilação
npm run dev          # Servidor local (Python)
```

## 📝 Decisões Técnicas

### Por que Frontend Estático?

1. **Simplicidade**: Sem necessidade de backend
2. **Deploy Fácil**: GitHub Pages nativo
3. **Escalabilidade**: Funciona com milhões de usuários simultâneos
4. **Custo**: Gratuito
5. **Segurança**: Sem servidor para atacar

### localStorage vs Backend

- **localStorage**: Dados privados do usuário por navegador
- **Backend (não implementado)**: Síncrona entre dispositivos
- Escolhemos localStorage para manter simplicidade

### JavaScript Vanilla

- **Sem frameworks**: Código mais direto e compreensível
- **Menor bundle**: Nenhuma dependência de runtime
- **Educacional**: Melhor aprendizado de conceitos
- **Performance**: Extremamente rápido

## 🤝 Contribuindo

O repositório está configurado com:

1. **Branch Protection**: Exigir PR e CI checks
2. **Code Review Automático**: GitHub App (Qodo/Gemini)
3. **Testes Mandatórios**: PR bloqueado se testes falharem
4. **Formatação**: ESLint e Prettier pre-commit

### Fluxo de Contribuição

```bash
# 1. Crie branch feature
git checkout -b feature/minha-feature

# 2. Faça changes
# ...

# 3. Teste localmente
npm test

# 4. Commit e push
git add .
git commit -m "feat: descrição da mudança"
git push origin feature/minha-feature

# 5. Abra PR no GitHub
# - PR disparará CI checks
# - Code review automático analisará código
# - Aprove sugestões ou discuta

# 6. Merge após aprovação
```

## 📋 Checklist de Qualidade

Antes de dar merge em um PR:

- [ ] Todos os testes passam (`npm test`)
- [ ] Cobertura está em 80%+
- [ ] Sem warnings de lint (`npm run lint`)
- [ ] Código está formatado (`npm run format`)
- [ ] Documentação foi atualizada
- [ ] Nenhuma console.error na build
- [ ] CI/CD passou com sucesso
- [ ] Mínimo 1 revisor aprovou

## 🐛 Reportar Issues

Use GitHub Issues com template:

```markdown
## Descrição
[Descrição clara do problema]

## Passos para Reproduzir
1. ...
2. ...

## Comportamento Esperado
[O que deveria acontecer]

## Comportamento Atual
[O que realmente acontece]

## Screenshots
[Se aplicável]

## Ambiente
- Browser: [ex: Chrome 120]
- OS: [ex: Windows 11]
```

## 📄 Licença

MIT License - Veja LICENSE para detalhes

## 👥 Autores

- **Gabriel Sanches** - [@GabrielSanchessz](https://github.com/GabrielSanchessz)
- **Co-author** - [Seu Nome]

## 🎓 Atividade Avaliativa

Projeto desenvolvido como parte da disciplina **Atividade Avaliativa 1 — Qualidade de Software na Prática com CI/CD**

**Data limite de entrega**: 14/04/2026

### Requisitos Atendidos

- ✅ Testes Unitários (30+ testes)
- ✅ Pipeline CI/CD com GitHub Actions
- ✅ Deploy Automático (GitHub Pages)
- ✅ Revisão de Código Automática (GitHub App)
- ✅ Proteção de Branch (PR obrigatório)
- ✅ README completo
- ✅ Determinação entre frontend/backend (frontend justificado)

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a [Documentação](docs/)
2. Abra uma [Issue](https://github.com/GabrielSanchessz/atividade-avaliativa-qualidade-de-software-24-03/issues)
3. Crie uma [Discussion](https://github.com/GabrielSanchessz/atividade-avaliativa-qualidade-de-software-24-03/discussions)

---

**Última atualização**: Março 2026

