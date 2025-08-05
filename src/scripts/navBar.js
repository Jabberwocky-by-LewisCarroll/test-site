document.addEventListener('DOMContentLoaded', function () {
    const navBar = document.querySelector('#navbar');

    // Скрипт влияет на кнопку в навигации, которая ведёт на текущую страницу.
    // Если кнопка ведёт на текущую страницу, то она будет неактивна.
    function disableCurrentPageLink() {
        const currentPage = location.pathname.split('/').pop();
        const btn = document.querySelector(`a[href="${currentPage}"].link-btn`);

        if (btn && btn.getAttribute('href') === currentPage) {
            btn.setAttribute('aria-disabled', 'true');
        }
    };

    // Кнопка для выхода их аккаунта
    // Удаляет sessionID из localStorage и перенаправляет на страницу авторизации
    function logOutBtn () {
        const logoutBtn = document.querySelector('#logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.localStorage.removeItem('sessionID');
                window.location.href = '/index.html';
        });
        };
    };

    // Генерация навбара
    if (navBar) {
        fetch('../public/navBar.html')
        .then(response => response.text())
        .then(html => {
            navBar.innerHTML = html;
            disableCurrentPageLink(); // Вызов функции для отключения кнопки текущей страницы
            logOutBtn();
        })
        .catch(error => {
            console.log('Ошибка генерации навбара: ', error)
        });
    };
});