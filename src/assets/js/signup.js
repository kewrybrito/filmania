// Captura os botões que permitem visualizar ou ocultar a senha e a confirmação de senha
let btn = document.querySelector('#verSenha')
let btnConfirm = document.querySelector('#verConfirmSenha')

// Captura os campos de entrada do formulário e seus respectivos rótulos para validação
let nome = document.querySelector('#nome') // Campo de nome
let labelNome = document.querySelector('#labelNome') // Rótulo do nome
let validNome = false // Variável para verificar se o nome está válido

let usuario = document.querySelector('#email') // Campo de email
let labelUsuario = document.querySelector('#labelUsuario') // Rótulo do email
let validUsuario = false // Variável para verificar se o email está válido

let senha = document.querySelector('#senha') // Campo de senha
let labelSenha = document.querySelector('#labelSenha') // Rótulo da senha
let validSenha = false // Variável para verificar se a senha está válida

let confirmSenha = document.querySelector('#Csenha') // Campo de confirmação de senha
let labelConfirmSenha = document.querySelector('#labelCSenha') // Rótulo da confirmação de senha
let validConfirmSenha = false // Variável para verificar se a confirmação de senha está válida

// Captura os elementos para mensagens de erro e sucesso
let msgError = document.querySelector('#msgError')
let msgSuccess = document.querySelector('#msgSuccess')

// Adiciona um evento para validar o campo Nome sempre que uma tecla for pressionada
nome.addEventListener('keyup', () => {
    if (nome.value.length <= 12) { // Se o nome tiver 12 caracteres ou menos, mostra erro
        labelNome.setAttribute('style', 'color: red')
        labelNome.innerHTML = 'Nome *Insira seu nome completo'
        nome.setAttribute('style', 'border-color: red')
        validNome = false
    } else { // Se tiver mais que 12 caracteres, considera válido
        labelNome.setAttribute('style', 'color: green')
        labelNome.innerHTML = 'Nome'
        nome.setAttribute('style', 'border-color: green')
        validNome = true
    }
})

// Adiciona um evento para validar o campo Email sempre que uma tecla for pressionada
usuario.addEventListener('keyup', () => {
    if (!usuario.value.includes('@') || !usuario.value.includes('.')) { // Verifica se contém "@" e "."
        labelUsuario.setAttribute('style', 'color: red')
        labelUsuario.innerHTML = 'Email *Precisa ter @ e .com'
        usuario.setAttribute('style', 'border-color: red')
        validUsuario = false
    } else { // Se for válido, exibe um check verde
        labelUsuario.setAttribute('style', 'color: green')
        labelUsuario.innerHTML = 'Usuário✔️'
        usuario.setAttribute('style', 'border-color: green')
        validUsuario = true
    }
})

// Adiciona um evento para validar o campo Senha sempre que uma tecla for pressionada
senha.addEventListener('keyup', () => {
    if (senha.value.length <= 5) { // Senha deve ter no mínimo 6 caracteres
        labelSenha.setAttribute('style', 'color: red')
        labelSenha.innerHTML = 'Senha *Insira no mínimo 6 caracteres'
        senha.setAttribute('style', 'border-color: red')
        validSenha = false
    } else { // Se for válida, exibe um check verde
        labelSenha.setAttribute('style', 'color: green')
        labelSenha.innerHTML = 'Senha✔️'
        senha.setAttribute('style', 'border-color: green')
        validSenha = true
    }
})

// Adiciona um evento para validar a confirmação de senha sempre que uma tecla for pressionada
confirmSenha.addEventListener('keyup', () => {
    if (senha.value != confirmSenha.value) { // Compara os valores da senha e da confirmação
        labelConfirmSenha.setAttribute('style', 'color: red')
        labelConfirmSenha.innerHTML = 'Confirmar Senha *As senhas não conferem'
        confirmSenha.setAttribute('style', 'border-color: red')
        validConfirmSenha = false
    } else { // Se as senhas forem iguais, exibe um check verde
        labelConfirmSenha.setAttribute('style', 'color: green')
        labelConfirmSenha.innerHTML = 'Senha Confere✔️'
        confirmSenha.setAttribute('style', 'border-color: green')
        validConfirmSenha = true
    }
})

// Função de cadastro de usuário
function cadastrar() {
    if (validNome && validUsuario && validSenha && validConfirmSenha) { // Verifica se todos os campos estão válidos

        // Obtém a lista de usuários armazenada no localStorage ou cria uma nova lista vazia
        let listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]')

        // Adiciona um novo usuário à lista
        listaUser.push(
            {
                nomeCad: nome.value,
                userCad: usuario.value,
                senhaCad: senha.value
            }
        )

        // Atualiza o localStorage com a lista de usuários
        localStorage.setItem('listaUser', JSON.stringify(listaUser))

        // Exibe mensagem de sucesso e oculta mensagem de erro
        msgSuccess.setAttribute('style', 'display: block')
        msgSuccess.innerHTML = '<strong>Cadastrando usuário...</strong>'
        msgError.setAttribute('style', 'display: none')
        msgError.innerHTML = ''

        // Aguarda 3 segundos e redireciona para a página de login
        setTimeout(() => {
            window.location.href = '../pages/login.html';
        }, 3000)

       
    } else {
        // Se algum campo estiver inválido, exibe mensagem de erro
        msgError.setAttribute('style', 'display: block')
        msgError.innerHTML = '<strong>Preencha todos os campos corretamente antes de cadastrar</strong>'
        msgSuccess.innerHTML = ''
        msgSuccess.setAttribute('style', 'display: none')
    }
}

// Adiciona um evento para alternar a visibilidade do campo Senha ao clicar no botão
btn.addEventListener('click', () => {
    let inputSenha = document.querySelector('#senha')

    if (inputSenha.getAttribute('type') == 'password') {
        inputSenha.setAttribute('type', 'text') // Mostra a senha
    } else {
        inputSenha.setAttribute('type', 'password') // Oculta a senha
    }
})

// Adiciona um evento para alternar a visibilidade do campo Confirmar Senha ao clicar no botão
btnConfirm.addEventListener('click', () => {
    let inputConfirmSenha = document.querySelector('#Csenha')

    if (inputConfirmSenha.getAttribute('type') == 'password') {
        inputConfirmSenha.setAttribute('type', 'text') // Mostra a senha
    } else {
        inputConfirmSenha.setAttribute('type', 'password') // Oculta a senha
    }
})
