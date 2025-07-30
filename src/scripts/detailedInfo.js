document.addEventListener('DOMContentLoaded', function () {

    if (!localStorage.getItem('sessionID')) {
        window.location.href = '../index.html';
        return;
    }
    
    const container = document.getElementById('detailedInfo');
    // Получаем id из параметров URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        container.textContent = 'ID не указан!';
        return;
    }

    fetch('https://api.directual.com/good/api/v5/data/testApi/oneUser?appID=640a9d7b-5015-4ea0-8206-a4eddcef054b&sessionID=&id=' + id)
        .then(response => response.json())
        .then(data => {
            const objects = Array.isArray(data.payload) ? data.payload : [];
            const obj = objects.find(item => item.id === id);
            if (obj) {
                container.innerHTML = `
                    <p><strong>Имя:</strong> ${obj.name}</p>
                    <p><strong>Фамилия:</strong> ${obj.surname}</p>
                    <p><strong>Email:</strong> ${obj.email}</p>
                    <p><strong>Ответ:</strong> ${obj.responce}</p>
                    <p><strong>ID:</strong> ${obj.id}</p>
                `;
            } else {
                container.textContent = 'Объект не найден!';
            }
        })
        .catch(error => {
            container.textContent = 'Ошибка загрузки данных';
            console.error(error);
        });
});