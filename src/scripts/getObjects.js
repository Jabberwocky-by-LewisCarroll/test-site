document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('objects');

    fetch('https://api.directual.com/good/api/v5/data/testApi/newTestUser?appID=640a9d7b-5015-4ea0-8206-a4eddcef054b&sessionID=')
        .then(response => response.json())
        .then(data => {
            console.log('Ответ сервера:', data);
            const objects = Array.isArray(data.payload) ? data.payload : [];
            if (objects.length > 0) {
                objects.forEach(obj => {
                    const div = document.createElement('div');
                    div.textContent = `Имя: ${obj.name}, Фамилия: ${obj.surname}, Email: ${obj.email}, Ответ: ${obj.responce}, ID: ${obj.id}`;

                    // Создаём обёртку для ссылки-кнопки
                    const buttonWrapper = document.createElement('div');
                    buttonWrapper.style.marginTop = '8px';

                    // Создаём ссылку и стилизуем её как кнопку
                    const link = document.createElement('a');
                    link.textContent = 'Подробнее';
                    link.href = `detailedInfo.html?id=${obj.id}`;
                    link.style.display = 'inline-block';
                    link.style.padding = '8px 16px';
                    link.style.background = '#1976d2';
                    link.style.color = '#fff';
                    link.style.borderRadius = '4px';
                    link.style.textDecoration = 'none';
                    link.style.transition = 'background 0.2s';
                    link.onmouseover = () => link.style.background = '#1565c0';
                    link.onmouseout = () => link.style.background = '#1976d2';

                    buttonWrapper.appendChild(link);
                    div.appendChild(document.createElement('br'));
                    div.appendChild(buttonWrapper);
                    container.appendChild(div);
                });
            } else {
                container.textContent = 'Нет данных';
            }
        })
        .catch(error => {
            container.textContent = 'Ошибка загрузки данных';
            console.error(error);
        });
});