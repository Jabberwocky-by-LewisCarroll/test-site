document.addEventListener('DOMContentLoaded', function () {

    if (!localStorage.getItem('sessionID')) {
        window.location.href = '../index.html';
        return;
    }

    // Сохраняем appID и sessionID для дальнейшего использования
    const appID = '640a9d7b-5015-4ea0-8206-a4eddcef054b';
    const sessionID = localStorage.getItem('sessionID');
    
    let currentEditingCard = null; // глобальная переменная для хранения карточки
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
                card.querySelector('.link-btn.edit');
                card.querySelector('.link-btn.delete');
                container.appendChild(card);

                // Обработчик кнопки "Изменить"
                const btnCardEdit = card.querySelector('.link-btn.edit')
                btnCardEdit.addEventListener('click', function(e) {
                    e.preventDefault();
                    const popup = document.querySelector('.popup-window.edit');
                    popup.classList.replace('hide', 'show');

                    // Запоминаем текущую карточку
                    currentEditingCard = card;

                    // Заполняем поля формы данными объекта
                    const form = popup.querySelector('form');
                    form.elements['name'].value = obj.name || '';
                    form.elements['surname'].value = obj.surname || '';
                    form.elements['email'].value = obj.email || '';
                    form.elements['id'].value = obj.id || '';
                });

                // Обработчик кнопки "Закрыть форму"
                const btnFormExit = document.querySelector('.btn__exit-form')
                btnFormExit.addEventListener('click', function(e) {
                    e.preventDefault();
                    const popup = document.querySelector('.popup-window');
                    popup.classList.replace('show', 'hide');
                });
                            
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
                };
            });

            const formEdit = document.querySelector('form.edit');
            formEdit.addEventListener('submit', function(e) {
                e.preventDefault();

                const name = formEdit.elements['name'].value;
                const surname = formEdit.elements['surname'].value;
                const email = formEdit.elements['email'].value;
                const id = formEdit.elements['id'].value;

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
                        "action": "UPDATE"
                    })
                })
                .then(response => response.json())
                .then(result => {
                    if(result.result[0].success === true) {
                        alert('Данные успешно обновлены');
                        const popup = document.querySelector('div.popup-window.edit');
                        popup.classList.replace('show', 'hide');

                        // --- обновляем карточку на странице ---
                        if (currentEditingCard) {
                            currentEditingCard.querySelector('.name').textContent = name;
                            currentEditingCard.querySelector('.surname').textContent = surname;
                            currentEditingCard.querySelector('.email').textContent = email;
                            currentEditingCard.querySelector('.id').textContent = id;
                        }
                    } else {
                        alert('Ошибка обновления: ' + result.result[0].Result);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            })
        } else {
            container.innerHTML += '<p>Нет данных</p>';
        }
    })
    .catch(error => {
        container.innerHTML += '<p>Ошибка загрузки данных</p>';
        console.error(error);
    });
});