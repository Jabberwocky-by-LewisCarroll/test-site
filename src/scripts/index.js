document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Заглушка для теста
        // Promise.resolve({
        //     result: {
        //         token: "acaf731e-03ca-45f8-ab4e-4310a007c844",
        //         username: "5652513695",
        //         role: "",
        //         nid: 23008
        //     },
        //     status: "ok"
        // })

        fetch('https://api.directual.com/good/api/v5/auth?appID=640a9d7b-5015-4ea0-8206-a4eddcef054b', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "provider": "rest",
                "username": data.login,
                "password": data.password,
            })
        })
        .then(response => response.json())
        .then(result => {

            // Обработка ответа от сервера
            alert('Ответ сервера: ' + JSON.stringify(result));

            if (result.status.toLowerCase() === 'ok') {
                window.localStorage.setItem('sessionID', result.result.token)
                window.location.href = 'public/getObjectsV2.html';
                alert('sessionID was set!');
            } else {
                alert('Ошибка авторизации: ' + result.message);
                return;
            }
        })
        .catch(error => {
            alert('Ошибка! Ответ сервера: ' + JSON.stringify(error));
            console.error(error);
        });
    });

    // Обработчик для чекбокса
    if (form) {
        const passwordInput = document.querySelector('#passwordInput');
        const togglePasswordType = document.querySelector('#togglePasswordType');

        if (passwordInput && togglePasswordType) {
            togglePasswordType.addEventListener('change', function () {
                if (passwordInput && togglePasswordType) {
                    passwordInput.type = togglePasswordType.checked ? 'text' : 'password';
                }
            });
        };
    }

    // Обработчик состояния кнопки "Войти"
    if (form) {
        const loginInput = document.querySelector('input[name="login"]');
        const passwordInput = document.querySelector('input[name="password"]');
        const btnSubmit = document.querySelector('button[type="submit"].link-btn');

        function checkFields() {
            if (loginInput.value.trim() && passwordInput.value.trim()) {
                btnSubmit.disabled = false;
            } else {
                btnSubmit.disabled = true;
            }
        }

        loginInput.addEventListener('input', checkFields);
        passwordInput.addEventListener('input', checkFields);

        checkFields();
    };
});