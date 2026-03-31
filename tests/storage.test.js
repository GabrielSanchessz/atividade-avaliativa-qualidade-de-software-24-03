const Storage = require('../src/js/storage');

describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('saveTodos e loadTodos', () => {
    test('deve salvar e carregar tarefas', () => {
      const todos = [
        { id: 1, title: 'Task 1', completed: false, createdAt: Date.now() },
        { id: 2, title: 'Task 2', completed: true, createdAt: Date.now() },
      ];

      Storage.saveTodos(todos);
      const loaded = Storage.loadTodos();

      expect(loaded).toEqual(todos);
    });

    test('deve retornar array vazio se nenhum dado salvo', () => {
      const loaded = Storage.loadTodos();
      expect(loaded).toEqual([]);
    });

    test('deve lançar erro ao salvar non-array', () => {
      expect(() => Storage.saveTodos('invalid')).toThrow(
        'Todos must be an array'
      );
      expect(() => Storage.saveTodos(null)).toThrow('Todos must be an array');
      expect(() => Storage.saveTodos({ id: 1 })).toThrow(
        'Todos must be an array'
      );
    });

    test('deve manter integridade dos dados após salvar e carregar', () => {
      const original = [
        {
          id: 1,
          title: 'Teste com caracteres especiais: áéíóú 123 !@#',
          completed: false,
          createdAt: 1234567890,
        },
      ];

      Storage.saveTodos(original);
      const loaded = Storage.loadTodos();

      expect(loaded[0].title).toBe(original[0].title);
      expect(loaded[0].createdAt).toBe(original[0].createdAt);
    });
  });

  describe('clearTodos', () => {
    test('deve limpar dados salvos', () => {
      const todos = [
        { id: 1, title: 'Task', completed: false, createdAt: Date.now() },
      ];
      Storage.saveTodos(todos);
      Storage.clearTodos();
      const loaded = Storage.loadTodos();
      expect(loaded).toEqual([]);
    });

    test('deve não lançar erro ao limpar sem dados', () => {
      expect(() => Storage.clearTodos()).not.toThrow();
    });
  });

  describe('hasSavedTodos', () => {
    test('deve retornar false quando não há dados', () => {
      expect(Storage.hasSavedTodos()).toBe(false);
    });

    test('deve retornar true quando há dados salvos', () => {
      Storage.saveTodos([{ id: 1, title: 'Task' }]);
      expect(Storage.hasSavedTodos()).toBe(true);
    });

    test('deve retornar false após limpar', () => {
      Storage.saveTodos([{ id: 1, title: 'Task' }]);
      Storage.clearTodos();
      expect(Storage.hasSavedTodos()).toBe(false);
    });
  });

  describe('saveTheme e loadTheme', () => {
    test('deve salvar e carregar tema light', () => {
      Storage.saveTheme('light');
      expect(Storage.loadTheme()).toBe('light');
    });

    test('deve salvar e carregar tema dark', () => {
      Storage.saveTheme('dark');
      expect(Storage.loadTheme()).toBe('dark');
    });

    test('deve retornar light como padrão', () => {
      expect(Storage.loadTheme()).toBe('light');
    });

    test('deve lançar erro com tema inválido', () => {
      expect(() => Storage.saveTheme('invalid')).toThrow('Invalid theme');
    });
  });

  describe('exportData', () => {
    test('deve exportar dados em formato JSON válido', () => {
      const todos = [
        { id: 1, title: 'Task 1', completed: false, createdAt: Date.now() },
      ];
      const exported = Storage.exportData(todos);
      const parsed = JSON.parse(exported);

      expect(parsed).toHaveProperty('exportDate');
      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('todos');
      expect(parsed.todos).toEqual(todos);
    });

    test('deve incluir data de exportação', () => {
      const exported = Storage.exportData([]);
      const parsed = JSON.parse(exported);
      expect(parsed.exportDate).toBeDefined();
      expect(new Date(parsed.exportDate)).toBeInstanceOf(Date);
    });

    test('deve incluir versão', () => {
      const exported = Storage.exportData([]);
      const parsed = JSON.parse(exported);
      expect(parsed.version).toBe('1.0');
    });
  });

  describe('importData', () => {
    test('deve importar dados válidos', () => {
      const originalTodos = [
        { id: 1, title: 'Task', completed: false, createdAt: Date.now() },
      ];
      const exportedData = Storage.exportData(originalTodos);
      const imported = Storage.importData(exportedData);

      expect(imported).toEqual(originalTodos);
    });

    test('deve lançar erro com JSON inválido', () => {
      expect(() => Storage.importData('invalid json')).toThrow(
        'Failed to import data - invalid format'
      );
    });

    test('deve lançar erro com formato inválido (sem todos)', () => {
      const invalidData = JSON.stringify({ version: '1.0' });
      expect(() => Storage.importData(invalidData)).toThrow(
        'Failed to import data - invalid format'
      );
    });

    test('deve lançar erro se todos não é array', () => {
      const invalidData = JSON.stringify({
        version: '1.0',
        todos: 'not an array',
      });
      expect(() => Storage.importData(invalidData)).toThrow(
        'Failed to import data - invalid format'
      );
    });
  });

  describe('Storage.STORAGE_KEY', () => {
    test('deve ser uma chave consistente', () => {
      expect(Storage.STORAGE_KEY).toBe('todolist_todos');
    });
  });

  describe('Storage.THEME_KEY', () => {
    test('deve ser uma chave consistente', () => {
      expect(Storage.THEME_KEY).toBe('todolist_theme');
    });
  });

  describe('integração saveTodos e loadTodos', () => {
    test('deve preservar estrutura de dados após múltiplos ciclos save/load', () => {
      const todos = [
        { id: 1, title: 'Task 1', completed: false, createdAt: 123456 },
        { id: 2, title: 'Task 2', completed: true, createdAt: 123457 },
      ];

      // Primeiro ciclo
      Storage.saveTodos(todos);
      let loaded = Storage.loadTodos();
      expect(loaded).toEqual(todos);

      // Segundo ciclo
      Storage.saveTodos(loaded);
      loaded = Storage.loadTodos();
      expect(loaded).toEqual(todos);
    });
  });
});
