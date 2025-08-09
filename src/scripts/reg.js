document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (data.password !== data.passwordRepeat) {
            alert('Пароли не совпадают!');
            return;
        }

        fetch('https://api.directual.com/good/api/v5/data/registration/newUser?appID=640a9d7b-5015-4ea0-8206-a4eddcef054b', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "login": data.login,
                "password": data.password,
                "repeatPassword": data.passwordRepeat
            })
        })

         // Обработка ответа от сервера
        .then(response => response.json())
        .then(result => {
            alert('Регистрация прошла успешно! Ответ сервера: ' + JSON.stringify(result));

            // Если регистрация успешна, перенаправляем на страницу авторизации
            if (result.result[0].success === true) {
                window.location.href = '../index.html';
            }
            else {
                alert('Ошибка регистрации: ' + result.message);
                return;
            }
        })
        .catch(error => {
            alert('Ошибка! Ответ сервера: ' + JSON.stringify(error));
            console.error(error);
        });
    });

    // Обработчик для чекбокса
    const passwordInput = document.querySelector('#passwordInput');
    const togglePasswordType = document.querySelector('#togglePasswordType');
    const passwordRepeatInput = document.querySelector('#passwordRepeatInput');

    if (passwordInput && togglePasswordType && passwordRepeatInput) {
        togglePasswordType.addEventListener('change', function () {
            if (passwordInput && togglePasswordType) {
                passwordInput.type = togglePasswordType.checked ? 'text' : 'password';
                passwordRepeatInput.type = togglePasswordType.checked ? 'text' : 'password';
            }
        });
    };

    // Обработчик состояния кнопки "Войти"
    if (form) {
        const loginInput = document.querySelector('input[name="login"]');
        const passwordInput = document.querySelector('input[name="password"]');
        const passwordRepeatInput = document.querySelector('input[name="passwordRepeat"]');
        const btnSubmit = document.querySelector('button[type="submit"].link-btn');

        function checkFields() {
            if (loginInput.value.trim() && 
                passwordInput.value.trim() && 
                passwordRepeatInput.value.trim()) {
                btnSubmit.disabled = false;
            } else {
                btnSubmit.disabled = true;
            }
        }

        loginInput.addEventListener('input', checkFields);
        passwordInput.addEventListener('input', checkFields);
        passwordRepeatInput.addEventListener('input', checkFields);

        checkFields();
    };
});