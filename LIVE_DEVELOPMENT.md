# 🔄 Desenvolvimento em Tempo Real

Este documento explica como visualizar as mudanças em tempo real enquanto desenvolvem a aplicação To-Do List.

## 🚀 Como Iniciar o Servidor com Live Reload

### Opção 1: Live Server (Recomendado) ⭐

```bash
npm run live
```

Este comando:
- Inicia um servidor local na porta **8080**
- **Abre automaticamente** a aplicação no navegador
- **Recarrega a página automaticamente** quando você salva qualquer arquivo
- **Atualiza CSS** sem perder o state da aplicação (live CSS)

**Características do Live Server:**
- ✅ Detecção automática de mudanças em HTML, CSS, JavaScript
- ✅ Recarregamento instantâneo (sem F5 manual)
- ✅ Perfeito para desenvolvimento iterativo
- ✅ Suporta múltiplos navegadores simultâneos
- ✅ Sem necessidade de build ou transpilação

### Opção 2: Servidor Simples

```bash
npm run dev
```

Este comando:
- Inicia um servidor local na porta **8000**
- Você precisa **recarregar manualmente** (F5) para ver mudanças
- Ainda assim é rápido e funcional

## 📝 Fluxo de Desenvolvimento Recomendado

1. **Abra um terminal** e execute:
   ```bash
   npm run live
   ```

2. **Isso vai:**
   - Iniciar o servidor
   - Abrir a aplicação no seu navegador padrão
   - Você verá algo como: `Serving "." at http://127.0.0.1:8080`

3. **Agora você pode:**
   - Abrir seus arquivos (`src/css/styles.css`, `src/js/ui.js`, etc.)
   - Fazer mudanças
   - **Salvar** (Ctrl+S ou Cmd+S)
   - Ver as mudanças refletidas **instantaneamente** no navegador!

## 🔍 Monitorando Mudanças

### Arquivos Monitorados Automaticamente
- `index.html` - Estrutura HTML
- `src/css/styles.css` - Estilos CSS
- `src/js/*.js` - Todos os arquivos JavaScript
- Qualquer arquivo modificado é detectado em < 100ms

### Exemplo de Fluxo em Tempo Real

1. Você edita `src/css/styles.css` (ex: muda cor de um botão)
2. Salva o arquivo (Ctrl+S)
3. O live-server detecta a mudança
4. A página recarrega automaticamente
5. Você vê a mudança **sem perder dados** (graças ao localStorage)
6. Continua editando...

## 💡 Dicas e Truques

### 1. Terminal Dividido
Você pode deixar rodando em um terminal enquanto edita em outro:
```bash
# Terminal 1
npm run live

# Terminal 2
npm test:watch  # Rodar testes em modo watch
```

### 2. Abrir em Múltiplos Navegadores
O live-server permite abrir em múltiplos navegadores:
- Abra a URL em Chrome: `http://localhost:8080`
- Abra em Firefox: `http://localhost:8080`
- Mudanças são sincronizadas em ambos!

### 3. Debugar com DevTools
- Pressione **F12** ou **Cmd+Option+I** para abrir DevTools
- Inspecione elementos enquanto o live reload funciona
- Console logs aparecem em tempo real

### 4. Testes e Desenvolvimento Simultâneos
```bash
# Terminal 1 - Live server
npm run live

# Terminal 2 - Testes em watch
npm test:watch

# Terminal 3 - Lint em watch (opcional)
npm run lint
```

## 🎯 Caso de Uso: Melhorias Visuais

Exemplo com as melhorias visuais recentes:

1. Você quer testar um novo efeito de botão
2. Edita `src/css/styles.css`:
   ```css
   .btn:hover {
     transform: translateY(-3px);
     box-shadow: 0 8px 20px rgba(...);
   }
   ```
3. Salva (Ctrl+S)
4. **Instantaneamente** você vê o efeito no navegador
5. Se não gostou, edita de novo e testa novamente

## 🛠️ Troubleshooting

### Servidor não inicia?
```bash
# Verifica se a porta 8080 está em uso
lsof -i :8080

# Se estiver, mate o processo:
kill -9 <PID>

# Tente novamente:
npm run live
```

### Mudanças não aparecem?
1. Verifique se o arquivo foi realmente salvo
2. Pressione Ctrl+Shift+R (reload hard - limpa cache)
3. Verifique se não há erros no Console (F12 → Console)

### Perder dados ao recarregar?
- Não se preocupe! Os dados estão salvos em localStorage
- Ao recarregar a página, os dados são recuperados automaticamente
- Teste adicionando uma tarefa e vendo aparecer após reload

## 📊 Performance

O live-server é otimizado:
- **Reload time**: ~200-500ms
- **CSS update**: Quase instantâneo (sem reload completo quando possível)
- **Memoria**: ~50MB RAM
- **CPU**: Negligenciável

## 🔐 Segurança em Desenvolvimento

- O servidor **só funciona localmente** (`localhost:8080`)
- Não é acessível de fora da sua máquina
- Dados não são enviados para nenhum servidor
- localStorage permanece protegido

## 📚 Próximos Passos

Depois de desenvolver, você pode:

1. **Testar em produção**:
   ```bash
   npm run build
   ```

2. **Fazer deploy** para GitHub Pages (automático via CI/CD)

3. **Verificar status**:
   ```bash
   npm run lint
   npm test
   npm test:coverage
   ```

## ✅ Resumo

| Tarefa | Comando |
|--------|---------|
| Desenvolver com live reload | `npm run live` ⭐ |
| Servidor simples | `npm run dev` |
| Testes automáticos | `npm test:watch` |
| Lint código | `npm run lint` |
| Formatar código | `npm run format` |
| Cobertura de testes | `npm test:coverage` |

---

**Dica Final**: Use `npm run live` para melhor experiência de desenvolvimento! 🚀
