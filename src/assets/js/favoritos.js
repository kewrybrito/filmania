const apiKey = '1abf5fe580ef33d80c44d534b8e3b6d1';
const apiUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=';

const letterInput = document.getElementById('barra-pesquisa');
const searchBtn = document.getElementById('botao-pesquisa');
const moviesList = document.getElementById('movies-list');
const favoritesList = document.getElementById('favorites-list');

// Função para buscar filmes pela inicial
async function searchMoviesByInitial(initial) {
    if (!initial.trim()) return; // Evita a pesquisa com campo vazio

    try {
        const response = await fetch(apiUrl + encodeURIComponent(initial));
        const data = await response.json();

        moviesList.innerHTML = '';
        if (data.results && data.results.length > 0) {
            data.results.forEach(movie => {
                if (movie.title[0].toUpperCase() === initial.toUpperCase()) {
                    const movieElement = document.createElement('div');
                    movieElement.classList.add('movie-item');
                    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/180x250?text=Sem+Imagem';

                    movieElement.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="addToFavorites(${movie.id}, '${movie.title}', '${posterUrl}')">Adicionar aos Favoritos</button>
          `;
                    moviesList.appendChild(movieElement);
                }
            });
        } else {
            moviesList.innerHTML = '<p>Nenhum filme encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
    }
}

// Função para adicionar um filme aos favoritos
function addToFavorites(id, title, posterUrl) {
    const favoriteMovies = getFavoriteMovies();

    if (!favoriteMovies.some(movie => movie.id === id)) {
        favoriteMovies.push({ id, title, posterUrl });
        saveFavoriteMovies(favoriteMovies);
        renderFavorites();
    }
}

// Função para remover um filme dos favoritos
function removeFromFavorites(id) {
    const favoriteMovies = getFavoriteMovies();
    const updatedFavorites = favoriteMovies.filter(movie => movie.id !== id);
    saveFavoriteMovies(updatedFavorites);
    renderFavorites();
}

// Função para salvar os filmes favoritos no localStorage
function saveFavoriteMovies(movies) {
    localStorage.setItem('favoriteMovies', JSON.stringify(movies));
}

// Função para obter os filmes favoritos do localStorage
function getFavoriteMovies() {
    const movies = localStorage.getItem('favoriteMovies');
    return movies ? JSON.parse(movies) : [];
}

// Função para renderizar a lista de favoritos
function renderFavorites() {
    const favoriteMovies = getFavoriteMovies();
    favoritesList.innerHTML = '';

    favoriteMovies.forEach(movie => {
        const favoriteElement = document.createElement('div');
        favoriteElement.classList.add('favorite-item');
        favoriteElement.innerHTML = `
      <img src="${movie.posterUrl}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <button onclick="removeFromFavorites(${movie.id})">Remover dos Favoritos</button>
    `;
        favoritesList.appendChild(favoriteElement);
    });
}


    // Evento para pesquisa pela inicial ao clicar no botão
    searchBtn.addEventListener('click', () => {
        const initial = letterInput.value.trim();
        searchMoviesByInitial(initial);
    })

// Renderizar os favoritos ao carregar a página
renderFavorites();
    console.log(letterInput)
    console.log(searchBtn)