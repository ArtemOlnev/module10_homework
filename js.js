const chat = document.getElementById('chat');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const geoBtn = document.getElementById('geoBtn');

let socket;

function connectWebSocket() {
    socket = new WebSocket('wss://ws.postman-echo.com/raw/');

    socket.onopen = () => {
        appendMessage('Соединение установлено', 'server-message');
    };

    socket.onmessage = (event) => {
        if (event.data.includes('Геолокация:')) return; // Игнорируем ответ сервера на геолокацию
        appendMessage(event.data, 'server-message');
    };

    socket.onerror = (error) => {
        appendMessage(`Ошибка соединения: ${error.type}`, 'error-message');
    };

    socket.onclose = () => {
        appendMessage('Соединение закрыто', 'server-message');
    };
}

// Функция добавления сообщения в чат
function appendMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = message;
    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight;
}

// Отправка текстового сообщения
sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            appendMessage('Ошибка: соединение не активно', 'error-message');
            connectWebSocket(); // Пытаемся переподключиться
            return;
        }
        appendMessage(message, 'user-message');
        socket.send(message);
        messageInput.value = '';
    }
});

// Отправка геолокации
geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        appendMessage('Геолокация не поддерживается вашим браузером', 'error-message');
    } else {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const geoUrl = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
                appendMessage(`Моя геолокация: <a href="${geoUrl}" target="_blank">Открыть карту</a>`, 'geo-message');
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(`Геолокация: ${latitude}, ${longitude}`);
                }
            },
            (error) => {
                appendMessage(`Ошибка геолокации: ${error.message}`, 'error-message');
            }
        );
    }
});

// Инициализация соединения при загрузке страницы
connectWebSocket();
