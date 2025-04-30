const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    let isValid = true;

    // Validação do email
    if (!email.value.includes('@') || !email.value.includes('.')) {
        emailError.textContent = 'Por favor, insira um email válido.';
        isValid = false;
    } else {
        emailError.textContent = '';
    }

    // Validação da senha
    if (password.value.length < 6) {
        passwordError.textContent = 'A senha deve ter pelo menos 6 caracteres.';
        isValid = false;
    } else {
        passwordError.textContent = '';
    }

    if (isValid) {
        alert('Login realizado com sucesso!');
        window.location.href = "/src/index.html";
        // Aqui você pode redirecionar para outra página ou processar os dados
    }
});