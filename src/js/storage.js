/**
 * Storage
 * Módulo responsável pela persistência de dados em localStorage
 * 
 * @class Storage
 */
class Storage {
  /**
   * Chave padrão para armazenar as tarefas
   * @static
   * @type {string}
   */
  static STORAGE_KEY = 'todolist_todos';

  /**
   * Chave para armazenar preferências do tema
   * @static
   * @type {string}
   */
  static THEME_KEY = 'todolist_theme';

  /**
   * Salva tarefas no localStorage
   * @static
   * @param {Array} todos - Array de tarefas
   * @throws {Error} Se houver erro ao salvar
   */
  static saveTodos(todos) {
    try {
      if (!Array.isArray(todos)) {
        throw new Error('Todos must be an array');
      }
      const serialized = JSON.stringify(todos);
      localStorage.setItem(Storage.STORAGE_KEY, serialized);
    } catch (error) {
      // Se for erro de validação, relançar como está
      if (error.message === 'Todos must be an array') {
        throw error;
      }
      // Se for outro erro, wrap com mensagem genérica
      console.error('Error saving todos to localStorage:', error);
      throw new Error('Failed to save todos');
    }
  }

  /**
   * Carrega tarefas do localStorage
   * @static
   * @returns {Array} Array de tarefas ou array vazio se nada foi salvo
   * @throws {Error} Se houver erro ao carregar
   */
  static loadTodos() {
    try {
      const data = localStorage.getItem(Storage.STORAGE_KEY);
      if (!data) {
        return [];
      }
      const todos = JSON.parse(data);
      if (!Array.isArray(todos)) {
        console.warn('Stored data is not an array, returning empty array');
        return [];
      }
      return todos;
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
      throw new Error('Failed to load todos');
    }
  }

  /**
   * Limpa todas as tarefas do localStorage
   * @static
   */
  static clearTodos() {
    try {
      localStorage.removeItem(Storage.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing todos from localStorage:', error);
      throw new Error('Failed to clear todos');
    }
  }

  /**
   * Verifica se há dados salvos
   * @static
   * @returns {boolean} True se houver dados salvos
   */
  static hasSavedTodos() {
    return localStorage.getItem(Storage.STORAGE_KEY) !== null;
  }

  /**
   * Salva preferência de tema
   * @static
   * @param {string} theme - Nome do tema ('light' ou 'dark')
   * @throws {Error} Se o tema for inválido
   */
  static saveTheme(theme) {
    try {
      if (!['light', 'dark'].includes(theme)) {
        throw new Error('Invalid theme');
      }
      localStorage.setItem(Storage.THEME_KEY, theme);
    } catch (error) {
      // Se for erro de validação, relançar como está
      if (error.message === 'Invalid theme') {
        throw error;
      }
      // Se for outro erro, wrap com mensagem genérica
      console.error('Error saving theme:', error);
      throw new Error('Failed to save theme');
    }
  }

  /**
   * Carrega preferência de tema
   * @static
   * @returns {string} Tema salvo ou 'light' como padrão
   */
  static loadTheme() {
    try {
      const theme = localStorage.getItem(Storage.THEME_KEY);
      return theme || 'light';
    } catch (error) {
      console.error('Error loading theme:', error);
      return 'light';
    }
  }

  /**
   * Exporta dados para backup em JSON
   * @static
   * @param {Array} todos - Array de tarefas
   * @returns {string} String JSON com os dados
   */
  static exportData(todos) {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        todos: todos,
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  /**
   * Importa dados de um backup JSON
   * @static
   * @param {string} jsonData - String JSON com dados
   * @returns {Array} Array de tarefas importadas
   * @throws {Error} Se o JSON for inválido
   */
  static importData(jsonData) {
    try {
      const importedData = JSON.parse(jsonData);
      if (!Array.isArray(importedData.todos)) {
        throw new Error('Invalid import format');
      }
      return importedData.todos;
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data - invalid format');
    }
  }
}

// Exporta para uso em testes (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}
