# 🧪 Guia de Testes

Documentação completa sobre estratégia, execução e manutenção dos testes.

## Visão Geral

- **Framework**: Jest 29.7.0
- **Testes Escritos**: 55+ casos de teste
- **Cobertura Alvo**: 80%+ (branches, functions, lines, statements)
- **Ambiente**: jsdom (navegador simulado)

## Estrutura de Testes

```
tests/
├── todoManager.test.js    # 30+ testes
└── storage.test.js        # 25+ testes

Cobertura:
- todoManager.js: 100%
- storage.js: 100%
- ui.js: Parcial (requer testes integrados)
- app.js: Implícito (orquestração)
```

## Executar Testes

### Comando Básico
```bash
npm test
```

### Modo Watch (desenvolvimento)
```bash
npm test:watch

# Testes reexecutam a cada mudança de arquivo
# Ótimo para desenvolvimento iterativo
```

### Relatório de Cobertura
```bash
npm test:coverage

# Gera relatório em coverage/
# Abrir coverage/lcov-report/index.html
```

### Teste Específico
```bash
# Um arquivo
npm test -- todoManager.test.js

# Uma suite
npm test -- -t "createTodo"

# Um teste exato
npm test -- -t "should create todo with valid title"
```

## Estratégia de Testes

### Nível: Testes Unitários

**O que**: Testa uma função/método isolado  
**Por quê**: Validar comportamento esperado  
**Cobertura**: Casos normais + edge cases  

### Exemplo: TodoManager.createTodo()

```javascript
// Caso normal
test('deve criar uma tarefa com título válido', () => {
  const todo = manager.createTodo('Comprar leite');
  expect(todo.title).toBe('Comprar leite');
  expect(todo.completed).toBe(false);
  expect(todo.id).toBeDefined();
});

// Edge case: whitespace
test('deve trim do título', () => {
  const todo = manager.createTodo('  Espaços  ');
  expect(todo.title).toBe('Espaços');
});

// Erro: título vazio
test('deve lançar erro com título vazio', () => {
  expect(() => manager.createTodo('')).toThrow('Title cannot be empty');
});

// Erro: tipo inválido
test('deve lançar erro se título não for string', () => {
  expect(() => manager.createTodo(null)).toThrow('Title must be a string');
});
```

### Nível: Testes de Integração

**Não implementado**, mas seria:
- Testar fluxo completo (form submit → DOM update)
- Usar @testing-library/dom em vez de jsdom puro
- Exemplo:
  ```javascript
  test('submeter form cria e renderiza tarefa', () => {
    const input = document.querySelector('input');
    const form = document.querySelector('form');
    
    input.value = 'Nova tarefa';
    form.dispatchEvent(new Event('submit'));
    
    expect(document.querySelector('.todo-item')).toBeTruthy();
  });
  ```

## Testes de TodoManager

### Suite: constructor
- ✅ Inicializa com array vazio
- ✅ Inicializa com tarefas iniciais
- ✅ Ignora input inválido

### Suite: createTodo
- ✅ Cria tarefa com título válido
- ✅ Faz trim de espaços
- ✅ Lança erro com título vazio
- ✅ Lança erro se não for string
- ✅ Incrementa ID a cada criação
- ✅ Adiciona à lista

### Suite: deleteTodo
- ✅ Deleta tarefa existente
- ✅ Lança erro para tarefa inexistente
- ✅ Retorna tarefa deletada

### Suite: updateTodo
- ✅ Atualiza título da tarefa
- ✅ Faz trim do novo título
- ✅ Lança erro para tarefa inexistente
- ✅ Lança erro com título vazio

### Suite: toggleComplete
- ✅ Marca incompleta como completa
- ✅ Marca completa como incompleta
- ✅ Lança erro para tarefa inexistente

### Suite: getTodosByFilter
- ✅ Retorna apenas tarefas ativas
- ✅ Retorna apenas tarefas concluídas
- ✅ Retorna todas com filtro 'all'
- ✅ Retorna todas por padrão

### Suite: getStats
- ✅ Retorna estatísticas corretas
- ✅ Retorna zeros para lista vazia

### Suite: clearCompleted
- ✅ Remove apenas tarefas concluídas
- ✅ Retorna array das removidas
- ✅ Retorna array vazio se nenhuma

### Suite: clearAll
- ✅ Remove todas as tarefas
- ✅ Retorna array de todas as removidas

### Métodos Adicionais Testados
- ✅ hasTodo()
- ✅ getCount()
- ✅ completeTodo()
- ✅ incompleteTodo()
- ✅ getTodos()

## Testes de Storage

### Suite: saveTodos e loadTodos
- ✅ Salva e carrega tarefas
- ✅ Retorna array vazio se nenhum dado
- ✅ Lança erro ao salvar non-array
- ✅ Mantém integridade de dados (UTF-8, etc)

### Suite: clearTodos
- ✅ Limpa dados salvos
- ✅ Não lança erro ao limpar vazio

### Suite: hasSavedTodos
- ✅ Retorna false quando sem dados
- ✅ Retorna true com dados salvos
- ✅ Retorna false após limpar

### Suite: Tema (saveTheme/loadTheme)
- ✅ Salva e carrega tema light
- ✅ Salva e carrega tema dark
- ✅ Retorna light como padrão
- ✅ Lança erro com tema inválido

### Suite: Export/Import
- ✅ Exporta dados em JSON válido
- ✅ Inclui data de exportação
- ✅ Inclui versão
- ✅ Importa dados válidos
- ✅ Lança erro com JSON inválido
- ✅ Lança erro com formato inválido
- ✅ Lança erro se não é array

### Suite: Integração
- ✅ Preserva estrutura após múltiplos ciclos

## Padrões de Teste

### Arrange-Act-Assert
```javascript
test('deve criar tarefa e incrementar contador', () => {
  // Arrange
  const manager = new TodoManager();
  
  // Act
  manager.createTodo('Task 1');
  manager.createTodo('Task 2');
  
  // Assert
  expect(manager.getCount()).toBe(2);
});
```

### Setup e Teardown
```javascript
describe('Suite', () => {
  let manager;
  
  // Executado antes de cada teste
  beforeEach(() => {
    manager = new TodoManager();
  });
  
  // Executado depois de cada teste
  afterEach(() => {
    // Cleanup
  });
  
  test('...', () => {
    // manager está limpo
  });
});
```

### Testando Exceções
```javascript
// Expect throw
test('deve lançar erro', () => {
  expect(() => manager.createTodo('')).toThrow('Title cannot be empty');
});

// Expect tipo específico
test('deve lançar string específica', () => {
  expect(() => manager.deleteTodo(999))
    .toThrow(new Error('Todo not found'));
});
```

### Testando Objetos Complexos
```javascript
test('deve retornar objeto com propriedades corretas', () => {
  const todo = manager.createTodo('Task');
  
  expect(todo).toHaveProperty('id');
  expect(todo).toHaveProperty('title');
  expect(todo).toHaveProperty('completed');
  expect(todo).toHaveProperty('createdAt');
});

expect(todo).toEqual({
  id: expect.any(Number),
  title: 'Task',
  completed: false,
  createdAt: expect.any(Number)
});
```

### Testando Arrays
```javascript
test('deve retornar array com tarefas ativas', () => {
  // Dado
  manager.createTodo('Active 1');
  manager.createTodo('Active 2');
  const completed = manager.createTodo('Complete');
  manager.toggleComplete(completed.id);
  
  // Quando
  const active = manager.getTodosByFilter('active');
  
  // Então
  expect(active).toHaveLength(2);
  expect(active.every(t => !t.completed)).toBe(true);
});
```

## Boas Práticas de Teste

### 1. Teste uma coisa por teste
```javascript
// ❌ Ruim: Testa múltiplas coisas
test('deve criar e deletar', () => {
  const todo = manager.createTodo('Task');
  manager.deleteTodo(todo.id);
  expect(manager.getCount()).toBe(0);
});

// ✅ Bom: Testa apenas a criação
test('deve criar tarefa com título válido', () => {
  const todo = manager.createTodo('Task');
  expect(todo.title).toBe('Task');
});

// ✅ Bom: Testa apenas a deleção
test('deve deletar tarefa existente', () => {
  const todo = manager.createTodo('Task');
  manager.deleteTodo(todo.id);
  expect(manager.getCount()).toBe(0);
});
```

### 2. Nomes descritivos
```javascript
// ❌ Ruim
test('it works', () => { ... });

// ✅ Bom
test('deve criar uma tarefa com título válido', () => { ... });
test('deve lançar erro ao criar com título vazio', () => { ... });
```

### 3. Testes independentes
```javascript
// ❌ Ruim: Um teste depende de outro
let todos = [];
test('primeira', () => { todos.push({...}); });
test('segunda', () => { expect(todos.length).toBe(1); }); // FALHA se rodar sozinha

// ✅ Bom: Cada teste é independente
test('primeira', () => {
  const todos = [];
  todos.push({...});
  expect(todos.length).toBe(1);
});
test('segunda', () => {
  const todos = [];
  expect(todos.length).toBe(0);
});
```

### 4. Evitar Testes Frágeis
```javascript
// ❌ Frágil: Depende de ordem
test('deve retornar id 1', () => {
  const todo = manager.createTodo('Task');
  expect(todo.id).toBe(1); // Falha se houver outros testes
});

// ✅ Robusto: Testa a propriedade, não o valor exato
test('deve ter um id numérico', () => {
  const todo = manager.createTodo('Task');
  expect(typeof todo.id).toBe('number');
  expect(todo.id).toBeGreaterThan(0);
});
```

## Cobertura de Código

### Verificar Cobertura
```bash
npm test:coverage

# Abre relatório HTML
open coverage/lcov-report/index.html
```

### Tipos de Cobertura

1. **Line Coverage**: % de linhas executadas
2. **Branch Coverage**: % de condiçõ testadas (if/else)
3. **Function Coverage**: % de funções chamadas
4. **Statement Coverage**: % de statements executados

### Alvo Atual
```json
{
  "branches": 80,
  "functions": 80,
  "lines": 80,
  "statements": 80
}
```

## Testes Que Faltam (Futuro)

### UI Integration Tests
```javascript
// Não implementado
test('submeter form com tarefa válida', () => {
  const input = document.querySelector('input');
  input.value = 'Nova tarefa';
  document.querySelector('form').dispatchEvent(new Event('submit'));
  
  expect(document.querySelectorAll('.todo-item')).toHaveLength(1);
});
```

### localStorage Integration
```javascript
// Não implementado
test('salvar e carregar do localStorage com UI', () => {
  // Simular criação via UI
  // Recarregar página
  // Verificar que tarefa persiste
});
```

### Testes de Performance
```javascript
// Não implementado
test('criar 1000 tarefas em < 1s', () => {
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    manager.createTodo(`Task ${i}`);
  }
  const elapsed = performance.now() - start;
  expect(elapsed).toBeLessThan(1000);
});
```

## CI/CD Integration

### No GitHub Actions
```yaml
- name: Run tests
  run: npm test -- --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

### Falhando no PR se:
- ❌ Testes falham
- ❌ Cobertura < 80%
- ❌ Syntax errors

## Debugging Testes

### Rodar um teste isolado
```bash
npm test -- -t "deve criar uma tarefa"
```

### Debug mode
```bash
node --inspect-brk ./node_modules/.bin/jest --runInBand
# Abre DevTools do Node em chrome://inspect
```

### Console output
```javascript
test('debug test', () => {
  const todo = manager.createTodo('Task');
  console.log('Todo:', todo);  // Aparece no output
  expect(todo).toBeDefined();
});
```

### Jest verbose mode
```bash
npm test -- --verbose
```

## Aliases Úteis

Adicionar a package.json:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## Próximos Passos

1. **Implementar testes de UI** com @testing-library
2. **Adicionar snapshot tests** para DOM
3. **Testes de performance** com lighthouse
4. **Testes de acessibilidade** com jest-axe
5. **Cobertura 100%** para crit código

---

**Versão**: 1.0  
**Última atualização**: Março 2026
