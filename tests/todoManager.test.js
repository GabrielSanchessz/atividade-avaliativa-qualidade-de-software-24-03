const TodoManager = require('../src/js/todoManager');

describe('TodoManager', () => {
  let manager;

  beforeEach(() => {
    manager = new TodoManager();
  });

  describe('constructor', () => {
    test('deve inicializar com array vazio', () => {
      expect(manager.getTodos()).toEqual([]);
    });

    test('deve inicializar com tarefas iniciais', () => {
      const initialTodos = [
        { id: 1, title: 'Task 1', completed: false, createdAt: Date.now() },
      ];
      const managerWithTodos = new TodoManager(initialTodos);
      expect(managerWithTodos.getTodos()).toHaveLength(1);
    });

    test('deve ignorar input inválido no constructor', () => {
      const managerInvalid = new TodoManager(null);
      expect(managerInvalid.getTodos()).toEqual([]);
    });
  });

  describe('createTodo', () => {
    test('deve criar uma tarefa com título válido', () => {
      const todo = manager.createTodo('Comprar leite');
      expect(todo).toHaveProperty('id');
      expect(todo.title).toBe('Comprar leite');
      expect(todo.completed).toBe(false);
      expect(todo.createdAt).toBeDefined();
    });

    test('deve trim do título', () => {
      const todo = manager.createTodo('  Espaços  ');
      expect(todo.title).toBe('Espaços');
    });

    test('deve lançar erro com título vazio', () => {
      expect(() => manager.createTodo('')).toThrow('Title cannot be empty');
      expect(() => manager.createTodo('   ')).toThrow('Title cannot be empty');
    });

    test('deve lançar erro se título não for string', () => {
      expect(() => manager.createTodo(null)).toThrow('Title must be a string');
      expect(() => manager.createTodo(123)).toThrow('Title must be a string');
      expect(() => manager.createTodo(undefined)).toThrow(
        'Title must be a string'
      );
    });

    test('deve incrementar ID a cada criação', () => {
      const todo1 = manager.createTodo('Task 1');
      const todo2 = manager.createTodo('Task 2');
      expect(todo2.id).toBe(todo1.id + 1);
    });

    test('deve adicionar a tarefa à lista', () => {
      manager.createTodo('Task 1');
      expect(manager.getCount()).toBe(1);
    });
  });

  describe('deleteTodo', () => {
    test('deve deletar uma tarefa existente', () => {
      const todo = manager.createTodo('Task to delete');
      manager.deleteTodo(todo.id);
      expect(manager.getCount()).toBe(0);
    });

    test('deve lançar erro ao deletar tarefa inexistente', () => {
      expect(() => manager.deleteTodo(999)).toThrow('Todo not found');
    });

    test('deve retornar a tarefa deletada', () => {
      const todo = manager.createTodo('Task');
      const deleted = manager.deleteTodo(todo.id);
      expect(deleted.id).toBe(todo.id);
      expect(deleted.title).toBe('Task');
    });
  });

  describe('updateTodo', () => {
    test('deve atualizar o título de uma tarefa', () => {
      const todo = manager.createTodo('Original');
      manager.updateTodo(todo.id, 'Updated');
      const updated = manager._findTodoById(todo.id);
      expect(updated.title).toBe('Updated');
    });

    test('deve trim do novo título', () => {
      const todo = manager.createTodo('Task');
      manager.updateTodo(todo.id, '  Novo Título  ');
      const updated = manager._findTodoById(todo.id);
      expect(updated.title).toBe('Novo Título');
    });

    test('deve lançar erro ao atualizar tarefa inexistente', () => {
      expect(() => manager.updateTodo(999, 'New title')).toThrow(
        'Todo not found'
      );
    });

    test('deve lançar erro com título vazio', () => {
      const todo = manager.createTodo('Task');
      expect(() => manager.updateTodo(todo.id, '')).toThrow(
        'Title cannot be empty'
      );
    });
  });

  describe('toggleComplete', () => {
    test('deve marcar como completa uma tarefa incompleta', () => {
      const todo = manager.createTodo('Task');
      manager.toggleComplete(todo.id);
      const updated = manager._findTodoById(todo.id);
      expect(updated.completed).toBe(true);
    });

    test('deve marcar como incompleta uma tarefa completa', () => {
      const todo = manager.createTodo('Task');
      manager.toggleComplete(todo.id);
      manager.toggleComplete(todo.id);
      const updated = manager._findTodoById(todo.id);
      expect(updated.completed).toBe(false);
    });

    test('deve lançar erro para tarefa inexistente', () => {
      expect(() => manager.toggleComplete(999)).toThrow('Todo not found');
    });
  });

  describe('completeTodo', () => {
    test('deve marcar tarefa como completa', () => {
      const todo = manager.createTodo('Task');
      manager.completeTodo(todo.id);
      const updated = manager._findTodoById(todo.id);
      expect(updated.completed).toBe(true);
    });

    test('deve lançar erro para tarefa inexistente', () => {
      expect(() => manager.completeTodo(999)).toThrow('Todo not found');
    });
  });

  describe('incompleteTodo', () => {
    test('deve marcar tarefa como incompleta', () => {
      const todo = manager.createTodo('Task');
      manager.completeTodo(todo.id);
      manager.incompleteTodo(todo.id);
      const updated = manager._findTodoById(todo.id);
      expect(updated.completed).toBe(false);
    });

    test('deve lançar erro para tarefa inexistente', () => {
      expect(() => manager.incompleteTodo(999)).toThrow('Todo not found');
    });
  });

  describe('getTodos', () => {
    test('deve retornar cópia do array', () => {
      manager.createTodo('Task 1');
      const todos = manager.getTodos();
      todos.push({ id: 999, title: 'Fake' });
      expect(manager.getCount()).toBe(1);
    });

    test('deve retornar todas as tarefas', () => {
      manager.createTodo('Task 1');
      manager.createTodo('Task 2');
      expect(manager.getTodos()).toHaveLength(2);
    });
  });

  describe('getTodosByFilter', () => {
    beforeEach(() => {
      manager.createTodo('Active 1');
      manager.createTodo('Active 2');
      const todo3 = manager.createTodo('Completed 1');
      manager.toggleComplete(todo3.id);
    });

    test('deve retornar apenas tarefas ativas', () => {
      const active = manager.getTodosByFilter('active');
      expect(active).toHaveLength(2);
      expect(active.every((t) => !t.completed)).toBe(true);
    });

    test('deve retornar apenas tarefas concluídas', () => {
      const completed = manager.getTodosByFilter('completed');
      expect(completed).toHaveLength(1);
      expect(completed.every((t) => t.completed)).toBe(true);
    });

    test('deve retornar todas as tarefas com filtro all', () => {
      const all = manager.getTodosByFilter('all');
      expect(all).toHaveLength(3);
    });

    test('deve retornar todas por padrão', () => {
      const all = manager.getTodosByFilter();
      expect(all).toHaveLength(3);
    });
  });

  describe('getStats', () => {
    beforeEach(() => {
      manager.createTodo('Task 1');
      manager.createTodo('Task 2');
      const todo3 = manager.createTodo('Task 3');
      manager.toggleComplete(todo3.id);
    });

    test('deve retornar estatísticas corretas', () => {
      const stats = manager.getStats();
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.pending).toBe(2);
    });

    test('deve retornar zeros para lista vazia', () => {
      const emptyManager = new TodoManager();
      const stats = emptyManager.getStats();
      expect(stats.total).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.pending).toBe(0);
    });
  });

  describe('clearCompleted', () => {
    test('deve remover apenas tarefas concluídas', () => {
      manager.createTodo('Active');
      const completed = manager.createTodo('Completed');
      manager.toggleComplete(completed.id);

      manager.clearCompleted();
      expect(manager.getCount()).toBe(1);
      expect(manager.getTodos()[0].title).toBe('Active');
    });

    test('deve retornar array das tarefas removidas', () => {
      const completed = manager.createTodo('Completed');
      manager.toggleComplete(completed.id);

      const removed = manager.clearCompleted();
      expect(removed).toHaveLength(1);
      expect(removed[0].id).toBe(completed.id);
    });

    test('deve retornar array vazio se nenhuma completa', () => {
      manager.createTodo('Active');
      const removed = manager.clearCompleted();
      expect(removed).toHaveLength(0);
    });
  });

  describe('clearAll', () => {
    test('deve remover todas as tarefas', () => {
      manager.createTodo('Task 1');
      manager.createTodo('Task 2');
      manager.clearAll();
      expect(manager.getCount()).toBe(0);
    });

    test('deve retornar array de todas as removidas', () => {
      manager.createTodo('Task 1');
      manager.createTodo('Task 2');
      const removed = manager.clearAll();
      expect(removed).toHaveLength(2);
    });
  });

  describe('hasTodo', () => {
    test('deve retornar true para tarefa existente', () => {
      const todo = manager.createTodo('Task');
      expect(manager.hasTodo(todo.id)).toBe(true);
    });

    test('deve retornar false para tarefa inexistente', () => {
      expect(manager.hasTodo(999)).toBe(false);
    });
  });

  describe('getCount', () => {
    test('deve retornar quantidade correta de tarefas', () => {
      expect(manager.getCount()).toBe(0);
      manager.createTodo('Task 1');
      expect(manager.getCount()).toBe(1);
      manager.createTodo('Task 2');
      expect(manager.getCount()).toBe(2);
    });
  });
});
