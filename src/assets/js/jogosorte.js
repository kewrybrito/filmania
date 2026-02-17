// Chave de acesso para a API do TMD
const apiKey = '1abf5fe580ef33d80c44d534b8e3b6d1';

const btn = document.getElementById('btn-sortear');
document.addEventListener('DOMContentLoaded',()=>{

  btn.addEventListener('click',()=>{
    sortearFilme();
  })
  
})
async function sortearFilme() {
// Função assíncrona que busca e exibe um filme aleatório dentre os filmes populares
// Monta a URL de requisição para buscar filmes populares,
// especificando o idioma (pt-BR) e a página (1) dos resultados
const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;

  try {
    // Realiza a requisição à API usando fetch e aguarda a resposta
    const response = await fetch(url);
    // Converte a resposta recebida para o formato JSON
    const data = await response.json();
    // Obtém o array de filmes a partir da chave 'results'
    const filmes = data.results;

    // Seleciona aleatoriamente um filme da lista utilizando um índice randomizado
    const sorteado = filmes[Math.floor(Math.random() * filmes.length)];
    // Cria a URL completa para o poster do filme usando o caminho retornado pela API
    const poster = `https://image.tmdb.org/t/p/w500${sorteado.poster_path}`;

    // Atualiza o conteúdo do elemento com id "result" com informações do filme sorteado:
    // - Título do filme (precedido de um ícone)
    // - Imagem do poster
    // - Sinopse do filme
    document.getElementById('result').innerHTML = `
          <p class="movie-title">🎬 ${sorteado.title}</p>
          <img src="${poster}" alt="Poster de ${sorteado.title}">
          <p class="overview">${sorteado.overview}</p>
        `;
  } catch (error) {
    // Caso ocorra algum erro durante a requisição à API, exibe uma mensagem de erro
    // e registra o erro no console para fins de depuração
    document.getElementById('result').innerHTML = "Erro ao carregar filme. Tente novamente mais tarde.";
    console.error("Erro:", error);
  }

}
