// Глобальные переменные
let videosData = [];
let currentVideo = null;

// DOM элементы
const videoListSection = document.getElementById('video-list');
const videoPlayerSection = document.getElementById('video-player');
const videoPlayer = document.getElementById('main-video');
const videoTitle = document.getElementById('video-title');
const videoViews = document.getElementById('video-views');
const likesCount = document.getElementById('likes-count');
const dislikesCount = document.getElementById('dislikes-count');
const backButton = document.getElementById('back-button');
const commentsList = document.getElementById('comments-list');
const commentForm = document.querySelector('.comment-form');
const usernameInput = document.getElementById('username');
const commentTextInput = document.getElementById('comment-text');
const submitCommentButton = document.getElementById('submit-comment');

// Загрузка данных о видео
async function loadVideos() {
    try {
        const response = await fetch('videos.json');
        videosData = await response.json();
        renderVideoList();
    } catch (error) {
        console.error('Ошибка загрузки видео:', error);
        videoListSection.innerHTML = '<p class="error">Не удалось загрузить видео. Попробуйте позже.</p>';
    }
}

// Отображение списка видео
function renderVideoList() {
    videoListSection.innerHTML = '';
    
    videosData.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <img src="img/${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
            <div class="video-details">
                <h3 class="video-card-title">${video.title}</h3>
                <div class="video-meta">
                    <span>${formatViews(video.views)} просмотров</span>
                    <span>${formatLikes(video.likes)}</span>
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

function formatLikes(likes) {
    if (likes >= 1000000) {
        return (likes / 1000000).toFixed(1) + 'M likes';
    } else if (likes >= 1000) {
        return (likes / 1000).toFixed(1) + 'K likes';
    }
    return likes + ' likes';
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
    likesCount.textContent = formatViews(currentVideo.likes);
    dislikesCount.textContent = formatViews(currentVideo.dislikes);
    
    // Переключаем видимость секций
    videoListSection.classList.add('hidden');
    videoPlayerSection.classList.remove('hidden');
    
    // Загружаем комментарии
    loadComments();
}

// Назад к списку видео
backButton.addEventListener('click', () => {
    videoPlayerSection.classList.add('hidden');
    videoListSection.classList.remove('hidden');
    videoPlayer.pause();
});

// Загрузка комментариев
async function loadComments() {
    try {
        const response = await fetch(`kiments/${currentVideo.id}.json`);
        const comments = await response.json();
        renderComments(comments);
    } catch (error) {
        console.error('Ошибка загрузки комментариев:', error);
        commentsList.innerHTML = '<p class="error">Не удалось загрузить комментарии.</p>';
    }
}

// Отображение комментариев
function renderComments(comments) {
    commentsList.innerHTML = '';
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p>Пока нет комментариев. Будьте первым!</p>';
        return;
    }
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-author">${comment.author}</div>
            <div class="comment-text">${comment.text}</div>
            <div class="comment-date">${new Date(comment.date).toLocaleString()}</div>
        `;
        commentsList.appendChild(commentElement);
    });
}

// Отправка комментария
submitCommentButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const author = usernameInput.value.trim();
    const text = commentTextInput.value.trim();
    
    if (!author || !text) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    try {
        // В реальном приложении здесь должен быть запрос к серверу
        // Для демонстрации просто добавим комментарий локально
        const newComment = {
            author,
            text,
            date: new Date().toISOString()
        };
        
        // Загружаем текущие комментарии
        let comments = [];
        try {
            const response = await fetch(`kiments/${currentVideo.id}.json`);
            comments = await response.json();
        } catch (error) {
            console.log('Создаем новый файл комментариев');
        }
        
        // Добавляем новый комментарий
        comments.push(newComment);
        
        // В реальном приложении здесь должен быть запрос на сохранение
        console.log('Комментарий должен быть сохранен в', `kiments/${currentVideo.id}.json`);
        console.log('Содержимое:', JSON.stringify(comments, null, 2));
        
        // Обновляем отображение
        renderComments(comments);
        
        // Очищаем поля формы
        commentTextInput.value = '';
        
        alert('Комментарий добавлен! (в реальном приложении он бы сохранился на сервере)');
        
    } catch (error) {
        console.error('Ошибка отправки комментария:', error);
        alert('Не удалось отправить комментарий. Попробуйте позже.');
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadVideos();
});
