// Глобальные переменные
let videosData = [];
let currentVideo = null;
let commentsData = {};

// DOM элементы
const videoPlayer = document.getElementById('main-video');
const videoTitle = document.getElementById('video-title');
const videoViews = document.getElementById('video-views');
const commentsList = document.getElementById('comments-list');
const usernameInput = document.getElementById('username');
const commentTextInput = document.getElementById('comment-text');
const submitCommentButton = document.getElementById('submit-comment');
const cancelCommentButton = document.getElementById('cancel-comment');
const suggestedList = document.getElementById('suggested-list');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

async function loadVideos() {
    try {
        const response = await fetch('videos.json');
        videosData = await response.json();
        loadCurrentVideo();
    } 

// Загрузка текущего видео на основе ID из URL
function loadCurrentVideo() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = parseInt(urlParams.get('id'));
    
    if (!videoId) {
        // Если ID не указан, перенаправляем на главную
        window.location.href = 'index.html';
        return;
    }
    
    currentVideo = videosData.find(video => video.id === videoId);
    
    if (!currentVideo) {
        // Если видео не найдено, перенаправляем на главную
        window.location.href = 'index.html';
        return;
    }
    
    // Обновляем данные видео
    videoPlayer.src = `video/${currentVideo.videoFile}`;
    videoPlayer.poster = `img/${currentVideo.thumbnail}`;
    videoTitle.textContent = currentVideo.title;
    videoViews.textContent = `${formatViews(currentVideo.views)} просмотров`;
    
    // Загружаем комментарии
    loadComments();
    
    // Обновляем рекомендованные видео
    renderSuggestedVideos();
}

// Форматирование чисел
function formatViews(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views;
}

// Загрузка комментариев
async function loadComments() {
    try {
        const response = await fetch(`kiments/${currentVideo.id}.json`);
        const comments = await response.json();
        commentsData[currentVideo.id] = comments;
        renderComments(comments);
    } catch (error) {
        console.error('Ошибка загрузки комментариев:', error);
        // Создаем пустой массив комментариев, если файл не найден
        commentsData[currentVideo.id] = [];
        commentsList.innerHTML = '<p class="no-comments">Пока нет комментариев. Будьте первым!</p>';
        
        // Пробуем загрузить из localStorage
        loadCommentsFromLocalStorage();
    }
}

// Загрузка комментариев из localStorage
function loadCommentsFromLocalStorage() {
    const storedComments = localStorage.getItem(`comments_${currentVideo.id}`);
    if (storedComments) {
        commentsData[currentVideo.id] = JSON.parse(storedComments);
        renderComments(commentsData[currentVideo.id]);
    }
}

// Отображение комментариев
function renderComments(comments) {
    commentsList.innerHTML = '';
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="no-comments">Пока нет комментариев. Будьте первым!</p>';
        return;
    }
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="comment-content">
                <div class="comment-author">${comment.author}</div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-meta">
                    <span>${new Date(comment.date).toLocaleDateString()}</span>
                    <span><i class="fas fa-thumbs-up"></i> ${comment.likes || 0}</span>
                </div>
            </div>
        `;
        commentsList.appendChild(commentElement);
    });
}

// Отправка комментария
async function submitComment() {
    const author = usernameInput.value.trim();
    const text = commentTextInput.value.trim();
    
    if (!author || !text) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    try {
        const newComment = {
            author,
            text,
            date: new Date().toISOString(),
            likes: 0
        };
        
        // Добавляем комментарий к текущим
        if (!commentsData[currentVideo.id]) {
            commentsData[currentVideo.id] = [];
        }
        commentsData[currentVideo.id].push(newComment);
        
        // Сохраняем в localStorage
        localStorage.setItem(`comments_${currentVideo.id}`, JSON.stringify(commentsData[currentVideo.id]));
        
        // Обновляем отображение
        renderComments(commentsData[currentVideo.id]);
        
        // Очищаем поле текста комментария
        commentTextInput.value = '';
        
        showNotification('Комментарий добавлен!', 'success');
        
    } catch (error) {
        console.error('Ошибка отправки комментария:', error);
        showNotification('Не удалось отправить комментарий. Попробуйте позже.', 'error');
    }
}

// Рендер рекомендованных видео
function renderSuggestedVideos() {
    suggestedList.innerHTML = '';
    
    // Фильтруем видео, исключая текущее
    const suggestedVideos = videosData.filter(video => video.id !== currentVideo.id);
    
    // Берем первые 4 видео для рекомендаций
    suggestedVideos.slice(0, 4).forEach(video => {
        const suggestedItem = document.createElement('div');
        suggestedItem.className = 'suggested-item';
        suggestedItem.innerHTML = `
            <img src="img/${video.thumbnail}" alt="${video.title}" class="suggested-thumb">
            <div class="suggested-info">
                <div class="suggested-title">${video.title}</div>
                <div class="suggested-channel">${video.channel}</div>
                <div class="suggested-views">${formatViews(video.views)} просмотров</div>
            </div>
        `;
        
        suggestedItem.addEventListener('click', () => {
            // Переходим на страницу просмотра видео с новым id
            window.location.href = `player.html?id=${video.id}`;
        });
        
        suggestedList.appendChild(suggestedItem);
    });
}

// Показать уведомление
function showNotification(message, type) {
    // Удаляем предыдущее уведомление, если есть
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Скрываем через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Переключение боковой панели
function toggleSidebar() {
    sidebar.classList.toggle('open');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем видео
    loadVideos();
    
    // Обработчики событий
    submitCommentButton.addEventListener('click', submitComment);
    
    cancelCommentButton.addEventListener('click', () => {
        commentTextInput.value = '';
    });
    
    // Обработчик для кнопки меню
    menuToggle.addEventListener('click', toggleSidebar);
    
    // Обработка нажатия клавиши Enter в поле комментария
    commentTextInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitComment();
        }
    });
});
