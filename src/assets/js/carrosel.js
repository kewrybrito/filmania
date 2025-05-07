const carrossel = document.getElementById('carrossel-populares');
const apiKey = '1abf5fe580ef33d80c44d534b8e3b6d1'; 
const setaEsquerda = document.querySelector('.seta-img.esquerda');
const setaDireita = document.querySelector('.seta-img.direita');


async function carregarPopulares() {
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=pt-BR`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    dados.results.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('card');

      const imagem = item.poster_path 
        ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
        : 'https://via.placeholder.com/300x450?text=Sem+Imagem';

      card.innerHTML = `
        <img src="${imagem}" alt="${item.title || item.name}">
        <div class="card-title">${item.title || item.name}</div>
      `;

      carrossel.appendChild(card);
    });
  } catch (erro) {
    console.error('Erro ao carregar populares:', erro);
  }
}

setaEsquerda.addEventListener('click', () => {
    carrossel.scrollBy({ left: -300, behavior: 'smooth' });
});
  
  setaDireita.addEventListener('click', () => {
    carrossel.scrollBy({ left: 300, behavior: 'smooth' });
});

document.addEventListener('DOMContentLoaded', carregarPopulares);
