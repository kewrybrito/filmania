// Chave da API do The Movie Database (TMDb)
const apiKey = '1abf5fe580ef33d80c44d534b8e3b6d1';

// Seleciona o elemento do DOM onde os detalhes serão exibidos
const conteudo = document.getElementById('conteudo-detalhes');

// Extrai os parâmetros da URL (por exemplo, ?id=123&tipo=movie) e os armazena em variáveis
const params = new URLSearchParams(window.location.search);
const id = Number(params.get('id')); // Converte o id para Number, garantindo o tipo correto
const tipo = params.get('tipo'); // Pode ser "movie" ou "tv"

// ======================= Funções de Favoritos =========================

// Salva o array de filmes favoritos no localStorage após convertê-lo para JSON
function salvaFavorito(filmes) {
  localStorage.setItem('favoritos', JSON.stringify(filmes));
}

// Recupera os filmes favoritos do localStorage e converte-os de volta para um array
function pegarFilmeFavorito() {
  const filmes = localStorage.getItem('favoritos');
  return filmes ? JSON.parse(filmes) : [];
}

// Adiciona um filme aos favoritos se ele ainda não estiver presente e atualiza o botão
function adicionaFavorito(id, title, posterUrl) {
  const favoritos = pegarFilmeFavorito();
  // Verifica se o filme já está na lista de favoritos
  if (!favoritos.some(filme => filme.id === id)) {
    favoritos.push({ id, title, posterUrl });
    salvaFavorito(favoritos);
    atualizarBotaoFavorito(true);
  }
}

// Remove um filme dos favoritos e atualiza o botão
function removeDoFavoritos(id) {
  const favoritos = pegarFilmeFavorito();
  // Filtra a lista removendo o filme com o id especificado
  const atualizados = favoritos.filter(filme => filme.id !== id);
  salvaFavorito(atualizados);
  atualizarBotaoFavorito(false);
}

// Verifica se um filme (através do id) já está nos favoritos
function estaNosFavoritos(id) {
  const favoritos = pegarFilmeFavorito();
  return favoritos.some(filme => filme.id === id);
}

// ======================= Carregar Detalhes =========================

// Função assíncrona que carrega os detalhes do filme ou série a partir da API
async function carregarDetalhes() {
  try {
    // Monta a URL da API usando o id, tipo e a chave, definindo o idioma para português
    const url = `https://api.themoviedb.org/3/${tipo}/${id}?api_key=${apiKey}&language=pt-BR`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    // Define o título (para filmes é "title" e para séries é "name")
    const titulo = dados.title || dados.name;
    // Define a URL da imagem, ou um placeholder caso não possua imagem
    const imagem = dados.poster_path
      ? `https://image.tmdb.org/t/p/w400${dados.poster_path}`
      : 'https://via.placeholder.com/400x600?text=Sem+Imagem';

    // Busca a URL do trailer (se disponível)
    const trailerURL = await buscarTrailer(id, tipo);

    // Verifica se o filme já está favoritado para alterar o texto do botão
    const jaFavoritado = estaNosFavoritos(dados.id);

    // Atualiza o conteúdo da página com os detalhes do filme/série
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

        <!-- Modal do trailer: aparece ao clicar no botão 'Assistir Trailer' -->
        <div id="modalTrailer" class="modal">
          <div class="modal-conteudo">
            <span class="fechar" onclick="fecharModal()">&times;</span>
            <iframe id="iframeTrailer" src="" frameborder="0" allowfullscreen class="trailer-frame"></iframe>
          </div>
        </div>

        <div class="icons-filmes">
          <div>
            <!-- Botão de favoritos, com texto dinâmico de acordo com o estado atual -->
            <button id="botao-favorito" class="add-filmes">
              <img src="/src/assets/img/salvar-2.png" alt="">
              ${jaFavoritado ? 'Remover dos Favoritos' : 'Adicionar nos Favoritos'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Seleciona o botão de favoritos que foi inserido e adiciona o evento de clique
    const botaoFavorito = document.getElementById('botao-favorito');
    botaoFavorito.addEventListener('click', () => {
      // Alterna a ação: remove se já estiver favoritado ou adiciona caso contrário
      if (estaNosFavoritos(dados.id)) {
        removeDoFavoritos(dados.id);
      } else {
        adicionaFavorito(dados.id, titulo, imagem);
      }
    });

  } catch (erro) {
    // Em caso de erro (ex.: problemas na requisição), exibe uma mensagem no console e na página
    console.error('Erro ao carregar detalhes:', erro);
    conteudo.innerHTML = `<p>Erro ao carregar informações.</p>`;
  }
}

// ======================= Trailer =========================

// Função assíncrona que busca a chave do trailer no YouTube através da API
async function buscarTrailer(id, tipo) {
  // Monta a URL da API para buscar os vídeos relacionados ao filme/série
  const urlTrailer = `https://api.themoviedb.org/3/${tipo}/${id}/videos?api_key=${apiKey}&language=pt-BR`;
  const resposta = await fetch(urlTrailer);
  const dados = await resposta.json();

  // Procura o primeiro vídeo que seja do tipo "Trailer" e da plataforma "YouTube"
  const trailer = dados.results.find(video =>
    video.type === 'Trailer' && video.site === 'YouTube'
  );

  // Retorna a chave do trailer ou null se não estiver disponível
  return trailer ? trailer.key : null;
}

// Abre o modal para reproduzir o trailer, definindo o src do iframe
function abrirModal(videoKey) {
  const modal = document.getElementById('modalTrailer');
  const iframe = document.getElementById('iframeTrailer');
  // Insere a URL do trailer com o autoplay
  iframe.src = `https://www.youtube.com/embed/${videoKey}?autoplay=1`;
  modal.style.display = 'flex';
}

// Fecha o modal do trailer e limpa o src do iframe para parar a reprodução
function fecharModal() {
  const modal = document.getElementById('modalTrailer');
  const iframe = document.getElementById('iframeTrailer');
  iframe.src = '';
  modal.style.display = 'none';
}

// ======================= Utilidades =========================

// Função para formatar a data de "YYYY-MM-DD" para o formato "DD/MM/YYYY"
function mudarData(dataString) {
  if (!dataString) return 'Data não disponível';
  const [ano, mes, dia] = dataString.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Atualiza o texto do botão de favoritos de acordo com o estado atual (favoritado ou não)
function atualizarBotaoFavorito(estaFavorito) {
  const botaoFavorito = document.getElementById('botao-favorito');
  if (botaoFavorito) {
    botaoFavorito.innerHTML = `
      <img src="/src/assets/img/salvar-2.png" alt="">
      ${estaFavorito ? 'Remover dos Favoritos' : 'Adicionar nos Favoritos'}
    `;
  }
}

// Ao carregar o conteúdo do DOM, inicia a função que carrega os detalhes do filme ou série
document.addEventListener('DOMContentLoaded', carregarDetalhes);
