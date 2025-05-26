const apiKey = '1abf5fe580ef33d80c44d534b8e3b6d1';
//Url da api 
const apiUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=';


const letraDoInput = document.getElementById('barra-pesquisa');
console.log(letraDoInput);


const BuscaBtn = document.getElementById('botao-pesquisa');

const ListaDeFilmes = document.getElementById('movies-list');

const ListaDeFavoritos = document.getElementById('favorites-list');



// Função para buscar filmes pela inicial
async function ProcuraFilmesincial(inicial) {
    
    if (!inicial.trim()) return; // Evita a pesquisa com campo vazio

    try {
  
        const response = await fetch(apiUrl + encodeURIComponent(inicial));
        const data = await response.json();

        ListaDeFilmes.innerHTML = '';
        if (data.results && data.results.length > 0) {
            data.results.forEach(filme => {
                if (filme.title[0].toUpperCase() === inicial.toUpperCase()) {
                    const elementoFilme = document.createElement('div');
                    elementoFilme.classList.add('movie-item');
                    const posterUrl = filme.poster_path ? `https://image.tmdb.org/t/p/w500${filme.poster_path}` : 'https://via.placeholder.com/180x250?text=Sem+Imagem';

                    elementoFilme.innerHTML = `
            <img src="${posterUrl}" alt="${filme.title}">
            <h3>${filme.title}</h3>
            <button onclick="adicionaFavorito(${filme.id}, '${filme.title}', '${posterUrl}')">Adicionar aos Favoritos</button>
          `;
                    ListaDeFilmes.appendChild(elementoFilme);
                }
            });
        } else {
            ListaDeFilmes.innerHTML = '<p>Nenhum filme encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
    }
}

// Função para adicionar um filme aos favoritos
function adicionaFavorito(id, title, posterUrl) {
    const favoriteFilme = pegarFilmeFavorito();

    if (!favoriteFilme.some(filme => filme.id === id)) {
        favoriteFilme.push({ id, title, posterUrl });
        salvaFavorito(favoriteFilme);
        rederizarFavoritos();
    }
}
// function addToFavorites(id, title, posterUrl) {
//     const favoriteMovies = getFavoriteMovies();

//     if (!favoriteMovies.some(movie => movie.id === id)) {
//         favoriteMovies.push({ id, title, posterUrl });
//         saveFavoriteMovies(favoriteMovies);
//         renderFavorites();
//     }
// }

// Função para remover um filme dos favoritos
function removeDoFavoritos(id) {
    const favoriteFilmes = pegarFilmeFavorito();
    const carregarFilmes = favoriteFilmes.filter(filme => filme.id !== id);
    salvaFavorito(carregarFilmes);
    rederizarFavoritos();
}
// function removeFromFavorites(id) {
//     const favoriteMovies = getFavoriteMovies();
//     const updatedFavorites = favoriteMovies.filter(movie => movie.id !== id);
//     saveFavoriteMovies(updatedFavorites);
//     renderFavorites();
// }

// Função para salvar os filmes favoritos no localStorage
function salvaFavorito(filme) {
    localStorage.setItem('favoritos', JSON.stringify(filme));
}
// function saveFavoriteMovies(movies) {
//     localStorage.setItem('favoriteMovies', JSON.stringify(movies));
// }

// Função para obter os filmes favoritos do localStorage
function pegarFilmeFavorito() {
    const filme = localStorage.getItem('favoritos');
    return filme ? JSON.parse(filme) : [];
}
// function getFavoriteMovies() {
//     const movies = localStorage.getItem('favoriteMovies');
//     return movies ? JSON.parse(movies) : [];
// }







// Função para renderizar a lista de favoritos
// function renderFavorites() {
//     const favoriteMovies = getFavoriteMovies();
//     favoritesList.innerHTML = '';

//     favoriteMovies.forEach(movie => {
//         const favoriteElement = document.createElement('div');
//         favoriteElement.classList.add('favorite-item');
//         favoriteElement.innerHTML = `
//       <img src="${movie.posterUrl}" alt="${movie.title}">
//       <h3>${movie.title}</h3>
//       <button onclick="removeFromFavorites(${movie.id})">Remover dos Favoritos</button>
//     `;
//         favoritesList.appendChild(favoriteElement);
//     });
// }
function rederizarFavoritos() {
    const filmesfavoritos = pegarFilmeFavorito();
    ListaDeFavoritos.innerHTML = '';

    filmesfavoritos.forEach(filme => {

        const elementoFavorito = document.createElement('div');
        elementoFavorito.classList.add('favorite-item');
        elementoFavorito.innerHTML = `
      <img src="${filme.posterUrl}" alt="${filme.title}">
      <h3>${filme.title}</h3>
      <button onclick=" removeDoFavoritos(${filme.id})">Remover dos Favoritos</button>
    `;
        ListaDeFavoritos.appendChild(elementoFavorito);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const btnLimpa = document.getElementById('botao-limpar');
    if (btnLimpa) {
        btnLimpa.addEventListener('click', () => {
            // Por exemplo, limpe o campo ou remova a lista de filmes
            BuscaBtn.value = '';
            ListaDeFilmes.remove();
        });
    } else {
        console.error("Elemento 'botao-limpar' não encontrado.");
    }

    if (BuscaBtn) {
        BuscaBtn.addEventListener('click', () => {
            const inicial = letraDoInput.value.trim();
            ProcuraFilmesincial(inicial);
        });
    } else {
        console.error("Elemento 'botao-pesquisa' não encontrado.");
    }

    // Renderizar favoritos ao carregar a página
    rederizarFavoritos();
});







