document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        fetch('https://api.directual.com/good/api/v5/auth?appID=640a9d7b-5015-4ea0-8206-a4eddcef054b', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            // Для теста временно логин и пароль заменяю email и name из объектов
            body: JSON.stringify({
                "provider": "rest",
                "username": data.email,
                "password": data.name,
            })
        })
        .then(response => response.json())
        .then(result => {
            // Обработка ответа от сервера
            alert('Ответ сервера: ' + JSON.stringify(result));
        })
        .catch(error => {
            alert('Ошибка! Ответ сервера: ' + JSON.stringify(error));
            console.error(error);
        });
    });
});