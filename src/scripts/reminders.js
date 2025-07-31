document.addEventListener('DOMContentLoaded', function () {

    if (!localStorage.getItem('sessionID')) {
        window.location.href = '../index.html';
        return;
    }

    const containerComTab = document.querySelector('#remComContainer');
    const containerActTab = document.querySelector('#remActContainer');

    // Получаем шаблон из контейнера
    const tempComTab = containerComTab.querySelector('#remComTabRows');
    const tempActTab = containerActTab.querySelector('#remActTabRows');

    const sessionID = localStorage.getItem('sessionID');

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

        
        btnComTab.style.boxShadow = 'none';
        btnActTab.style.boxShadow = '0px 0px 10px 0px #000000 inset';

        btnComTab.addEventListener('click', function (e) {
            e.preventDefault();
            tabCom.style.display = 'table';
            tabAct.style.display = 'none';
            btnComTab.style.boxShadow = '0px 0px 10px 0px #000000 inset';
            btnActTab.style.boxShadow = 'none';
        });

        btnActTab.style.boxShadow = '0px 0px 10px 0px #000000 inset';
        btnActTab.addEventListener('click', function (e) {
            e.preventDefault();
            tabCom.style.display = 'none';
            tabAct.style.display = 'table';
            btnComTab.style.boxShadow = 'none';
            btnActTab.style.boxShadow = '0px 0px 10px 0px #000000 inset';
        });
});