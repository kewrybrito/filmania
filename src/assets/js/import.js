
window.addEventListener('DOMContentLoaded', () => {

    fetch('components/cabecalho.html')  
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
  