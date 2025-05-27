// Seleciona o botão que alterna a exibição da senha
let btn = document.querySelector('#verSenha');

// Adiciona um listener para o carregamento do DOM
// ATENÇÃO: há um erro de digitação: "DOMContenteLoded" deveria ser "DOMContentLoaded"
// Isso pode impedir que o código dentro do listener seja executado corretamente.
document.addEventListener('DOMContenteLoded', () => {
    // Quando o botão é clicado, inicia a função que troca o tipo do input de senha
    btn.addEventListener('click', () => {
        // Seleciona o campo de senha
        let inputSenha = document.querySelector('#senha');

        // Se o campo de senha estiver oculto (tipo "password"), muda para "text" para exibi-la
        if (inputSenha.getAttribute('type') == 'password') {
            inputSenha.setAttribute('type', 'text');
        } else {
            // Caso contrário, volta para o tipo "password", mantendo o valor oculto
            inputSenha.setAttribute('type', 'password');
        }
    });
});


// Função responsável por realizar o login (entrar)
function entrar() {
    // Seleciona o campo de email (usuário) e seu respectivo label
    let usuario = document.querySelector('#email');
    let userLabel = document.querySelector('#userLabel');

    // Seleciona o campo de senha e seu respectivo label
    let senha = document.querySelector('#senha');
    let senhaLabel = document.querySelector('#senhaLabel');

    // Seleciona o elemento que exibirá mensagens de erro, se necessário
    let msgError = document.querySelector('#msgError');

    // Inicializa uma lista para os usuários cadastrados (usada para busca no localStorage)
    let listaUser = [];

    // Cria um objeto para armazenar os dados do usuário válido, se encontrado
    let userValid = { nome: '', user: '', senha: '' };

    // Tenta recuperar a lista de usuários do localStorage (se não houver, utiliza um array vazio)
    listaUser = JSON.parse(localStorage.getItem('listaUser')) || [];

    // Itera sobre a lista de usuários salvos para verificar se há correspondência com os dados inseridos
    listaUser.forEach((item) => {
        if (usuario.value == item.userCad && senha.value == item.senhaCad) {
            // Se houver correspondência, atualiza o objeto userValid com os dados do usuário encontrado
            userValid = {
                nome: item.nomeCad,
                user: item.userCad,
                senha: item.senhaCad
            };
        }
    });

    // Verifica se os campos de email ou senha estão vazios (trim() remove espaços em branco)
    if (usuario.value.trim() === '' || senha.value.trim() === '') {
        alert("Digite o seu usuário e senha.");
        return; // Interrompe a execução se os campos não estiverem preenchidos
    }

    // Se as credenciais inseridas correspondem ao usuário válido encontrado
    else if (usuario.value == userValid.user && senha.value == userValid.senha) {
        // Gera um identificador único para a sessão utilizando crypto.randomUUID()
        let token = crypto.randomUUID();
        // Armazena o token no localStorage (poderia ser usado na autenticação)
        localStorage.setItem('token', token);
        // Armazena os detalhes do usuário logado no localStorage (converte o objeto para JSON)
        localStorage.setItem('userLogado', JSON.stringify(userValid));

        // Redireciona para a página principal após o login bem-sucedido
        window.location.href = '../index.html';
        // Nota: A linha "pag.load.classList.add('botao');" mencionada no comentário não está presente
        // e, conforme comentado, não faria sentido no contexto atual.
    }

    // Caso as credenciais não estejam corretas, exibe uma mensagem de erro e altera o estilo dos inputs
    else {
        // Altera a cor dos labels para vermelho
        userLabel.style.color = 'red';
        senhaLabel.style.color = 'red';
        // Altera a borda dos inputs de usuário e senha para vermelho
        usuario.style.borderColor = 'red';

        senha.style.borderColor = 'red';
        // Exibe a mensagem de erro informando que os dados estão incorretos
        msgError.style.display = 'block';
        msgError.innerHTML = 'E-mail ou senha incorretos!';
        // Define o foco no campo de email para facilitar a correção pelo usuário
        usuario.focus();

    }

}