let btn = document.querySelector('#verSenha'); // Seleciona o botão de mostrar senha

btn.addEventListener('click', () => {
    let inputSenha = document.querySelector('#senha'); // Seleciona o campo de senha

    // Se o tipo do input for "password", muda para "text" (para exibir a senha)
    if (inputSenha.getAttribute('type') == 'password') {
        inputSenha.setAttribute('type', 'text');
    } else {
        inputSenha.setAttribute('type', 'password'); // Caso contrário, mantém oculto
    }
});



//Função para entrar 
function entrar() {
    let usuario = document.querySelector('#email'); // Obtém o input do e-mail
    let userLabel = document.querySelector('#userLabel'); // Obtém o label do e-mail

    let senha = document.querySelector('#senha'); // Obtém o input da senha
    let senhaLabel = document.querySelector('#senhaLabel'); // Obtém o label da senha
    let msgError = document.querySelector('#msgError'); // Obtém a div de erro
    let listaUser = []; // Inicializa a lista de usuários cadastrados

    let userValid = { nome: '', user: '', senha: '' }; // Cria um objeto para armazenar usuário válido

    listaUser = JSON.parse(localStorage.getItem('listaUser')) || []; // Obtém usuários salvos no `localStorage`

    // Percorre a lista de usuários salvos e verifica se as credenciais coincidem
    listaUser.forEach((item) => {
        if (usuario.value == item.userCad && senha.value == item.senhaCad) {

            userValid = {
                nome: item.nomeCad,
                user: item.userCad,
                senha: item.senhaCad
            };
        }
    });

    // Verifica se os campos estão vazios
    if (usuario.value.trim() === '' || senha.value.trim() === '') {
        alert("Digite o seu usuário e senha.");
        return;
    }

    // Verifica se usuário e senha correspondem a um usuário válido
    else if (usuario.value == userValid.user && senha.value == userValid.senha) {
        window.location.href = '../index.html'; // Redireciona para a página principal
        // Parece haver um erro aqui: "pag.load.classList.add('botao');" não faz sentido
       

        let token = crypto.randomUUID(); // Gera um identificador único
        localStorage.setItem('token', token);
        

        localStorage.setItem('token', token); // Salva o token de autenticação
        localStorage.setItem('userLogado', JSON.stringify(userValid)); // Salva o usuário logado
    }

    // Caso as credenciais estejam erradas, exibe mensagem de erro
    else {
        userLabel.style.color = 'red';
        usuario.style.borderColor = 'red';
        senhaLabel.style.color = 'red';
        senha.style.borderColor = 'red';
        msgError.style.display = 'block';
        msgError.innerHTML = 'E-mail ou senha incorretos!';
        usuario.focus();

    }

}