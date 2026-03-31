# 🏗️ Arquitetura Técnica

Documentação completa da arquitetura, design patterns e decisões técnicas da aplicação To-Do List.

## Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────┐
│              HTML5 + CSS3 + JS ES6+             │
├─────────────────────────────────────────────────┤
│                    UI Layer                     │
│              (ui.js - 350+ linhas)              │
├─────────────────────────────────────────────────┤
│              Business Logic Layer               │
│   TodoManager (180+ linhas) + Storage (150+)    │
├─────────────────────────────────────────────────┤
│            Browser localStorage API             │
└─────────────────────────────────────────────────┘
```

## Camadas da Aplicação

### 1. Presentation Layer (UI)

**Arquivo**: `src/js/ui.js`

Responsabilidades:
- Gerenciar o DOM
- Capturar eventos de usuário
- Renderizar elementos visuais
- Validação de entrada (UX)
- Estado visual da aplicação

**Classes**:
```javascript
class UI {
  constructor(todoManager, storage)
  init()
  renderTodos(filter)
  updateStats()
  setupEventListeners()
  // ... handlers de eventos
}
```

**Métodos Principais**:
- `init()` - Inicializa UI e listeners
- `renderTodos(filter)` - Renderiza lista baseada em filtro
- `updateStats()` - Atualiza estatísticas em tempo real
- Event handlers privados para cada ação do usuário

### 2. Business Logic Layer

**Arquivo**: `src/js/todoManager.js`

Responsabilidades:
- Gerenciar estado das tarefas
- Validação de negócio
- Operações CRUD em tarefas
- Cálculos de estatísticas
- Filtragem de dados

**Classes**:
```javascript
class TodoManager {
  constructor(initialTodos = [])
  createTodo(title)
  deleteTodo(id)
  updateTodo(id, newTitle)
  toggleComplete(id)
  getTodosByFilter(filter)
  getStats()
  // ... métodos auxiliares
}
```

**Características**:
- Validação rigorosa de entrada
- IDs incrementados automaticamente
- Sem efeitos colaterais
- Testável e previsível
- Immutabilidade parcial

### 3. Data Persistence Layer

**Arquivo**: `src/js/storage.js`

Responsabilidades:
- Persistir dados em localStorage
- Serialização/Desserialização JSON
- Tratamento de erros
- Export/Import de dados
- Persistência de preferências

**Classes**:
```javascript
class Storage {
  static saveTodos(todos)
  static loadTodos()
  static clearTodos()
  static saveTheme(theme)
  static loadTheme()
  static exportData(todos)
  static importData(jsonData)
}
```

**Características**:
- Métodos estáticos (padrão singleton)
- Tratamento de erros robusto
- Validação de dados carregados
- Suporta export/import

## Design Patterns Utilizados

### 1. MVC-Like Pattern

```
Model (TodoManager) ──→ View (UI + HTML)
     ↑                        │
     └────────────────────────┘
            Controller
         (event handlers)
```

### 2. Singleton Pattern

**Storage** implementa singleton:
```javascript
class Storage {
  // Métodos estáticos apenas
  static saveTodos(todos) { ... }
  static loadTodos() { ... }
  // Nunca instanciado: Storage.method()
}
```

### 3. Observer Pattern (implícito)

UI observa/reage a mudanças:
```javascript
// Quando todoManager.createTodo() é chamado,
// UI automaticamente atualiza via renderTodos()
this.todoManager.createTodo(title);
this.renderTodos(); // UI reage
```

### 4. Command Pattern

Cada ação do usuário é uma "comando":
```javascript
_handleToggleTodo(id) {
  this.todoManager.toggleComplete(id);
  this.storage.saveTodos(...);
  this.renderTodos();
}
```

## Fluxo de Dados

### Criar Tarefa

```
1. User input form → 2. _handleFormSubmit() → 3. validate input
                                                ↓
4. todoManager.createTodo() ←─ 5. Update model
                ↓
6. storage.saveTodos() ←─ 7. Persist to localStorage
                ↓
8. renderTodos() ←─ 9. Update DOM
                ↓
10. updateStats() ←─ 11. Update stats display
```

### Código:
```javascript
_handleFormSubmit(e) {
  e.preventDefault();
  const title = this.input.value.trim();
  
  // Validação
  if (!title) {
    this._showError('Por favor, digite uma tarefa');
    return;
  }
  
  try {
    // Business logic
    this.todoManager.createTodo(title);
    
    // Persistence
    this.storage.saveTodos(this.todoManager.getTodos());
    
    // UI update
    this.input.value = '';
    this._hideError();
    this.renderTodos(this.currentFilter);
    this.updateStats();
    this.input.focus();
  } catch (error) {
    this._showError(error.message);
  }
}
```

## Validação em Múltiplos Níveis

### Nível 1: HTML (UX)
```html
<input required maxlength="100" autocomplete="off" />
```

### Nível 2: JavaScript (UX)
```javascript
if (!title) {
  this._showError('Por favor, digite uma tarefa');
  return;
}
```

### Nível 3: Business Logic (Lógica)
```javascript
_validateTitle(title) {
  if (typeof title !== 'string') {
    throw new Error('Title must be a string');
  }
  if (title.trim() === '') {
    throw new Error('Title cannot be empty');
  }
}
```

## Gerenciamento de Erros

### Try-Catch Pattern
```javascript
try {
  this.todoManager.createTodo(title);
  this.storage.saveTodos(...);
} catch (error) {
  this._showError(error.message);
}
```

### Global Error Handlers
```javascript
window.addEventListener('error', (event) => {
  console.error('Erro global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejeitada:', event.reason);
});
```

## State Management

### Estado em TodoManager
```javascript
// Mantém array de tarefas
this.todos = [];
this.nextId = 1;

// Métodos para acessar estado
getTodos()
getStats() // {total, completed, pending}
getTodosByFilter(filter)
```

### Estado em UI
```javascript
this.currentFilter = 'all';
this.editingId = null;
// DOM properties are source of truth for visual state
```

### LocalStorage como Persistent State
```javascript
// Ao carregar:
const savedTodos = Storage.loadTodos();
const todoManager = new TodoManager(savedTodos);

// Ao modificar:
this.storage.saveTodos(this.todoManager.getTodos());
```

## Performance Considerations

### 1. DOM Manipulation
```javascript
// ❌ Ruim: Múltiplas operações
list.innerHTML = '';
todos.forEach(todo => {
  list.appendChild(createElement(todo));
  list.appendChild(createElement2(todo));
});

// ✅ Bom: Construir string ou usar fragment
const fragment = document.createDocumentFragment();
todos.forEach(todo => {
  fragment.appendChild(createTodoElement(todo));
});
list.appendChild(fragment);
```

### 2. Event Delegation (não implementado, seria melhor)
```javascript
// Atualmente: Listener em cada item
// Melhor: Uma listener na parent
list.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-delete')) {
    // Handle delete
  }
});
```

### 3. localStorage Performance
- localStorage é síncrono ⚠️
- Para aplicações grandes, considerar IndexedDB
- Nossa aplicação: Tamanho pequeno, localStorage é OK

## Escalabilidade

### Se expandir para 10,000+ tarefas:

1. **Usar Pagination**
```javascript
getTodosPage(pageNum = 1, pageSize = 50) {
  const start = (pageNum - 1) * pageSize;
  return this.todos.slice(start, start + pageSize);
}
```

2. **Usar IndexedDB ao invés localStorage**
```javascript
// localStorage: ~5-10MB limit
// IndexedDB: Gigabytes
saveToIndexedDB(todos) { ... }
```

3. **Virtual Scrolling para lista**
```javascript
// Renderizar apenas itens visíveis
// Biblioteca: react-window, vanilla alternativas
```

4. **Web Workers para processamento**
```javascript
// Offload filtering/sorting para worker
const worker = new Worker('filter.worker.js');
```

## Segurança

### Validação de Entrada
```javascript
_validateTitle(title) {
  if (typeof title !== 'string') throw new Error(...);
  if (title.trim() === '') throw new Error(...);
  // Prevents: XSS, type attacks
}
```

### No innerHTML direto
```javascript
// ❌ Ruim: Susceptível a XSS
element.innerHTML = `<span>${title}</span>`;

// ✅ Bom: textContent é seguro
span.textContent = title; // Escapa HTML
```

### Validação ao Carregar localStorage
```javascript
loadTodos() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  const todos = JSON.parse(data);
  if (!Array.isArray(todos)) {
    console.warn('Dados corrompidos');
    return [];
  }
  return todos;
}
```

## Testabilidade

### Razão de Alta Testabilidade:

1. **Separation of Concerns**
   - TodoManager: Apenas lógica
   - Storage: Apenas persistência
   - UI: Apenas apresentação

2. **Métodos puros**
   - `createTodo(title)` sempre retorna mesmo tipo dado mesmo input
   - Sem side effects (a não ser em UI.js)

3. **Injeção de Dependência**
   ```javascript
   constructor(todoManager, storage = Storage) {
     // Facilita mocking em testes
   }
   ```

4. **Métodos privados testáveis indiretamente**
   ```javascript
   _validateTitle(title) // Testado via createTodo()
   _findTodoById(id)     // Testado via getTodos()
   ```

## Documentação de Código

### JSDoc Comments
```javascript
/**
 * Cria uma nova tarefa
 * @param {string} title - Título da tarefa
 * @returns {Object} Objeto da tarefa criada
 * @throws {Error} Se o título for inválido
 */
createTodo(title) { ... }
```

### Métodos Bem Nomeados
```javascript
// Clear
getStats()          // ✅ Clareza no retorno
_findTodoById(id)   // ✅ Interna via _ prefix
toggleComplete()    // ✅ Ação bem descrita

// Ambíguo
process()           // ❌ O quê faz exatamente?
handle()            // ❌ Qual handler?
```

## Melhorias Futuras

### Curto Prazo
1. Event delegation para listeners
2. CSS-in-JS ou CSS modules
3. Testes para UI (não implementado)
4. Validação em tempo real

### Médio Prazo
1. Sincronização com backend
2. Colaboração em tempo real
3. Categories/Tags
4. Recurrence/Reminders
5. Mobile app (React Native)

### Longo Prazo
1. Migrar para TypeScript
2. Framework moderno (React/Vue)
3. Backend e banco de dados
4. Desktop app (Electron)
5. Cloud sync (Firebase/Supabase)

---

**Versão**: 1.0  
**Última atualização**: Março 2026
