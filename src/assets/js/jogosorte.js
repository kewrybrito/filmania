
const apiKey = '1abf5fe580ef33d80c44d534b8e3b6d1';

async function sortearFilme() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;
    
    try {
    const response = await fetch(url);
    const data = await response.json();
    const filmes = data.results;

    const sorteado = filmes[Math.floor(Math.random() * filmes.length)];
    const poster = `https://image.tmdb.org/t/p/w500${sorteado.poster_path}`;

    document.getElementById('result').innerHTML = `
      <p class="movie-title">🎬 ${sorteado.title}</p>
      <img src="${poster}" alt="Poster de ${sorteado.title}">
      <p class="overview">${sorteado.overview}</p>
    `;
  } catch (error) {
    document.getElementById('result').innerHTML = "Erro ao carregar filme. Tente novamente mais tarde.";
    console.error("Erro:", error);
  }

console.log("Arquivo JS carregado com sucesso!");

}

