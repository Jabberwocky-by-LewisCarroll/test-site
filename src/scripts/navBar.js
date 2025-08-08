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
        const logoutBtns = document.querySelectorAll('.logoutBtn');
        if (logoutBtns.length > 0) {
            logoutBtns.forEach(btn => btn.addEventListener('click', function (e) {
                e.preventDefault();
                window.localStorage.removeItem('sessionID');
                window.location.href = '/index.html';
            }));
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

            // Обработчик кнопки бургер-меню
            const navbarBurger = document.querySelector('.navbar__btn-burger');
            const navbarContainerMob = document.querySelector('.navbar__container-mob');
            const popupWindow = document.createElement('div');
            popupWindow.classList.add('popup-window', 'hide');
            document.body.prepend(popupWindow)
            
            if (navbarBurger) {
                navbarBurger.addEventListener('click', () => {
                    if (navbarBurger.classList.contains('closed')) {
                        navbarContainerMob.classList.replace('hide', 'show');
                        popupWindow.classList.replace('hide', 'show')
                        navbarBurger.classList.replace('closed', 'opened');
                    } else {
                        navbarContainerMob.classList.replace('show', 'hide');
                        popupWindow.classList.replace('show', 'hide');
                        navbarBurger.classList.replace('opened', 'closed');
                    };
                });
            };
        })
        .catch(error => {
            console.log('Ошибка генерации навбара: ', error)
        });
    };
});