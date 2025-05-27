// Pegando o elemento do carrossel pelos seus ID no HTML
const carrossel = document.getElementById('carrossel-populares');

// Chave da API do The Movie Database (TMDb)
const apiKey = '1abf5fe580ef33d80c44d534b8e3b6d1';

// Seleciona o elemento da seta esquerda (usada para rolar o carrossel para a esquerda)
const setaEsquerda = document.querySelector('.seta-img.esquerda');

// Seleciona o elemento da seta direita (usada para rolar o carrossel para a direita)
const setaDireita = document.querySelector('.seta-img.direita');

// Função assíncrona que carrega os itens populares da semana
async function carregarPopulares() {
  // Define a URL da API para buscar os itens em alta desta semana, com filtro de idioma para português
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=pt-BR`;
  
  try {
    // Realiza a requisição para a API
    const resposta = await fetch(url);
    // Converte a resposta para objeto JSON
    const dados = await resposta.json();

    // Loop para percorrer cada item retornado da API
    dados.results.forEach(item => {
      // Cria um novo elemento 'div' que representará o card do item
      const card = document.createElement('div');
      // Adiciona a classe 'card' para estilização
      card.classList.add('card');

      // Define a URL da imagem do card. Se não houver imagem, utiliza um placeholder.
      const imagem = item.poster_path 
        ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
        : 'https://via.placeholder.com/300x450?text=Sem+Imagem';

      // Monta o conteúdo HTML do card, que inclui:
      // - Um link para a página de detalhes, passando o id e tipo do item via query string.
      // - Uma imagem e o título do filme/série.
      card.innerHTML = ` 
        <a href="pages/detalhes.html?id=${item.id}&tipo=${item.media_type}" style="text-decoration: none;">
          <img src="${imagem}" alt="${item.title || item.name}">
          <div class="card-title">${item.title || item.name}</div>
        </a>
      `;

      // Adiciona o card criado ao elemento do carrossel
      carrossel.appendChild(card);
    });
  } catch (erro) {
    // Se ocorrer algum erro na requisição ou processamento, exibe o erro no console para depuração
    console.error('Erro ao carregar populares:', erro);
  }
}

// Adiciona um listener para o clique na seta esquerda
setaEsquerda.addEventListener('click', () => {
  // Rola o carrossel 300 pixels para a esquerda com efeito suave
  carrossel.scrollBy({ left: -300, behavior: 'smooth' });
});

// Adiciona um listener para o clique na seta direita
setaDireita.addEventListener('click', () => {
  // Rola o carrossel 300 pixels para a direita com efeito suave
  carrossel.scrollBy({ left: 300, behavior: 'smooth' });
});

// Ao carregar o conteúdo do DOM, chama a função que busca e exibe os populares
document.addEventListener('DOMContentLoaded', carregarPopulares);
