document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Заглушка для теста
        // Promise.resolve({
        //     result: {
        //         token: "acaf731e-03ca-45f8-ab4e-4310a007c844",
        //         username: "5652513695",
        //         role: "",
        //         nid: 23008
        //     },
        //     status: "ok"
        // })

        fetch('https://api.directual.com/good/api/v5/auth?appID=640a9d7b-5015-4ea0-8206-a4eddcef054b', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "provider": "rest",
                "username": data.login,
                "password": data.password,
            })
        })
        .then(response => response.json())
        .then(result => {

            if (result.status.toLowerCase() === 'ok') {
                window.localStorage.setItem('sessionID', result.result.token);
                window.localStorage.setItem('role', result.result.role);
                window.location.href = 'public/getObjectsV2.html';
            } else {
                alert('Ошибка авторизации: ' + result.message);
                return;
            }
        })
        .catch(error => {
            alert('Ошибка! Ответ сервера: ' + JSON.stringify(error));
            console.error(error);
        });
    });

    // Обработчик для чекбокса
    if (form) {
        const passwordInput = document.querySelector('#passwordInput');
        const togglePasswordType = document.querySelector('#togglePasswordType');

        if (passwordInput && togglePasswordType) {
            togglePasswordType.addEventListener('change', function () {
                if (passwordInput && togglePasswordType) {
                    passwordInput.type = togglePasswordType.checked ? 'text' : 'password';
                }
            });
        };
    }

    // Обработчик состояния кнопки "Войти"
    if (form) {
        const loginInput = document.querySelector('input[name="login"]');
        const passwordInput = document.querySelector('input[name="password"]');
        const btnSubmit = document.querySelector('button[type="submit"].link-btn');

        function checkFields() {
            if (loginInput.value.trim() && passwordInput.value.trim()) {
                btnSubmit.disabled = false;
            } else {
                btnSubmit.disabled = true;
            }
        }

        loginInput.addEventListener('input', checkFields);
        passwordInput.addEventListener('input', checkFields);

        checkFields();
    };

    // Анимация drag-and-drop для тестовых данных
    // Получаем все элементы, которые можем перетаскивать
    const draggables = document.querySelectorAll('div.test-data__input-draggable');
    // Получаем поля для ввода логина и пароля
    const loginInput = document.querySelector('input[name="login"]');
    const passwordInput = document.querySelector('input[name="password"]');
    // Переменная для хранения текущего перетаскиваемого элемента
    let isDraggable = null;
    // Начальные координаты мыши
    let startMouseX = 0;
    let startMouseY = 0;
    
    // С помощью метода массивов .forEach() добавляем обработчик события mousedown для каждого
    // перетаскиваемого элемента. При нажатии происходит сохранение координат мыши, а в переменную
    // isDraggable сохраняется перетаскиваемый элемент.
    draggables.forEach(item => {
        item.addEventListener('mousedown', function(e) {
            isDraggable = item;
            startMouseX = e.clientX;
            startMouseY = e.clientY;
            document.body.style.userSelect = 'none'; // Отмена функции выделения текста
        });
    });

    // Обработчик события передвижения мыши. С помощью переменной isDraggable проверяется
    // нажата ли кнопка мыши на элементе в данный момент. 
    document.addEventListener('mousemove', function(e) {
        if (isDraggable) {
            const dx = e.clientX - startMouseX;
            const dy = e.clientY - startMouseY;
            isDraggable.style.transform = `translate(${dx}px, ${dy}px)`;
        } else { return };
    });

    document.addEventListener('mouseup', function(e) {
        if (isDraggable) {
            const formRect = form.getBoundingClientRect();
            if (
                e.clientX >= formRect.left &&
                e.clientX <= formRect.right &&
                e.clientY >= formRect.top &&
                e.clientY <= formRect.bottom
            ) {
                const login = isDraggable.querySelector('p:first-child span').textContent;
                const password = isDraggable.querySelector('p:last-child span').textContent;
                loginInput.value = login;
                passwordInput.value = password;
            };
            // Возвращаем на место
            isDraggable.style.transform = '';
        }
        isDraggable = null;
        document.body.style.userSelect = '';
    });
});