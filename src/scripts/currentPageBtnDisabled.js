// Скрипт влияет на кнопку в навигации, которая ведёт на текущую страницу.
// Если кнопка ведёт на текущую страницу, то она будет неактивна.

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = location.pathname.split('/').pop();
    const btn = document.querySelector(`.link-btn[href="${currentPage}"]`);

    if (btn.getAttribute('href') === currentPage) {
        btn.setAttribute('aria-disabled', 'true')
    }
})