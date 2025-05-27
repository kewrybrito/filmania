// Captura os botões que permitem visualizar ou ocultar a senha e a confirmação de senha
let btn = document.querySelector('#verSenha');        // Botão para alternar a visualização do campo de senha
let btnConfirm = document.querySelector('#verConfirmSenha'); // Botão para alternar a visualização do campo de confirmação de senha

// Captura os campos de entrada do formulário e seus respectivos rótulos para validação
// Elementos e variáveis para o campo "Nome"
let nome = document.querySelector('#nome');             // Input de nome do usuário
let labelNome = document.querySelector('#labelNome');   // Label associado ao campo nome
let validNome = false;                                  // Variável de controle: indica se o nome é válido

// Elementos e variáveis para o campo "Email" (usuário)
let usuario = document.querySelector('#email');         // Input de email/usuário
let labelUsuario = document.querySelector('#labelUsuario'); // Label associado ao campo email
let validUsuario = false;                               // Variável de controle: indica se o email é válido

// Elementos e variáveis para o campo "Senha"
let senha = document.querySelector('#senha');           // Input de senha
let labelSenha = document.querySelector('#labelSenha'); // Label associado ao campo de senha
let validSenha = false;                                 // Variável de controle: indica se a senha é válida

// Elementos e variáveis para o campo "Confirma Senha"
let confirmSenha = document.querySelector('#Csenha');   // Input de confirmação de senha
let labelConfirmSenha = document.querySelector('#labelCSenha'); // Label associado ao campo de confirmação de senha
let validConfirmSenha = false;                          // Variável de controle: indica se a confirmação de senha é válida

// Captura os elementos que apresentarão mensagens de erro e sucesso para o usuário
let msgError = document.querySelector('#msgError');     // Elemento para exibir mensagens de erro
let msgSuccess = document.querySelector('#msgSuccess'); // Elemento para exibir mensagens de sucesso

// Evento para validar o campo "Nome" à medida que o usuário digita
nome.addEventListener('keyup', () => {
    // Valida se o valor digitado possui mais de 12 caracteres
    if (nome.value.length <= 12) { // Caso o nome tenha 12 ou menos caracteres, exibe erro
        labelNome.setAttribute('style', 'color: red');
        labelNome.innerHTML = 'Nome *Insira seu nome completo';
        nome.setAttribute('style', 'border-color: red');
        validNome = false;
    } else { // Se o nome contém mais de 12 caracteres, considera válido
        labelNome.setAttribute('style', 'color: green');
        labelNome.innerHTML = 'Nome';
        nome.setAttribute('style', 'border-color: green');
        validNome = true;
    }
});

// Evento para validar o campo "Email" (usuário) conforme o usuário digita
usuario.addEventListener('keyup', () => {
    // Verifica se o valor inserido contém um símbolo '@' e um ponto '.', requisitos básicos para um email válido
    if (!usuario.value.includes('@') || !usuario.value.includes('.')) {
        labelUsuario.setAttribute('style', 'color: red');
        labelUsuario.innerHTML = 'Email *Precisa ter @ e .com';
        usuario.setAttribute('style', 'border-color: red');
        validUsuario = false;
    } else {
        // Se a validação passar, indica sucesso com cores e um check
        labelUsuario.setAttribute('style', 'color: green');
        labelUsuario.innerHTML = 'Usuário✔️';
        usuario.setAttribute('style', 'border-color: green');
        validUsuario = true;
    }
});

// Evento para validar o campo "Senha" enquanto o usuário digita
senha.addEventListener('keyup', () => {
    // A senha precisa ter, no mínimo, 6 caracteres; caso contrário, é considerada inválida
    if (senha.value.length <= 5) {
        labelSenha.setAttribute('style', 'color: red');
        labelSenha.innerHTML = 'Senha *Insira no mínimo 6 caracteres';
        senha.setAttribute('style', 'border-color: red');
        validSenha = false;
    } else {
        // Se a senha atender ao comprimento mínimo, a validação é positiva
        labelSenha.setAttribute('style', 'color: green');
        labelSenha.innerHTML = 'Senha✔️';
        senha.setAttribute('style', 'border-color: green');
        validSenha = true;
    }
});

// Evento para validar a confirmação de senha enquanto o usuário digita
confirmSenha.addEventListener('keyup', () => {
    // Compara o valor do campo senha com o da confirmação; se forem diferentes, exibe erro
    if (senha.value != confirmSenha.value) {
        labelConfirmSenha.setAttribute('style', 'color: red');
        labelConfirmSenha.innerHTML = 'Confirmar Senha *As senhas não conferem';
        confirmSenha.setAttribute('style', 'border-color: red');
        validConfirmSenha = false;
    } else {
        // Se os valores baterem, sinaliza que a confirmação está correta
        labelConfirmSenha.setAttribute('style', 'color: green');
        labelConfirmSenha.innerHTML = 'Senha Confere✔️';
        confirmSenha.setAttribute('style', 'border-color: green');
        validConfirmSenha = true;
    }
});

// Função responsável pelo cadastro do usuário
function cadastrar() {
    // Verifica se todos os campos passaram na validação
    if (validNome && validUsuario && validSenha && validConfirmSenha) {
        // Recupera a lista de usuários já cadastrados no localStorage.
        // Se não existir, é criado um array vazio.
        let listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');

        // Adiciona um novo objeto de usuário à lista com os dados coletados do formulário
        listaUser.push({
            nomeCad: nome.value,
            userCad: usuario.value,
            senhaCad: senha.value
        });

        // Atualiza o localStorage com a nova lista de usuários convertida para JSON
        localStorage.setItem('listaUser', JSON.stringify(listaUser));

        // Exibe mensagem de sucesso informando que o usuário está sendo cadastrado
        msgSuccess.setAttribute('style', 'display: block');
        msgSuccess.innerHTML = '<strong>Cadastrando usuário...</strong>';
        // Oculta qualquer mensagem de erro anterior
        msgError.setAttribute('style', 'display: none');
        msgError.innerHTML = '';

        // Aguarda 3 segundos para dar tempo ao usuário de perceber a mensagem e, em seguida, redireciona para a página de login
        setTimeout(() => {
            window.location.href = '../pages/login.html';
        }, 3000);

    } else {
        // Se algum campo estiver inválido, exibe uma mensagem de erro para o usuário
        msgError.setAttribute('style', 'display: block');
        msgError.innerHTML = '<strong>Preencha todos os campos corretamente antes de cadastrar</strong>';
        // Oculta mensagem de sucesso, se houver
        msgSuccess.innerHTML = '';
        msgSuccess.setAttribute('style', 'display: none');
    }
}

// Evento para alternar a visibilidade do campo "Senha"
// Este evento é acionado ao clicar no botão para mostrar ou ocultar a senha
btn.addEventListener('click', () => {
    let inputSenha = document.querySelector('#senha'); // Seleciona o campo de senha
    // Checa o atributo "type" do input: se for "password", muda para "text" para exibir o conteúdo
    if (inputSenha.getAttribute('type') == 'password') {
        inputSenha.setAttribute('type', 'text');
    } else {
        // Caso já esteja visível, volta para "password" para ocultá-lo
        inputSenha.setAttribute('type', 'password');
    }
});

// Evento para alternar a visibilidade do campo "Confirmar Senha"
// Este evento permite ao usuário ver ou ocultar a confirmação de senha
btnConfirm.addEventListener('click', () => {
    let inputConfirmSenha = document.querySelector('#Csenha'); // Seleciona o campo de confirmação de senha
    // Se o campo estiver oculto ("password"), altera para "text"
    if (inputConfirmSenha.getAttribute('type') == 'password') {
        inputConfirmSenha.setAttribute('type', 'text');
    } else {
        // Caso o campo esteja visível, volta a ser "password"
        inputConfirmSenha.setAttribute('type', 'password');
    }
});
