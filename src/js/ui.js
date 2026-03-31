/**
 * UI Controller
 * Módulo responsável pela manipulação do DOM e interações visuais
 * 
 * @class UI
 * @requires TodoManager Para gerenciar lógica de tarefas
 * @requires Storage Para persistência de dados
 */
class UI {
  /**
   * Inicializa o controlador de UI
   * @param {TodoManager} todoManager - Instância do gerenciador de tarefas
   * @param {Storage} storage - Classe de armazenamento
   */
  constructor(todoManager, storage = Storage) {
    this.todoManager = todoManager;
    this.storage = storage;

    // Elementos do DOM
    this.form = document.getElementById('todoForm');
    this.input = document.getElementById('todoInput');
    this.todoList = document.getElementById('todoList');
    this.emptyState = document.getElementById('emptyState');
    this.filterSelect = document.getElementById('filterSelect');
    this.errorMessage = document.getElementById('errorMessage');

    // Stats
    this.totalCount = document.getElementById('totalCount');
    this.pendingCount = document.getElementById('pendingCount');
    this.completedCount = document.getElementById('completedCount');

    // Buttons
    this.clearCompletedBtn = document.getElementById('clearCompleted');
    this.clearAllBtn = document.getElementById('clearAll');
    this.themeToggle = document.getElementById('themeToggle');

    // State
    this.currentFilter = 'all';
    this.editingId = null;
  }

  /**
   * Inicializa os event listeners
   */
  setupEventListeners() {
    this.form.addEventListener('submit', (e) => this._handleFormSubmit(e));
    this.filterSelect.addEventListener('change', (e) =>
      this._handleFilterChange(e)
    );
    this.clearCompletedBtn.addEventListener('click', () =>
      this._handleClearCompleted()
    );
    this.clearAllBtn.addEventListener('click', () => this._handleClearAll());
    this.themeToggle.addEventListener('click', () => this._toggleTheme());
  }

  /**
   * Renderiza a lista de tarefas
   * @param {string} filter - Filtro a aplicar ('all', 'active', 'completed')
   */
  renderTodos(filter = 'all') {
    this.currentFilter = filter;
    const todos = this.todoManager.getTodosByFilter(filter);

    this.todoList.innerHTML = '';

    if (todos.length === 0) {
      this.emptyState.classList.remove('hidden');
      return;
    }

    this.emptyState.classList.add('hidden');

    todos.forEach((todo) => {
      const todoElement = this._createTodoElement(todo);
      this.todoList.appendChild(todoElement);
    });
  }

  /**
   * Cria o elemento HTML de uma tarefa
   * @private
   * @param {Object} todo - Objeto da tarefa
   * @returns {HTMLElement} Elemento li da tarefa
   */
  _createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;
    li.role = 'listitem';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => this._handleToggleTodo(todo.id));

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.title;

    const content = document.createElement('div');
    content.className = 'todo-content';
    content.appendChild(checkbox);
    content.appendChild(textSpan);

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn-edit btn-icon-btn';
    editBtn.title = 'Editar tarefa';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.addEventListener('click', () => this._handleEditTodo(todo.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete btn-icon-btn';
    deleteBtn.title = 'Deletar tarefa';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.addEventListener('click', () => this._handleDeleteTodo(todo.id));

    const actions = document.createElement('div');
    actions.className = 'todo-actions';
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(content);
    li.appendChild(actions);

    return li;
  }

  /**
   * Atualiza as estatísticas exibidas
   */
  updateStats() {
    const stats = this.todoManager.getStats();
    this.totalCount.textContent = stats.total;
    this.pendingCount.textContent = stats.pending;
    this.completedCount.textContent = stats.completed;
  }

  /**
   * Handler para submissão do formulário
   * @private
   * @param {Event} e - Evento do formulário
   */
  _handleFormSubmit(e) {
    e.preventDefault();
    const title = this.input.value.trim();

    if (!title) {
      this._showError('Por favor, digite uma tarefa');
      return;
    }

    try {
      this.todoManager.createTodo(title);
      this.storage.saveTodos(this.todoManager.getTodos());
      this.input.value = '';
      this._hideError();
      this.renderTodos(this.currentFilter);
      this.updateStats();
      this.input.focus();
    } catch (error) {
      this._showError(error.message);
    }
  }

  /**
   * Handler para filtro de tarefas
   * @private
   * @param {Event} e - Evento do select
   */
  _handleFilterChange(e) {
    const filter = e.target.value;
    this.renderTodos(filter);
  }

  /**
   * Handler para marcar tarefa como concluída
   * @private
   * @param {number} id - ID da tarefa
   */
  _handleToggleTodo(id) {
    try {
      this.todoManager.toggleComplete(id);
      this.storage.saveTodos(this.todoManager.getTodos());
      this.renderTodos(this.currentFilter);
      this.updateStats();
    } catch (error) {
      this._showError(error.message);
    }
  }

  /**
   * Handler para editar tarefa
   * @private
   * @param {number} id - ID da tarefa
   */
  _handleEditTodo(id) {
    const todo = this.todoManager._findTodoById(id);
    if (!todo) {return;}

    const newTitle = prompt('Editar tarefa:', todo.title);
    if (newTitle === null) {return;}

    try {
      this.todoManager.updateTodo(id, newTitle);
      this.storage.saveTodos(this.todoManager.getTodos());
      this.renderTodos(this.currentFilter);
      this.updateStats();
      this._hideError();
    } catch (error) {
      this._showError(error.message);
    }
  }

  /**
   * Handler para deletar tarefa
   * @private
   * @param {number} id - ID da tarefa
   */
  _handleDeleteTodo(id) {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) {
      return;
    }

    try {
      this.todoManager.deleteTodo(id);
      this.storage.saveTodos(this.todoManager.getTodos());
      this.renderTodos(this.currentFilter);
      this.updateStats();
      this._hideError();
    } catch (error) {
      this._showError(error.message);
    }
  }

  /**
   * Handler para limpar tarefas concluídas
   * @private
   */
  _handleClearCompleted() {
    const completed = this.todoManager.getStats().completed;
    if (completed === 0) {
      this._showError('Nenhuma tarefa concluída para limpar');
      return;
    }

    if (!confirm(`Deletar ${completed} tarefa(s) concluída(s)?`)) {
      return;
    }

    try {
      this.todoManager.clearCompleted();
      this.storage.saveTodos(this.todoManager.getTodos());
      this.filterSelect.value = 'all';
      this.renderTodos('all');
      this.updateStats();
      this._hideError();
    } catch (error) {
      this._showError(error.message);
    }
  }

  /**
   * Handler para limpar tudo
   * @private
   */
  _handleClearAll() {
    if (this.todoManager.getCount() === 0) {
      this._showError('Nenhuma tarefa para limpar');
      return;
    }

    if (
      !confirm(
        'Tem certeza que deseja deletar TODAS as tarefas? Esta ação não pode ser desfeita.'
      )
    ) {
      return;
    }

    try {
      this.todoManager.clearAll();
      this.storage.saveTodos(this.todoManager.getTodos());
      this.filterSelect.value = 'all';
      this.renderTodos('all');
      this.updateStats();
      this._hideError();
    } catch (error) {
      this._showError(error.message);
    }
  }

  /**
   * Handler para alternar tema
   * @private
   */
  _toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    try {
      this.storage.saveTheme(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }

    this._updateThemeButton(newTheme);
  }

  /**
   * Atualiza o ícone do botão de tema
   * @private
   * @param {string} theme - Tema atual
   */
  _updateThemeButton(theme) {
    const icon = this.themeToggle.querySelector('i');
    if (theme === 'light') {
      icon.className = 'fas fa-moon';
    } else {
      icon.className = 'fas fa-sun';
    }
  }

  /**
   * Inicializa o tema salvo
   */
  initializeTheme() {
    try {
      const savedTheme = this.storage.loadTheme();
      if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        this._updateThemeButton('dark');
      }
    } catch (error) {
      console.error('Error initializing theme:', error);
    }
  }

  /**
   * Exibe mensagem de erro
   * @private
   * @param {string} message - Mensagem de erro
   */
  _showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.classList.add('show');
  }

  /**
   * Oculta mensagem de erro
   * @private
   */
  _hideError() {
    this.errorMessage.classList.remove('show');
    this.errorMessage.textContent = '';
  }

  /**
   * Inicia a interface
   */
  init() {
    this.initializeTheme();
    this.renderTodos('all');
    this.updateStats();
    this.setupEventListeners();
    this.input.focus();
  }
}

// Exporta para uso em testes (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UI;
}
