document.addEventListener('DOMContentLoaded', function () {

    if (!localStorage.getItem('sessionID')) {
        window.location.href = '../index.html';
        return;
    }

    const container = document.querySelector('.obj-wrapper');
    // Получаем шаблон из контейнера
    const template = container.querySelector('template');

    fetch('https://api.directual.com/good/api/v5/data/testApi/newTestUser?appID=640a9d7b-5015-4ea0-8206-a4eddcef054b&sessionID=')
        .then(response => response.json())
        .then(data => {
            const objects = Array.isArray(data.payload) ? data.payload : [];
            if (objects.length > 0) {
                objects.forEach(obj => {
                    // Клонируем содержимое шаблона
                    const clone = template.content.cloneNode(true);
                    clone.querySelector('.name').textContent = obj.name || '';
                    clone.querySelector('.surname').textContent = obj.surname || '';
                    clone.querySelector('.email').textContent = obj.email || '';
                    clone.querySelector('.id').textContent = obj.id || '';
                    clone.querySelector('.link-btn').href = `detailedInfo.html?id=${obj.id}`;
                    container.appendChild(clone);
                });
            } else {
                container.innerHTML += '<p>Нет данных</p>';
            }
        })
        .catch(error => {
            container.innerHTML += '<p>Ошибка загрузки данных</p>';
            console.error(error);
        });

        const logoutBtn = document.querySelector('#logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.localStorage.removeItem('sessionID');
                alert('sessionID deleted!');
                window.location.href = logoutBtn.href;
            })
        }
});