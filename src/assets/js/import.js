window.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const basePath = path.includes('/pages/') ? '../components/cabecalho.html' : './components/cabecalho.html';

  fetch(basePath)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar o cabeçalho');
      }
      return response.text();
    })
    .then(data => {
      document.getElementById('header').innerHTML = data;
    })
    .catch(error => console.error('Erro:', error));
});


window.addEventListener('DOMContentLoaded', () => {

  fetch('../components/rodape.html')  
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar o cabeçalho');
      }
      return response.text();
    })
    .then(data => {
      document.getElementById('footer').innerHTML = data;  
    })
    .catch(error => console.error('Erro:', error));
});

