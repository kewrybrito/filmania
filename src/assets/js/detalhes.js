const apiKey = '1abf5fe580ef33d80c44d534b8e3b6d1';
const conteudo = document.getElementById('conteudo-detalhes');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const tipo = params.get('tipo'); // movie ou tv

async function carregarDetalhes() {
  try {
    const url = `https://api.themoviedb.org/3/${tipo}/${id}?api_key=${apiKey}&language=pt-BR`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    const titulo = dados.title || dados.name;
    const imagem = dados.poster_path 
      ? `https://image.tmdb.org/t/p/w400${dados.poster_path}`
      : 'https://via.placeholder.com/400x600?text=Sem+Imagem';

    // Puxa trailer
    const trailerURL = await buscarTrailer(id, tipo);

    conteudo.innerHTML = `
      <div class="lado-a">
        <h1 class="titulo-filme">${titulo}</h1>
        <img src="${imagem}" alt="${titulo}" class="img-filme">
      </div>
      <div class="lado-b">
        <p><strong>Sinopse:</strong> ${dados.overview}</p><br>
        <p><strong>Nota:</strong> ${dados.vote_average}</p><br>
        <p><strong>Data de lançamento:</strong> ${mudarData(dados.release_date || dados.first_air_date)}</p><br>
        <div class="trailer-container">
          ${trailerURL ? `
            <button class="ver-trailer-btn" onclick="abrirModal('${trailerURL}')">Assistir Trailer</button>
          ` : '<p>Trailer não disponível.</p>'}
        </div>

        <!-- Modal do trailer -->
        <div id="modalTrailer" class="modal">
          <div class="modal-conteudo">
            <span class="fechar" onclick="fecharModal()">&times;</span>
            <iframe id="iframeTrailer" src="" frameborder="0" allowfullscreen class="trailer-frame"></iframe>
          </div>
        </div>


        <div class="icons-filmes">
          <div>
            <a href="#"><img src="/src/assets/img/salvar-2.png" alt=""> Adicionar nos Favoritos</a>
          </div>     
        </div>
      </div>
    `;
  } catch (erro) {
    console.error('Erro ao carregar detalhes:', erro);
    conteudo.innerHTML = `<p>Erro ao carregar informações.</p>`;
  }
}

async function buscarTrailer(id, tipo) {
  const urlTrailer = `https://api.themoviedb.org/3/${tipo}/${id}/videos?api_key=${apiKey}&language=pt-BR`;
  const resposta = await fetch(urlTrailer);
  const dados = await resposta.json();

  // Procura pelo primeiro trailer do YouTube
  const trailer = dados.results.find(video => 
    video.type === 'Trailer' && video.site === 'YouTube'
  );

  return trailer ? trailer.key : null;
}

function abrirModal(videoKey) {
  const modal = document.getElementById('modalTrailer');
  const iframe = document.getElementById('iframeTrailer');
  iframe.src = `https://www.youtube.com/embed/${videoKey}?autoplay=1`;
  modal.style.display = 'flex';
}

function fecharModal() {
  const modal = document.getElementById('modalTrailer');
  const iframe = document.getElementById('iframeTrailer');
  iframe.src = '';
  modal.style.display = 'none';
}

function mudarData(dataString) {
  if (!dataString) return 'Data não disponível';
  const [ano, mes, dia] = dataString.split('-');
  return `${dia}/${mes}/${ano}`;
}



document.addEventListener('DOMContentLoaded', carregarDetalhes);
