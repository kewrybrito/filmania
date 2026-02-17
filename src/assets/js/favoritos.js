// ======================= Configurações Iniciais =======================

// Chave de acesso à API do The Movie Database (TMDb)
const apiKey = '1abf5fe580ef33d80c44d534b8e3b6d1';

// URL da API de busca de filmes, utilizando a chave e aguardando o parâmetro de consulta (query)
const apiUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=';

// Seleciona o input onde o usuário digita sua pesquisa (identificado por "barra-pesquisa")
const letraDoInput = document.getElementById('barra-pesquisa');
// Exibe no console o input para confirmar que o elemento foi selecionado corretamente
console.log(letraDoInput);

// Seleciona o botão de busca (identificado por "botao-pesquisa")
const BuscaBtn = document.getElementById('botao-pesquisa');

// Seleciona a área onde os filmes serão listados (identificado por "movies-list")
const ListaDeFilmes = document.getElementById('movies-list');

// Seleciona a área onde os filmes favoritos serão listados (identificado por "favorites-list")
const ListaDeFavoritos = document.getElementById('favorites-list');


// ======================= Função de Busca de Filmes =======================

/**
 * Busca filmes cuja primeira letra do título coincide com a busca realizada.
 * @param {string} inicial - Letra ou conjunto de caracteres digitados para a busca.
 */
async function ProcuraFilmesincial(inicial) {

    // Se o input estiver vazio (apenas espaços), não realiza a busca.
    if (!inicial.trim()) return;

    try {
        // Concatena a URL da API com a string de pesquisa codificada para evitar problemas com caracteres especiais
        const response = await fetch(apiUrl + encodeURIComponent(inicial));
        // Converte a resposta em formato JSON
        const data = await response.json();

        // Limpa o conteúdo atual da lista de filmes
        ListaDeFilmes.innerHTML = '';

        // Verifica se a API retornou resultados e se o array de resultados não está vazio
        if (data.results && data.results.length > 0) {
            // Itera sobre cada filme retornado
            data.results.forEach(filme => {
                // Confere se a primeira letra do título do filme (convertida para maiúscula)
                // é igual à letra pesquisada também em maiúscula
                if (filme.title[0].toUpperCase() === inicial.toUpperCase()) {
                    // Cria um novo elemento para representar o filme
                    const elementoFilme = document.createElement('div');
                    // Adiciona a classe 'movie-item' para aplicação de estilos via CSS
                    elementoFilme.classList.add('movie-item');
                    // Define a URL do poster do filme. Se não houver poster, utiliza uma imagem de placeholder.
                    const posterUrl = filme.poster_path
                        ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                        : "https://placehold.co/180x250?text=Sem+Imagem";

                    // Monta o conteúdo HTML do card do filme, incluindo:
                    // - A imagem (poster)
                    // - O título
                    // - Um botão para adicionar o filme aos favoritos, passando seus dados para a função correspondente
                    elementoFilme.innerHTML = `
                        <img src="${posterUrl}" alt="${filme.title}">
                        <h3>${filme.title}</h3>
                        <button class="bt-add-fav" id = "link-favoritos"onclick="adicionaFavorito(${filme.id}, '${filme.title}', '${posterUrl}')">
                          Adicionar aos Favoritos
                        </button>
                    `;

                    // Adiciona o card do filme à lista de filmes exibida na página
                    ListaDeFilmes.appendChild(elementoFilme);
                }
            });
        } else {
            // Caso nenhum filme seja encontrado, exibe uma mensagem na área de resultados
            ListaDeFilmes.innerHTML = '<p>Nenhum filme encontrado.</p>';
        }
    } catch (error) {
        // Caso ocorra um erro na requisição, exibe o erro no console para facilitar a depuração
        console.error('Erro ao buscar filmes:', error);
    }
}


// ======================= Funções de Favoritos =======================

/**
 * Adiciona um filme aos favoritos, salvando suas informações no localStorage.
 * @param {number} id - ID do filme.
 * @param {string} title - Título do filme.
 * @param {string} posterUrl - URL do poster do filme.
 */
function adicionaFavorito(id, title, posterUrl) {
    
    // Recupera a lista atual de filmes favoritos armazenados
    const favoriteFilme = pegarFilmeFavorito();

    // Se o filme não estiver na lista, adiciona-o
    if (!favoriteFilme.some(filme => filme.id === id)) {
        favoriteFilme.push({ id, title, posterUrl });
        // Atualiza o localStorage com a nova lista de favoritos
        salvaFavorito(favoriteFilme);
        // Re-renderiza a lista de favoritos na página
        rederizarFavoritos();
     
    }
}
/**
 * Remove um filme da lista de favoritos com base no seu ID.
 * @param {number} id - ID do filme a ser removido.
 */
function removeDoFavoritos(id) {
    // Recupera os filmes favoritos atualmente salvos
    const favoriteFilmes = pegarFilmeFavorito();
    // Cria uma nova lista filtrada removendo o filme com o ID especificado
    const carregarFilmes = favoriteFilmes.filter(filme => filme.id !== id);
    // Atualiza o localStorage com a lista filtrada
    salvaFavorito(carregarFilmes);
     
    // Atualiza a renderização dos favoritos na interface
    rederizarFavoritos();


}
/**
 * Salva o array de filmes favoritos no localStorage.
 * @param {Array} filme - Array de objetos representando os filmes favoritos.
 */
function salvaFavorito(filme) {
    localStorage.setItem('favoritos', JSON.stringify(filme));
}
/**
 * Recupera os filmes favoritos salvos no localStorage.
 * @returns {Array} - Retorna um array com os filmes favoritos. Caso não haja, retorna um array vazio.
 */
function pegarFilmeFavorito() {
    const filme = localStorage.getItem('favoritos');
    return filme ? JSON.parse(filme) : [];
}
/**
 * Renderiza a lista de filmes favoritos na área designada da página.
 */
function rederizarFavoritos() {
   
    // Recupera os filmes favoritos salvos
    const filmesfavoritos = pegarFilmeFavorito();
    // Limpa o conteúdo atual da lista de favoritos
    ListaDeFavoritos.innerHTML = '';

    // Para cada filme favorito, cria um card com informações e botão para remoção
    filmesfavoritos.forEach(filme => {
        // Cria um novo elemento para o item favorito
        const elementoFavorito = document.createElement('div');
        // Adiciona a classe para estilização
        elementoFavorito.classList.add('favorite-item');
        // Define o conteúdo HTML do card, incluindo a imagem, título e botão para remover
        elementoFavorito.innerHTML = `
            <img src="${filme.posterUrl}" alt="${filme.title}">
            <h3>${filme.title}</h3>
            <button onclick="removeDoFavoritos(${filme.id})">
              Remover dos Favoritos
            </button>
        `;
        // Adiciona o item favorito à lista exibida na página
        ListaDeFavoritos.appendChild(elementoFavorito);
    });
}


// ======================= Eventos do DOM =======================

document.addEventListener("DOMContentLoaded", () => {
    // Seleciona o botão de limpar pesquisa através do seu ID
    const btnLimpa = document.getElementById('botao-limpar');

    // Se o botão de limpar for encontrado, adiciona um evento de clique
    if (btnLimpa) {
        btnLimpa.addEventListener('click', () => {
            // Limpa o valor do botão de pesquisa (observe que pode ser necessário limpar o input, se for o caso)
            BuscaBtn.value = '';
            // Remove o elemento que contém a lista de filmes atualmente exibida na página
            ListaDeFilmes.remove();
        });
    } else {
        console.error("Elemento 'botao-limpar' não encontrado.");
    }

    // Verifica se o botão de pesquisa foi devidamente selecionado
    if (BuscaBtn) {
        // Adiciona um evento de clique para realizar a busca dos filmes
        BuscaBtn.addEventListener('click', () => {
            // Obtém o valor digitado pelo usuário e remove espaços em branco das extremidades
            const inicial = letraDoInput.value.trim();
            // Chama a função de busca passando o valor digitado pelo usuário
            ProcuraFilmesincial(inicial);
        });
    } else {
        console.error("Elemento 'botao-pesquisa' não encontrado.");
    }

    // Renderiza os filmes favoritos já salvos ao carregar a página
    rederizarFavoritos();
});
