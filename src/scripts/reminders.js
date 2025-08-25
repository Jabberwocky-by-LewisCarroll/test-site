document.addEventListener('DOMContentLoaded', function () {

    if (!localStorage.getItem('sessionID')) {
        window.location.href = '../index.html';
        return;
    };

    // Проверка роли и доступа к функционалу кнопки добавления напоминаний
    const role = window.localStorage.getItem('role');
    const arrRoles = role.split(',');
    if (arrRoles.includes('remindWebUser')) {
        const addBtn = document.querySelector('link-btn.add');
        if (addBtn) {
            addBtn.style.display = 'none';
        };
    };
    
    // Сохраняем appID и sessionID для дальнейшего использования
    const appID = '640a9d7b-5015-4ea0-8206-a4eddcef054b';
    const sessionID = localStorage.getItem('sessionID');

    const containerComTab = document.querySelector('#remComContainer');
    const containerActTab = document.querySelector('#remActContainer');

    // Получаем шаблон из контейнера
    const tempComTab = containerComTab.querySelector('#remComTabRows');
    const tempActTab = containerActTab.querySelector('#remActTabRows');

    // Получаем завершённые напоминания по апи и вставляем их в таблицу
    fetch(`https://api.directual.com/good/api/v5/data/reminds/completedReminders?appID=640a9d7b-5015-4ea0-8206-a4eddcef054b&sessionID=${sessionID}`)
        .then(response => response.json())
        .then(data => {
            const objects = Array.isArray(data.payload) ? data.payload : [];
            if (objects.length > 0) {
                objects.forEach(obj => {
                    // Клонируем содержимое шаблона
                    const clone = tempComTab.content.cloneNode(true);
                    clone.querySelector('#remName').textContent = obj.textRemind || '';
                    clone.querySelector('#remStatus').textContent = obj.status || '';
                    clone.querySelector('#remRemindDate').textContent = obj.dateRemindFomated || '';
                    clone.querySelector('#remRemindTime').textContent = obj.timeFormatedForMenu || '';
                    clone.querySelector('#remID').textContent = obj.id || '';
                    containerComTab.appendChild(clone);
                });

                // Обновляем количество напоминаний
                const remComCount = document.querySelector('span.remComCount');
                if (data.pageInfo.tableSize > 0) {
                    remComCount.textContent = data.pageInfo.tableSize;
                } else {
                    remComCount.textContent = '0';
                }

            } else {
                containerComTab.innerHTML += '<tr><td>Нет данных</td><td></td><td></td><td></td><td></td></tr>';
            }
        })
        .catch(error => {
            containerComTab.innerHTML += '<tr><td>Ошибка загрузки данных</td><td></td><td></td><td></td><td></td></tr>';
            console.error(error);
        });

        // Получаем актуальные напоминания по апи и вставляем их в таблицу
        fetch(`https://api.directual.com/good/api/v5/data/reminds/activeReminders?appID=640a9d7b-5015-4ea0-8206-a4eddcef054b&sessionID=${sessionID}`)
        .then(response => response.json())
        .then(data => {
            const objects = Array.isArray(data.payload) ? data.payload : [];
            if (objects.length > 0) {
                objects.forEach(obj => {
                    // Клонируем содержимое шаблона
                    const clone = tempActTab.content.cloneNode(true);
                    clone.querySelector('#remName').textContent = obj.textRemind || '';
                    clone.querySelector('#remStatus').textContent = obj.status || '';
                    clone.querySelector('#remRemindDate').textContent = obj.dateRemindFomated || '';
                    clone.querySelector('#remRemindTime').textContent = obj.timeFormatedForMenu || '';
                    clone.querySelector('#remID').textContent = obj.id || '';
                    containerActTab.appendChild(clone);
                });

                // Обновляем количество напоминаний
                const remActCount = document.querySelector('span.remActCount');
                if (data.pageInfo.tableSize > 0) {
                    remActCount.textContent = data.pageInfo.tableSize;
                } else {
                    remActCount.textContent = '0';
                }
                
            } else {
                containerActTab.innerHTML += '<tr><td>Нет данных</td><td></td><td></td><td></td><td></td></tr>';
            }
        })
        .catch(error => {
            containerActTab.innerHTML += '<tr><td>Ошибка загрузки данных</td><td></td><td></td><td></td><td></td></tr>';
            console.error(error);
        });

    // Логика переключения таблиц кнопками
    btnComTab = document.querySelector('#tables__btn-com');
    btnActTab = document.querySelector('#tables__btn-act');
    tabCom = document.querySelector('#remComTab');
    tabAct = document.querySelector('#remActTab');

    // Начальное состояние при загрузке
    btnComTab.style.boxShadow = 'none';
    btnActTab.style.boxShadow = '0px 0px 10px 0px #000000 inset';
    tabCom.style.display = 'none';
    tabAct.style.display = 'table';

    btnComTab.addEventListener('click', function (e) {
        e.preventDefault();
        tabCom.style.display = 'table';
        tabAct.style.display = 'none';
        btnComTab.style.boxShadow = '0px 0px 10px 0px #000000 inset';
        btnActTab.style.boxShadow = 'none';
    });

    btnActTab.addEventListener('click', function (e) {
        e.preventDefault();
        tabCom.style.display = 'none';
        tabAct.style.display = 'table';
        btnComTab.style.boxShadow = 'none';
        btnActTab.style.boxShadow = '0px 0px 10px 0px #000000 inset';
    });

    // Обработчик кнопки добавления напоминания
    const btnRemAdd = document.querySelector('button.link-btn.add');
    
    // Проверка наличия кнопки добавления напоминаний
    if (btnRemAdd) {
        btnRemAdd.addEventListener('click', function () {
            const body = document.querySelector('body');
            let popup = document.querySelector('.popup-window');

            // Проверяем, существует ли уже попап
            if (!document.querySelector('div.popup-window')) {
                popup = document.createElement('div');
                popup.classList.add('popup-window', 'hide');
                popup.style.display = 'flex';
                body.prepend(popup);
            }

            // Добавляем форму отправки черновика напоминания
            popup.innerHTML = `
                    <form class="form from__add-rem">
                        <div class="btn__exit-form">
                            <div class="btn__item a"></div>
                            <div class="btn__item b"></div>
                        </div>
                        <textarea
                            name="remindText"
                            class="input"
                            autocomplete="off"
                            autofocus
                            placeholder="Укажите, о чём надо напомнить!"
                            required
                            spellcheck="true"
                            ></textarea>
                            <button class="link-btn from__add-rem" type="submit">Добавить напоминание</button>
                    </form>`;

            const form = popup.querySelector('.form.from__add-rem');
            const btnAddRem = popup.querySelector('.link-btn.from__add-rem');

            popup.classList.replace('hide', 'show');

            // Обработчик кнопки закрытия формы
            const btnExit = popup.querySelector('.btn__exit-form');
            
            if (btnExit) {
                btnExit.addEventListener('click', function () {
                    popup.classList.replace('show', 'hide');
                    setTimeout(() => popup.remove(), 300);
                });
            };

            // Обработчик отправки формы
            if (form && btnAddRem) {
                form.addEventListener('submit', function (e) {
                    e.preventDefault();

                    const formData = new FormData(form);
                    const payload = {
                        textMessage: formData.get('remindText'),
                        isWeb: true,
                    };

                    let remAnswer = {};

                    popup.classList.replace('show', 'hide');
                    setTimeout(() => {
                        popup.remove();

                        // Отправляем данные на сервер для создания черновика напоминания
                        fetch(`https://api.directual.com/good/api/v5/data/inputremind/newDraftRemind?appID=${appID}&sessionID=${sessionID}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        })
                        .then(response => response.json())
                        .then(data => {
                            remAnswer.textRemind = data.result[0].textRemind;
                            remAnswer.id = data.result[0].id;
                            remAnswer.dateRemind = data.result[0].dateRemind;
                            remAnswer.timeRemind = data.result[0].timeRemind;

                            // Проверяем, существует ли уже попап
                            if (!document.querySelector('div.popup-window')) {
                                popup = document.createElement('div');
                                popup.classList.add('popup-window', 'hide');
                                popup.style.display = 'flex';
                                body.prepend(popup);
                            };

                            // Добавляем форму подтверждения напоминания
                            popup.innerHTML = `
                                <form class="form from__confirm-rem">
                                    <div class="btn__exit-form">
                                        <div class="btn__item a"></div>
                                        <div class="btn__item b"></div>
                                    </div>
                                    <input class="input" name="remindText" type="text" value="${remAnswer.textRemind}" readonly>
                                    <input class="input" name="id" type="text" value="${remAnswer.id}" readonly>
                                    <input class="input" name="dateRemind" type="text" value="${remAnswer.dateRemind}" readonly>
                                    <input class="input" name="timeRemind" type="text" value="${remAnswer.timeRemind}" readonly>
                                    <div class="space__1rem"></div>
                                    <p>Подтвердите, если напоминание записано верно!</p>
                                    <div class="flex-row justify-content__space-between">
                                        <button class="link-btn from__confirm-rem" type="submit">Подтвердить</button>
                                        <button class="link-btn cancelRem" type="button">Отменить</button>
                                    </div>
                                </form>`;

                            const formConfirm = popup.querySelector('.form.from__confirm-rem');
                            const btnConfirmRem = formConfirm.querySelector('.link-btn.from__confirm-rem');
                            const btnCancelRem = formConfirm.querySelector('.link-btn.cancelRem');

                            popup.classList.replace('hide', 'show');

                            // Обработчик кнопки закрытия формы
                            const btnExit = popup.querySelector('.btn__exit-form');

                            if (btnExit) {
                                btnExit.addEventListener('click', function () {
                                    popup.classList.replace('show', 'hide');
                                    setTimeout(() => popup.remove(), 300);
                                });
                            };

                            // Обработчик кнопки "Отменить"
                            if (btnCancelRem) {
                                btnCancelRem.addEventListener('click', function () {
                                    popup.classList.replace('show', 'hide');
                                    setTimeout(() => popup.remove(), 300);
                                });
                            };

                            // Обработчик кнопки "Подтвердить"
                            if (formConfirm && btnConfirmRem) {
                                formConfirm.addEventListener('submit', function (e) {
                                    e.preventDefault();

                                    // Отправляем данные на сервер для подтверждения напоминания
                                    fetch(`https://api.directual.com/good/api/v5/data/inputremind/confirmRemind?appID=${appID}&sessionID=${sessionID}`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            'confirmed': true,
                                            'id': remAnswer.id
                                        })
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        popup.classList.replace('show', 'hide');
                                        setTimeout(() => {
                                            popup.remove();

                                            if (data.result[0].success === true) {

                                                // Проверяем, существует ли уже попап
                                                if (!document.querySelector('div.popup-window')) {
                                                popup = document.createElement('div');
                                                popup.classList.add('popup-window', 'hide');
                                                popup.style.display = 'flex';
                                                body.prepend(popup);
                                                };

                                                // Создаём окно с уведомлением об успешной операции
                                                popup.innerHTML = `
                                                <form class="form form__add-success">
                                                    <div class="btn__exit-form">
                                                        <div class="btn__item a"></div>
                                                        <div class="btn__item b"></div>
                                                    </div>
                                                    <p>${data.result[0].descriptionResult}</p>
                                                    <button class="link-btn form__add-success" type="submit">Ок</button>
                                                </form>
                                                `;

                                                popup.classList.replace('hide', 'show');

                                                // Обработчик кнопки закрытия формы
                                                const btnExit = popup.querySelector('.btn__exit-form');
                                                
                                                if (btnExit) {
                                                    btnExit.addEventListener('click', function () {
                                                        popup.classList.replace('show', 'hide');
                                                        setTimeout(() => popup.remove(), 300);
                                                    });
                                                };

                                                const formAddSuccess = popup.querySelector('.form__add-success');
                                                const btnAddSuccess = formAddSuccess.querySelector('.link-btn.form__add-success');

                                                // Обработчик кнопки "Ок" в окне с уведомлением
                                                if (formAddSuccess && btnAddSuccess) {
                                                    formAddSuccess.addEventListener('submit', (e) => {
                                                        e.preventDefault();

                                                        popup.classList.replace('show', 'hide');
                                                        setTimeout(() => popup.remove(), 300);
                                                    });
                                                };
                                            } else {
                                                alert('Ошибка при создании напоминания. Подробности в консоли.');
                                                console.log('Не получилось создать напоминание.');                                        
                                            };
                                        }, 300);
                                    })
                                    .catch(error => {
                                        alert('Ошибка подтверждения напоминания. Подробности в консоли');
                                        console.error('Ошибка:', error);
                                        popup.classList.replace('show', 'hide');
                                        setTimeout(() => popup.remove(), 300);
                                    });
                                });
                            };
                        })
                        .catch(error => {
                            alert('Ошибка при создании напоминания. Подробности в консоли');
                            console.log('Ошибка: ', error);
                        });
                    }, 300);
                });
            };
        });
    };
});