document.addEventListener('DOMContentLoaded', function () {

    if (!localStorage.getItem('sessionID')) {
        window.location.href = '../index.html';
        return;
    }

    // Сохраняем appID и sessionID для дальнейшего использования
    const appID = '640a9d7b-5015-4ea0-8206-a4eddcef054b';
    const sessionID = localStorage.getItem('sessionID');
    
    let currentEditingCard = null; // глобальная переменная для хранения карточки
    const container = document.querySelector('.obj-wrapper'); // Контейнер с карточками
    const template = container.querySelector('template'); // Шаблон карточки в контейнере

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
                const formEdit = document.querySelector('form.edit');
                if (formEdit) {
                    const nameInput = formEdit.querySelector('input[name="name"]');
                    const surnameInput = formEdit.querySelector('input[name="surname"]');
                    const emailInput = formEdit.querySelector('input[name="email"]');
                    const idInput = formEdit.querySelector('input[name="id"]');
                    const btnSubmit = formEdit.querySelector('button[type="submit"]');

                    let initialValues = {
                        name: nameInput.value,
                        surname: surnameInput.value,
                        email: emailInput.value,
                        id: idInput.value,
                    }

                    function checkFields() {
                        if (
                            nameInput.value !== initialValues.name ||
                            surnameInput.value !== initialValues.surname ||
                            emailInput.value !== initialValues.email ||
                            idInput.value !== initialValues.id
                        ) {
                            btnSubmit.disabled = false;
                        } else {
                            btnSubmit.disabled = true;
                        }
                    };

                    nameInput.addEventListener('input', checkFields);
                    surnameInput.addEventListener('input', checkFields);
                    emailInput.addEventListener('input', checkFields);
                    idInput.addEventListener('input', checkFields);

                    checkFields();
                    
                    const btnCardEdit = card.querySelector('.link-btn.edit');// Обработчик формы редактирования карточек
                    btnCardEdit.addEventListener('click', function(e) {
                        e.preventDefault();
                        const popup = document.querySelector('div.popup-window.edit');
                        popup.style.display = 'flex';
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
                };

                // Обработка кнопки "Удалить"
                const btnDelete = card.querySelector('.link-btn.delete');
                
                if (btnDelete) { // Проверка на наличие кнопки "Удалить"
                    btnDelete.addEventListener('click', function(e) {
                        e.preventDefault();

                        if(!confirm('Удалить карточку объекта?')) {
                            return;
                        };

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
        } else {
            container.innerHTML += '<p>Нет данных</p>';
        }
    })
    .catch(error => {
        container.innerHTML += '<p>Ошибка загрузки данных</p>';
        console.error(error);
    });
            
    // Обработчик кнопки "Добавить"
    const btnFormAdd = document.querySelector('button[type="button"].link-btn.add');
    btnFormAdd.addEventListener('click', function() {
        const popup = document.querySelector('div.popup-window.add');
        popup.style.display = 'flex';
        popup.classList.replace('hide', 'show');
    });

    // Обработчик формы добавления карточек
    const formAdd = document.querySelector('form.add');
    if (formAdd) {
        const nameInput = formAdd.querySelector('input[name="name"]');
        const surnameInput = formAdd.querySelector('input[name="surname"]');
        const emailInput = formAdd.querySelector('input[name="email"]');
        const btnSubmit = formAdd.querySelector('button[type="submit"]');

        function checkFields() {
            if (
                nameInput.value.trim() &&
                surnameInput.value.trim() && 
                emailInput.value.trim()
            ) {
                btnSubmit.disabled = false;
            } else {
                btnSubmit.disabled = true;
            }
        };

        nameInput.addEventListener('input', checkFields);
        surnameInput.addEventListener('input', checkFields);
        emailInput.addEventListener('input', checkFields);

        checkFields();

        formAdd.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = formAdd.elements['name'].value;
            const surname = formAdd.elements['surname'].value;
            const email = formAdd.elements['email'].value;

            fetch(`https://api.directual.com/good/api/v5/data/testApi/newTestUser?appID=${appID}&sessionID=${sessionID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "name": name,
                    "surname": surname,
                    "email": email
                })
            })
            .then(response => response.json())
            .then(result => {
                alert('Карточка объекта успешно добавлена!');
                const popup = document.querySelector('div.popup-window.add');
                popup.classList.replace('show', 'hide');

                const clone = template.content.cloneNode(true);
                const card = clone.querySelector('.obj-card');
                card.querySelector('.name').textContent = result.result[0].name;
                card.querySelector('.surname').textContent = result.result[0].surname;
                card.querySelector('.email').textContent = result.result[0].email;
                card.querySelector('.id').textContent = result.result[0].id;
                container.appendChild(card);
            })
            .catch(error => {
                console.log(error);
            })
        })
    };

        // Обработчик формы редактирования карточек
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
        });

    // Обработчик кнопки "Закрыть форму"
    const btnFormExit = document.querySelectorAll('.btn__exit-form')
    btnFormExit.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const popup = document.querySelectorAll('div.popup-window');
            popup.forEach(p => {
                p.classList.replace('show', 'hide');
                setTimeout(() => { p.style.display = 'none' }, 300);
            });
        });
    });
});