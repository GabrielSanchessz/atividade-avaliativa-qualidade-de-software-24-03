/**
 * Application Initialize
 * Ponto de entrada da aplicação - orquestra a inicialização
 */

// Aguarda o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Carrega dados salvos do localStorage
    const savedTodos = Storage.loadTodos();

    // Inicializa o gerenciador de tarefas
    const todoManager = new TodoManager(savedTodos);

    // Inicializa o controlador de UI
    const ui = new UI(todoManager, Storage);

    // Inicia a aplicação
    ui.init();

    console.info('✅ Aplicação iniciada com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar a aplicação:', error);
    // Exibe erro minimal ao usuário
    const errorEl = document.getElementById('errorMessage');
    if (errorEl) {
      errorEl.textContent =
        'Erro ao carregar a aplicação. Atualize a página.';
      errorEl.classList.add('show');
    }
  }
});

// Global error handler
window.addEventListener('error', (event) => {
  console.error('❌ Erro global:', event.error);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promise rejeitada não tratada:', event.reason);
});
