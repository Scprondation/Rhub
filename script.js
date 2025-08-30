// Глобальные переменные
let videosData = [];
let currentVideo = null;
let commentsData = {};

// DOM элементы
const videoListSection = document.getElementById('video-list');
const videoPlayerSection = document.getElementById('video-player');
const videoPlayer = document.getElementById('main-video');
const videoTitle = document.getElementById('video-title');
const videoViews = document.getElementById('video-views');
const commentsList = document.getElementById('comments-list');
const usernameInput = document.getElementById('username');
const commentTextInput = document.getElementById('comment-text');
const submitCommentButton = document.getElementById('submit-comment');
const cancelCommentButton = document.getElementById('cancel-comment');
const suggestedList = document.querySelector('.suggested-list');
const sidebar = document.querySelector('.sidebar');
const menuToggle = document.querySelector('.menu-toggle');

// Загрузка данных о видео
async function loadVideos() {
    try {
        const response = await fetch('videos.json');
        videosData = await response.json();
        renderVideoList();
    } catch (error) {
        console.error('Ошибка загрузки видео:', error);
        // Используем демо-данные если файл не найден
        videosData = [
            {
                id: 1,
                title: "Как создать сайт за 10 минут - полное руководство для начинающих",
                views: 125000,
                likes: 8500,
                dislikes: 120,
                videoFile: "video1.mp4",
                thumbnail: "thumb1.jpg",
                channel: "WebDev Master",
                duration: "15:22"
            },
            {
                id: 2,
                title: "Изучение JavaScript для начинающих - полный курс 2023",
                views: 480000,
                likes: 24500,
                dislikes: 350,
                videoFile: "video2.mp4",
                thumbnail: "thumb2.jpg",
                channel: "CodeWithMe",
                duration: "32:18"
            },
            {
                id: 3,
                title: "Верстка на CSS Grid и Flexbox - современные техники",
                views: 89000,
                likes: 6200,
                dislikes: 85,
                videoFile: "video3.mp4",
                thumbnail: "thumb3.jpg",
                channel: "Frontend Pro",
                duration: "24:47"
            },
            {
                id: 4,
                title: "Создание темной темы для сайта - полное руководство",
                views: 156000,
                likes: 11200,
                dislikes: 140,
                videoFile: "video4.mp4",
                thumbnail: "thumb4.jpg",
                channel: "UI Secrets",
                duration: "18:33"
            }
        ];
        renderVideoList();
    }
}

// Отображение списка видео
function renderVideoList() {
    videoListSection.innerHTML = '';
    
    videosData.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <div class="thumbnail-container">
                <img src="img/${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
                <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-meta">
                    <span class="channel-name">${video.channel}</span>
                    <span class="video-stats">${formatViews(video.views)} просмотров</span>
                </div>
            </div>
        `;
        
        videoCard.addEventListener('click', () => openVideo(video.id));
        videoListSection.appendChild(videoCard);
    });
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

// Открытие видео
function openVideo(videoId) {
    currentVideo = videosData.find(video => video.id === videoId);
    
    if (!currentVideo) return;
    
    // Обновляем данные видео
    videoPlayer.src = `video/${currentVideo.videoFile}`;
    videoPlayer.poster = `img/${currentVideo.thumbnail}`;
    videoTitle.textContent = currentVideo.title;
    videoViews.textContent = `${formatViews(currentVideo.views)} просмотров`;
    
    // Переключаем видимость секций
    videoListSection.style.display = 'none';
    videoPlayerSection.style.display = 'grid';
    
    // Прокручиваем к верху страницы
    window.scrollTo(0, 0);
    
    // Загружаем комментарии
    loadComments();
    
    // Обновляем рекомендованные видео
    renderSuggestedVideos();
}

// Назад к списку видео
function backToVideos() {
    videoPlayerSection.style.display = 'none';
    videoListSection.style.display = 'grid';
    videoPlayer.pause();
    
    // Очищаем поля комментариев
    usernameInput.value = '';
    commentTextInput.value = '';
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
        
        // В реальном приложении здесь должен быть запрос на сохранение на сервере
        // Для демонстрации используем localStorage
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
        
        suggestedItem.addEventListener('click', () => openVideo(video.id));
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
    sidebar.classList.toggle('collapsed');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем видео
    loadVideos();
    
    // Скрываем плеер при загрузке
    videoPlayerSection.style.display = 'none';
    
    // Обработчики событий
    submitCommentButton.addEventListener('click', submitComment);
    
    cancelCommentButton.addEventListener('click', () => {
        commentTextInput.value = '';
    });
    
    // Обработчик для кнопки меню
    menuToggle.addEventListener('click', toggleSidebar);
    
    // Добавляем кнопку назад в плеер
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Назад к видео';
    backButton.addEventListener('click', backToVideos);
    
    const playerWrapper = document.querySelector('.player-wrapper');
    playerWrapper.insertBefore(backButton, playerWrapper.firstChild);
    
    // Загрузка комментариев из localStorage (для демо)
    loadCommentsFromLocalStorage();
});

// Загрузка комментариев из localStorage (для демонстрации)
function loadCommentsFromLocalStorage() {
    videosData.forEach(video => {
        const storedComments = localStorage.getItem(`comments_${video.id}`);
        if (storedComments) {
            commentsData[video.id] = JSON.parse(storedComments);
        }
    });
}

// Обработка нажатия клавиши Enter в поле комментария
commentTextInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitComment();
    }
});
