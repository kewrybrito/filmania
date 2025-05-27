    // Ao carregar a página, dispara uma função
    
    // Obtém o caminho da URL atual
  const path = window.location.pathname;

  // Define o caminho do cabeçalho com base na estrutura de diretórios
  const basePath = path.includes('/pages/') ? '../components/cabecalho.html' : './components/cabecalho.html';

  // Faz uma requisição para carregar o arquivo do cabeçalho
  fetch(basePath)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar o cabeçalho');
      }
      return response.text(); // Converte a resposta para texto
    })
    .then(data => {
      // Insere o conteúdo do cabeçalho no elemento com ID "header"
      document.getElementById('header').innerHTML = data;
   
      // ⚠️ Chama a função só depois que o cabeçalho for carregado
      verificarUsuarioLogado();
    })
    .catch(error => {
      console.error('Erro:', error)})
        
  // Função para trocar botão "Entrar" por ícone se o usuário estiver logado
  function verificarUsuarioLogado() {
    const userLogado = JSON.parse(localStorage.getItem('userLogado'));
    const token = localStorage.getItem('token');

    if (userLogado && token) {
      const nome = userLogado.nome;

      const botao = document.querySelector('.botao-cabecalho');
      if (botao) {
        // Cria um contêiner para o nome e o botão sair
        const userContainer = document.createElement('div');
        userContainer.className = 'usuario-logado';

        const nomeSpan = document.createElement('span');
        nomeSpan.className = 'nome-usuario';
        nomeSpan.innerHTML = `Olá! ${nome}`;

        const botaoSair = document.createElement('button');
        botaoSair.className = 'botao-sair';
        botaoSair.textContent = 'Sair';
        botaoSair.onclick = () => {
          localStorage.removeItem('token');
          localStorage.removeItem('userLogado');
          location.reload();
          localStorage.removeItem('favoritos'); // recarrega a página e volta o botão Entrar
        };

        userContainer.appendChild(nomeSpan);// ======================= Configurações Iniciais =======================

        // Chave de acesso à API do The Movie Database (TMDb)
        const apiKey = '1abf5fe580ef33d80c44d534b8e3b6d1';

        // URL base para a busca de filmes, combinando a chave da API com o parâmetro de consulta (query)
        const apiUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=';

        // Seleciona o input onde o usuário digita a pesquisa
        const letraDoInput = document.getElementById('barra-pesquisa');
        // Exibe no console o elemento para confirmar sua obtenção correta
        console.log(letraDoInput);

        // Seleciona o botão que inicia a busca (identificado por "botao-pesquisa")
        const BuscaBtn = document.getElementById('botao-pesquisa');

        // Seleciona a área (container) onde os resultados dos filmes serão exibidos
        const ListaDeFilmes = document.getElementById('movies-list');

        // Seleciona a área onde os filmes marcados como favoritos serão listados
        const ListaDeFavoritos = document.getElementById('favorites-list');


        // ======================= Função de Busca de Filmes =======================

        /**
         * Busca filmes cuja primeira letra do título coincide com o termo pesquisado.
         * @param {string} inicial - Texto digitado pelo usuário para pesquisa.
         */
        async function ProcuraFilmesincial(inicial) {

          // Verifica se o termo pesquisado não está vazio (evitando buscas desnecessárias)
          if (!inicial.trim()) return;

          try {
            // Realiza a requisição para a API, concatenando a URL base com o termo codificado,
            // o que garante que caracteres especiais sejam tratados corretamente.
            const response = await fetch(apiUrl + encodeURIComponent(inicial));
            // Converte a resposta da API para o formato JSON
            const data = await response.json();

            // Limpa a área de exibição dos filmes para preparar a listagem de novos resultados
            ListaDeFilmes.innerHTML = '';

            // Verifica se a API retornou resultados e se o array não está vazio
            if (data.results && data.results.length > 0) {
              // Itera sobre cada filme retornado pela requisição
              data.results.forEach(filme => {
                // Verifica se a primeira letra do título do filme (em maiúsculas) confere com a letra pesquisada
                if (filme.title[0].toUpperCase() === inicial.toUpperCase()) {
                  // Cria um novo elemento <div> para representar o item (card) do filme
                  const elementoFilme = document.createElement('div');
                  // Adiciona uma classe CSS para permitir estilização
                  elementoFilme.classList.add('movie-item');

                  // Define a URL para o poster do filme.
                  // Se o poster não estiver disponível, utiliza uma imagem placeholder
                  const posterUrl = filme.poster_path
                    ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                    : 'https://via.placeholder.com/180x250?text=Sem+Imagem';

                  // Configura o conteúdo HTML do card, que inclui:
                  // - A imagem do filme
                  // - O título
                  // - Um botão para adicionar o filme aos favoritos, passando os parâmetros necessários
                  elementoFilme.innerHTML = `
                                <img src="${posterUrl}" alt="${filme.title}">
                                <h3>${filme.title}</h3>
                                <button onclick="adicionaFavorito(${filme.id}, '${filme.title}', '${posterUrl}')">
                                  Adicionar aos Favoritos
                                </button>
                            `;

                  // Adiciona o card à lista de filmes exibida na interface
                  ListaDeFilmes.appendChild(elementoFilme);
                }
              });
            } else {
              // Se nenhum filme for encontrado, exibe uma mensagem informativa
              ListaDeFilmes.innerHTML = '<p>Nenhum filme encontrado.</p>';
            }
          } catch (error) {
            // Caso ocorra algum erro durante a busca, loga o erro no console
            console.error('Erro ao buscar filmes:', error);
          }
        }


        // ======================= Funções de Favoritos =======================

        /**
         * Adiciona um filme à lista de favoritos e atualiza o armazenamento local.
         * @param {number} id - ID do filme.
         * @param {string} title - Título do filme.
         * @param {string} posterUrl - URL do poster do filme.
         */
        function adicionaFavorito(id, title, posterUrl) {
          // Obtém a lista existente de filmes favoritos do localStorage
          const favoriteFilme = pegarFilmeFavorito();

          // Verifica se o filme já não foi adicionado aos favoritos
          if (!favoriteFilme.some(filme => filme.id === id)) {
            // Se o filme não estiver na lista, adiciona-o
            favoriteFilme.push({ id, title, posterUrl });
            // Atualiza o localStorage com a lista modificada
            salvaFavorito(favoriteFilme);
            // Atualiza a interface para refletir o novo estado dos favoritos
            rederizarFavoritos();
          }
        }

        /**
         * Remove um filme da lista de favoritos com base no ID e atualiza o localStorage.
         * @param {number} id - ID do filme a ser removido.
         */
        function removeDoFavoritos(id) {
          // Recupera a lista atual de favoritos
          const favoriteFilmes = pegarFilmeFavorito();
          // Cria uma nova lista que filtra o filme com o ID especificado
          const carregarFilmes = favoriteFilmes.filter(filme => filme.id !== id);
          // Atualiza o localStorage com a nova lista filtrada
          salvaFavorito(carregarFilmes);
          // Re-renderiza a área de favoritos para refletir a remoção
          rederizarFavoritos();
        }

        /**
         * Salva a lista de filmes favoritos no localStorage.
         * @param {Array} filme - Array contendo os filmes favoritos.
         */
        function salvaFavorito(filme) {
          localStorage.setItem('favoritos', JSON.stringify(filme));
        }

        /**
         * Recupera a lista de filmes favoritos armazenados no localStorage.
         * @returns {Array} Um array de objetos com os filmes favoritos ou um array vazio se nada estiver salvo.
         */
        function pegarFilmeFavorito() {
          const filme = localStorage.getItem('favoritos');
          return filme ? JSON.parse(filme) : [];
        }

        /**
         * Renderiza na interface a lista atual de filmes favoritos.
         */
        function rederizarFavoritos() {
          // Obtém a lista de filmes favoritos armazenada
          const filmesfavoritos = pegarFilmeFavorito();
          // Limpa o conteúdo existente na área designada para os favoritos
          ListaDeFavoritos.innerHTML = '';

          // Para cada filme na lista de favoritos, cria um card com seus dados e um botão para remoção
          filmesfavoritos.forEach(filme => {
            // Cria um novo elemento para o item favorito
            const elementoFavorito = document.createElement('div');
            // Aplica uma classe CSS para estilização dos itens favoritos
            elementoFavorito.classList.add('favorite-item');
            // Configura o conteúdo HTML do card com a imagem, título e botão de remoção
            elementoFavorito.innerHTML = `
                    <img src="${filme.posterUrl}" alt="${filme.title}">
                    <h3>${filme.title}</h3>
                    <button onclick="removeDoFavoritos(${filme.id})">
                      Remover dos Favoritos
                    </button>
                `;
            // Adiciona o card do favorito na área de favoritos da interface
            ListaDeFavoritos.appendChild(elementoFavorito);
          });
        }


        // ======================= Eventos do DOM =======================

        document.addEventListener("DOMContentLoaded", () => {
          // Seleciona o botão de limpar pesquisa (identificado por "botao-limpar")
          const btnLimpa = document.getElementById('botao-limpar');

          // Se o botão para limpar for encontrado, define seu evento de clique
          if (btnLimpa) {
            btnLimpa.addEventListener('click', () => {
              // Limpa o valor do botão de busca (nota: pode ser necessário limpar também o input)
              BuscaBtn.value = '';
              // Remove o elemento da lista de filmes exibida; observe que isso remove o elemento do DOM
              ListaDeFilmes.remove();
            });
          } else {
            console.error("Elemento 'botao-limpar' não encontrado.");
          }

          // Verifica se o botão de busca foi obtido corretamente
          if (BuscaBtn) {
            // Define o evento para iniciar a busca no clique do botão de pesquisa
            BuscaBtn.addEventListener('click', () => {
              // Obtém o valor digitado no input, removendo espaços desnecessários
              const inicial = letraDoInput.value.trim();
              // Chama a função de busca de filmes passando o termo digitado
              ProcuraFilmesincial(inicial);
            });
          } else {
            console.error("Elemento 'botao-pesquisa' não encontrado.");
          }

          // Chama a função para renderizar os filmes favoritos já armazenados ao carregar a página
          rederizarFavoritos();
        });
        
        userContainer.appendChild(botaoSair);

        botao.replaceWith(userContainer);
      }
    }
  }


  // Captura e exibe erros no console


  // Executa a mesma lógica para carregar o rodapé

    // Obtém o caminho da URL atual

  if (window.document.getElementById("footer")) {
    
    // Define o caminho do rodapé com base na estrutura de diretórios
    const basePathF = path.includes('/pages/') ? '../components/rodape.html' : './components/rodape.html';

    // Faz uma requisição para carregar o arquivo do rodapé
    fetch(basePathF)
      .then(response => {
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
          throw new Error('Erro ao carregar o rodapé');
        }
        return response.text(); // Converte a resposta para texto
      })
      .then(data => {
        // Insere o conteúdo do rodapé no elemento com ID "footer"
        document.getElementById('footer').innerHTML = data;
      })
      .catch(error=> {console.error('Erro:', error)}); // Captura e exibe erros no console
    }

