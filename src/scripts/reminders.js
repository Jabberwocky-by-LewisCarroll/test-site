document.addEventListener('DOMContentLoaded', function () {

    if (!localStorage.getItem('sessionID')) {
        window.location.href = '../index.html';
        return;
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
    if (btnRemAdd) { // Проверка наличия кнопки добавления напоминаний
        btnRemAdd.addEventListener('click', function () {
            const body = document.querySelector('body');
            
            const popup = document.createElement('div'); // Полупрозрачный фон
            popup.style.display = 'flex';
            popup.classList.add('popup-window', 'show');
            
            const form = document.createElement('form.form'); // Форма
            form.classList.add('form');
            
            // Поле для ввода текста напоминания
            const inputRemind = document.createElement('input');
            inputRemind.name = 'remindText';
            inputRemind.type = 'text';
            inputRemind.required = true;
            form.appendChild(inputRemind); // Добавляем поле в форму
            
            const btn = document.createElement('button'); // Кнопка подтверждения формы
            btn.classList.add('link-btn', 'submit');
            btn.type = 'submit';
            btn.textContent = 'Добавить напоминание';
            form.appendChild(btn); // Добавляем кнопку в форму

            const btnExit = document.createElement('div');
            btnExit.classList.add('btn__exit-form');

            const btnExitItemA = document.createElement('div');
            btnExitItemA.classList.add('btn__item', 'a');
            const btnExitItemB = document.createElement('div');
            btnExitItemB.classList.add('btn__item', 'b');

            btnExit.appendChild(btnExitItemA);
            btnExit.appendChild(btnExitItemB);
            form.appendChild(btnExit);

            body.prepend(popup); // Добавляем полупрозрачный фон в body
            popup.appendChild(form); // Добавляем на форму на фон

            // Обработчик кнопки закрытия формы
            if (btnExit) {
                btnExit.addEventListener('click', function () {
                    popup.classList.replace('show', 'hide');
                    setTimeout(() => popup.remove(), 300);

                    btnExit.removeEventListener();
                });
            };

            // Обработчик отправки формы
            btn.addEventListener('click', function (e) {
                e.preventDefault();

                const formData = new FormData(form);

                const payload = {};
                formData.forEach((value, key) => {
                    payload[key] = value;
                });
                payload.isWeb = true;

                const remAnswer = {};

                fetch(`https://api.directual.com/good/api/v5/data/inputremind/newDraftRemind?appID=${appID}&sessionID=${sessionID}`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => response.json())
                .then(data => {
                    remAnswer.textRemind = data.result[0].textRemind;
                    remAnswer.id = data.result[0].id;
                    remAnswer.dateRemind = data.result[0].dateRemind;
                    remAnswer.timeRemind = data.result[0].timeRemind;

                    popup.classList.replace('show', 'hide');
                    popup.remove();

                    popup.style.display = 'flex';
                    popup.classList.add('popup-window', 'show');
                    
                });
            });
        });
    };
});