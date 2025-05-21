// Ao carregar a página, dispara uma função
window.addEventListener('DOMContentLoaded', () => {
  
  // Obtém o caminho da URL atual
  const path = window.location.pathname;
  
  // Define o caminho do cabeçalho com base na estrutura de diretórios
  const basePath = path.includes('/pages/') ? '../components/cabecalho.html' : './components/cabecalho.html';
  
  // Faz uma requisição para carregar o arquivo do cabeçalho
  fetch(basePath)
    .then(response => {
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Erro ao carregar o cabeçalho');
      }
      return response.text(); // Converte a resposta para texto
    })
    .then(data => {
      // Insere o conteúdo do cabeçalho no elemento com ID "header"
      document.getElementById('header').innerHTML = data;
    })
    .catch(error => {console.error('Erro:', error)}); // Captura e exibe erros no console

// Executa a mesma lógica para carregar o rodapé
window.addEventListener('DOMContentLoaded', () => {

  // Obtém o caminho da URL atual
  const path = window.location.pathname;

  // Define o caminho do rodapé com base na estrutura de diretórios
  const basePath = path.includes('/pages/') ? '../components/rodape.html' : './components/rodape.html';

  // Faz uma requisição para carregar o arquivo do rodapé
  fetch(basePath)
    .then(response => {
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Erro ao carregar o rodapé');
      }
      return response.text(); // Converte a resposta para texto
    })
    .then(data => {
      // Insere o conteúdo do rodapé no elemento com ID "footer"
      document.getElementById('footer').innerHTML = data;
    })
    .catch(error=> console.error('Erro:', error)); // Captura e exibe erros no console
})
});
