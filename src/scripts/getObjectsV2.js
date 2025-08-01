document.addEventListener('DOMContentLoaded', function () {

    if (!localStorage.getItem('sessionID')) {
        window.location.href = '../index.html';
        return;
    }

    // Сохраняем appID и sessionID для дальнейшего использования
    const appID = '640a9d7b-5015-4ea0-8206-a4eddcef054b';
    const sessionID = localStorage.getItem('sessionID');

    // Контейнер с карточками
    const container = document.querySelector('.obj-wrapper');
    // Шаблон карточки в контейнере
    const template = container.querySelector('template');

    fetch(`https://api.directual.com/good/api/v5/data/testApi/newTestUser?appID=${appID}&sessionID=${sessionID}`)
        .then(response => response.json())
        .then(data => {
            const objects = Array.isArray(data.payload) ? data.payload : [];
            if (objects.length > 0) {
                objects.forEach(obj => {
                    // Клонируем содержимое шаблона
                    const clone = template.content.cloneNode(true);
                    const card = clone.querySelector('.obj-card');
                    card.querySelector('.name').textContent = obj.name || '';
                    card.querySelector('.surname').textContent = obj.surname || '';
                    card.querySelector('.email').textContent = obj.email || '';
                    card.querySelector('.id').textContent = obj.id || '';
                    card.querySelector('.link-btn.view').href = `detailedInfo.html?id=${obj.id}`;
                    card.querySelector('.link-btn.change');
                    card.querySelector('.link-btn.delete');
                    container.appendChild(card);

                    // Обработка кнопки "Удалить"
                    const btnDelete = card.querySelector('.link-btn.delete');

                    // Проверка на наличие кнопки "Удалить"
                    if (btnDelete) {
                        btnDelete.addEventListener('click', function(e) {
                            e.preventDefault();

                            const name = card.querySelector('.name').textContent;
                            const surname = card.querySelector('.surname').textContent;
                            const email = card.querySelector('.email').textContent;
                            const id = card.querySelector('.id').textContent;

                            fetch(`https://api.directual.com/good/api/v5/data/inputtestapi/editTestObjects?appID=${appID}&sessionID=${sessionID}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    "name": name,
                                    "surname": surname,
                                    "email": email,
                                    "testApiStructID": id,
                                    "action": "DELETE"
                                })
                            })
                            .then(response => response.json())
                            .then(result => {
                                if (result.result[0].success === true) {
                                    alert(`Объект '${id}' успешно удалён`)
                                    card.remove();
                                }
                                else {
                                    alert(`Ошибка удаления на сервере:\n\n${result.result[0].Result}`)
                                }
                                })
                            .catch(error => {
                                console.log(error);
                            })
                        })
                    }
                });
            } else {
                container.innerHTML += '<p>Нет данных</p>';
            }
        })
        .catch(error => {
            container.innerHTML += '<p>Ошибка загрузки данных</p>';
            console.error(error);
        });
});