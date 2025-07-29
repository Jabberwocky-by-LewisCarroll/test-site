document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        fetch('https://api.directual.com/good/api/v5/data/testApi/newTestUser?appID=640a9d7b-5015-4ea0-8206-a4eddcef054b&sessionID=', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

         // Обработка ответа от сервера
        .then(response => response.json())
        .then(result => {
            alert('Ответ сервера: ' + JSON.stringify(result));

            // Если регистрация успешна, перенаправляем на страницу авторизации
            if (result.status === "OK") {
                window.location.href = '../index.html';
            }
        })
        .catch(error => {
            alert('Ошибка! Ответ сервера: ' + JSON.stringify(error));
            console.error(error);
        });
    });
});