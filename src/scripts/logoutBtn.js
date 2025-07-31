document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.querySelector('#logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.localStorage.removeItem('sessionID');
                alert('sessionID deleted!');
                window.location.href = logoutBtn.href;
            })
        }
})