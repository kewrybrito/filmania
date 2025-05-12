const apiKey = '1abf5fe580ef33d80c44d534b8e3b6d1';
const conteudo = document.getElementById('conteudo-detalhes');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const tipo = params.get('tipo'); // movie ou tv

async function carregarDetalhes() {
  const url = `https://api.themoviedb.org/3/${tipo}/${id}?api_key=${apiKey}&language=pt-BR`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    const titulo = dados.title || dados.name;
    const imagem = dados.poster_path 
      ? `https://image.tmdb.org/t/p/w400${dados.poster_path}`
      : 'https://via.placeholder.com/400x600?text=Sem+Imagem';

    conteudo.innerHTML = `
    <div class="lado-a">
      <h1 class="titulo-filme">${titulo}</h1>
      <img src="${imagem}" alt="${titulo}" class="img-filme">
    </div>
    <div class="lado-b">
      <p><strong>Sinopse:</strong> ${dados.overview}</p> <br>
      <p><strong>Nota:</strong> ${dados.vote_average}</p>
      <p><strong>Data de lançamento:</strong> ${dados.release_date || dados.first_air_date}</p>
    </div>
    `;
  } catch (erro) {
    console.error('Erro ao carregar detalhes:', erro);
    conteudo.innerHTML = `<p>Erro ao carregar informações.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', carregarDetalhes);
