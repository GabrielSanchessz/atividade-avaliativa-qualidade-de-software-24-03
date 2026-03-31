/**
 * TodoManager
 * Módulo responsável pela lógica de negócio das tarefas
 * 
 * @class TodoManager
 * @requires TodoManager deve ser instanciado antes de usar qualquer método
 */
class TodoManager {
  /**
   * Inicializa o gerenciador de tarefas
   * @param {Array} initialTodos - Array inicial de tarefas (padrão: [])
   */
  constructor(initialTodos = []) {
    this.todos = Array.isArray(initialTodos) ? initialTodos : [];
    this.nextId = this._calculateNextId();
  }

  /**
   * Calcula o próximo ID disponível baseado nas tarefas existentes
   * @private
   * @returns {number} Próximo ID disponível
   */
  _calculateNextId() {
    if (this.todos.length === 0) return 1;
    return Math.max(...this.todos.map((todo) => todo.id)) + 1;
  }

  /**
   * Valida um título de tarefa
   * @private
   * @param {string} title - Título a validar
   * @throws {Error} Se o título for vazio ou não for string
   */
  _validateTitle(title) {
    if (typeof title !== 'string') {
      throw new Error('Title must be a string');
    }
    if (title.trim() === '') {
      throw new Error('Title cannot be empty');
    }
  }

  /**
   * Cria uma nova tarefa
   * @param {string} title - Título da tarefa
   * @returns {Object} Objeto da tarefa criada
   * @throws {Error} Se o título for inválido
   */
  createTodo(title) {
    this._validateTitle(title);

    const todo = {
      id: this.nextId++,
      title: title.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    this.todos.push(todo);
    return todo;
  }

  /**
   * Recupera uma tarefa por ID
   * @private
   * @param {number} id - ID da tarefa
   * @returns {Object|undefined} A tarefa ou undefined
   */
  _findTodoById(id) {
    return this.todos.find((todo) => todo.id === id);
  }

  /**
   * Encontra o índice de uma tarefa
   * @private
   * @param {number} id - ID da tarefa
   * @returns {number} Índice da tarefa ou -1
   */
  _findTodoIndex(id) {
    return this.todos.findIndex((todo) => todo.id === id);
  }

  /**
   * Deleta uma tarefa por ID
   * @param {number} id - ID da tarefa
   * @returns {Object} A tarefa deletada
   * @throws {Error} Se a tarefa não for encontrada
   */
  deleteTodo(id) {
    const index = this._findTodoIndex(id);
    if (index === -1) {
      throw new Error('Todo not found');
    }
    return this.todos.splice(index, 1)[0];
  }

  /**
   * Atualiza o título de uma tarefa
   * @param {number} id - ID da tarefa
   * @param {string} newTitle - Novo título
   * @returns {Object} A tarefa atualizada
   * @throws {Error} Se a tarefa não for encontrada ou título for inválido
   */
  updateTodo(id, newTitle) {
    const todo = this._findTodoById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    this._validateTitle(newTitle);
    todo.title = newTitle.trim();
    return todo;
  }

  /**
   * Alterna o status de conclusão de uma tarefa
   * @param {number} id - ID da tarefa
   * @returns {Object} A tarefa atualizada
   * @throws {Error} Se a tarefa não for encontrada
   */
  toggleComplete(id) {
    const todo = this._findTodoById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.completed = !todo.completed;
    return todo;
  }

  /**
   * Marca uma tarefa como completa
   * @param {number} id - ID da tarefa
   * @returns {Object} A tarefa atualizada
   * @throws {Error} Se a tarefa não for encontrada
   */
  completeTodo(id) {
    const todo = this._findTodoById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.completed = true;
    return todo;
  }

  /**
   * Marca uma tarefa como incompleta
   * @param {number} id - ID da tarefa
   * @returns {Object} A tarefa atualizada
   * @throws {Error} Se a tarefa não for encontrada
   */
  incompleteTodo(id) {
    const todo = this._findTodoById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.completed = false;
    return todo;
  }

  /**
   * Retorna todas as tarefas
   * @returns {Array} Cópia do array de tarefas
   */
  getTodos() {
    return [...this.todos];
  }

  /**
   * Filtra tarefas por status
   * @param {string} filter - Tipo de filtro: 'all', 'active', 'completed'
   * @returns {Array} Array de tarefas filtradas
   */
  getTodosByFilter(filter = 'all') {
    switch (filter) {
      case 'active':
        return this.todos.filter((todo) => !todo.completed);
      case 'completed':
        return this.todos.filter((todo) => todo.completed);
      case 'all':
      default:
        return [...this.todos];
    }
  }

  /**
   * Retorna estatísticas das tarefas
   * @returns {Object} Objeto com estatísticas
   */
  getStats() {
    const total = this.todos.length;
    const completed = this.todos.filter((todo) => todo.completed).length;
    const pending = total - completed;

    return {
      total,
      completed,
      pending,
    };
  }

  /**
   * Remove todas as tarefas completas
   * @returns {Array} Array de tarefas removidas
   */
  clearCompleted() {
    const completed = this.todos.filter((todo) => todo.completed);
    this.todos = this.todos.filter((todo) => !todo.completed);
    return completed;
  }

  /**
   * Remove todas as tarefas
   * @returns {Array} Array de todas as tarefas removidas
   */
  clearAll() {
    const allTodos = [...this.todos];
    this.todos = [];
    return allTodos;
  }

  /**
   * Verifica se existe uma tarefa com um ID específico
   * @param {number} id - ID da tarefa
   * @returns {boolean} True se existe, false caso contrário
   */
  hasTodo(id) {
    return this.todos.some((todo) => todo.id === id);
  }

  /**
   * Retorna a quantidade de tarefas
   * @returns {number} Quantidade total de tarefas
   */
  getCount() {
    return this.todos.length;
  }
}

// Exporta para uso em testes (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TodoManager;
}
