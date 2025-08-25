document.addEventListener('DOMContentLoaded', function () {
    const navBar = document.querySelector('#navbar');

    // Глобальная переменная для управления анимацией через консоль
    window.tl = gsap.timeline();

    // Скрипт влияет на кнопку в навигации, которая ведёт на текущую страницу.
    // Если кнопка ведёт на текущую страницу, то она будет неактивна.
    function disableCurrentPageLink() {
        const currentPage = location.pathname.split('/').pop();
        const btns = document.querySelectorAll(`a[href="${currentPage}"].link-btn`);

        if (btns) {
            btns.forEach(btn => {
                if (btn.getAttribute('href') === currentPage) {
                    btn.setAttribute('aria-disabled', 'true');
                }
            });
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
                window.localStorage.removeItem('role');
                window.location.href = '../index.html';
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
            // Объекты иконки бургера для анимации
            const burgerItemTop = document.querySelector('.navbar__btn-burger_item.top');
            const burgerItemMid = document.querySelector('.navbar__btn-burger_item.mid');
            const burgerItembot = document.querySelector('.navbar__btn-burger_item.bot');
            
            if (navbarBurger) {
                navbarBurger.addEventListener('click', () => {
                    
                    let popupWindow = document.querySelector('.popup-window')
                    if (!popupWindow) {
                    popupWindow = document.createElement('div');
                    popupWindow.classList.add('popup-window', 'hide');
                    document.body.prepend(popupWindow);
                    };

                    if (navbarBurger.classList.contains('closed')) {
                        navbarContainerMob.style.display = 'flex';
                        navbarContainerMob.classList.replace('hide', 'show');
                        popupWindow.classList.replace('hide', 'show')
                        navbarBurger.classList.replace('closed', 'opened');

                        // Анимация иконки бургера на открытие меню
                        tl.to(burgerItemTop, {y: '0.875rem', duration: 0.1, ease: 'in.out'})
                        tl.to(burgerItembot, {y: '-0.875rem', duration: 0.1, ease: 'in.out'}, '<')
                        tl.to(burgerItemMid, {opacity: 0, duration: 0.1, ease: 'in.out'})
                        tl.to(burgerItemTop, {rotation: 45, duration: 0.1, ease: 'in.out'})
                        tl.to(burgerItembot, {rotation: '-45', duration: 0.1, ease: 'in.out'}, '<');
                    } else {
                        navbarContainerMob.classList.replace('show', 'hide');
                        popupWindow.classList.replace('show', 'hide');
                        navbarBurger.classList.replace('opened', 'closed');
                        setTimeout(() => {
                            navbarContainerMob.style.display = 'none';
                            const popupWindowRemove = document.querySelector('.popup-window');
                            popupWindowRemove.remove();
                        }, 300);

                        // Анимация иконки бургера на закрытие меню
                        tl.to(burgerItembot, {rotation: 0, duration: 0.1, ease: 'in.out'})
                        tl.to(burgerItemTop, {rotation: 0, duration: 0.1, ease: 'in.out'}, '<')
                        tl.to(burgerItemMid, {opacity: 1, duration: 0.1, ease: 'in.out'})
                        tl.to(burgerItembot, {y: 0, duration: 0.1, ease: 'in.out'})
                        tl.to(burgerItemTop, {y: 0, duration: 0.1, ease: 'in.out'}, '<');
                    };
                });
            };
        })
        .catch(error => {
            console.log('Ошибка генерации навбара: ', error)
        });
    };
});