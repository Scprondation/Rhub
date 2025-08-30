// Глобальные переменные
let videosData = [];
let currentVideo = null;

// DOM элементы
const videoListSection = document.getElementById('video-list');
const videoPlayerSection = document.getElementById('video-player');
const videoPlayer = document.getElementById('main-video');
const videoTitle = document.getElementById('video-title');
const videoViews = document.getElementById('video-views');
const backButton = document.getElementById('back-button');
const commentsList = document.getElementById('comments-list');
const usernameInput = document.getElementById('username');
const commentTextInput = document.getElementById('comment-text');
const submitCommentButton = document.getElementById('submit-comment');
const cancelCommentButton = document.getElementById('cancel-comment');
const suggestedList = document.querySelector('.suggested-list');

// Загрузка данных о видео
async function loadVideos() {
    try {
        // В реальном приложении здесь будет fetch к videos.json
        // Для демонстрации используем временные данные
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
            },
            {
                id: 5,
                title: "React vs Vue - что выбрать в 2023 году?",
                views: 221000,
                likes: 14300,
                dislikes: 210,
                videoFile: "video5.mp4",
                thumbnail: "thumb5.jpg",
                channel: "Framework Wars",
                duration: "27:09"
            },
            {
                id: 6,
                title: "Анимации на CSS - создаем потрясающие эффекты",
                views: 98000,
                likes: 7800,
                dislikes: 95,
                videoFile: "video6.mp4",
                thumbnail: "thumb6.jpg",
                channel: "CSS Animations",
                duration: "21:45"
            }
        ];
        
        renderVideoList();
        renderSuggestedVideos();
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
            <div class="thumbnail-container">
                <img src="img/${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
                <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-meta">
                    <span class="channel-name">${video.channel}</span>
                    <span class="video-views">${formatViews(video.views)} просмотров</span>
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
    videoListSection.classList.add('hidden');
    videoPlayerSection.classList.remove('hidden');
    
    // Прокручиваем к верху страницы
    window.scrollTo(0, 0);
    
    // Загружаем комментарии
    loadComments();
}

// Загрузка комментариев
async function loadComments() {
    try {
        // В реальном приложении здесь будет fetch к kiments/[videoId].json
        // Для демонстрации используем временные данные
        const comments = [
            {
                author: "Алексей Петров",
                text: "Отличное видео, многому научился! Спасибо за качественный контент.",
                date: "2023-05-15T14:30:22Z",
                likes: 42
            },
            {
                author: "Мария Иванова",
                text: "Очень подробное объяснение. Жду продолжения на эту тему!",
                date: "2023-05-16T09:12:45Z",
                likes: 28
            },
            {
                author: "Дмитрий Смирнов",
                text: "Спасибо за видео! Есть вопрос по поводу части в 12:35 - можно ли реализовать это иначе?",
                date: "2023-05-17T18:40:13Z",
                likes: 15
            }
        ];
        
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
            <div class="comment-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="comment-content">
                <div class="comment-author">${comment.author}</div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-meta">
                    <span>${new Date(comment.date).toLocaleDateString()}</span>
                    <span><i class="fas fa-thumbs-up"></i> ${comment.likes}</span>
                </div>
            </div>
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
        // В реальном приложении здесь будет запрос к серверу
        const newComment = {
            author,
            text,
            date: new Date().toISOString(),
            likes: 0
        };
        
        // Загружаем текущие комментарии
        let comments = [];
        try {
            // В реальном приложении - fetch к kiments/[videoId].json
            comments = [
                {
                    author: "Алексей Петров",
                    text: "Отличное видео, многому научился! Спасибо за качественный контент.",
                    date: "2023-05-15T14:30:22Z",
                    likes: 42
                }
            ];
        } catch (error) {
            console.log('Создаем новый файл комментариев');
        }
        
        // Добавляем новый комментарий
        comments.push(newComment);
        
        // В реальном приложении здесь будет сохранение на сервере
        console.log('Комментарий должен быть сохранен в', `kiments/${currentVideo.id}.json`);
        
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

// Отмена комментария
cancelCommentButton.addEventListener('click', () => {
    usernameInput.value = '';
    commentTextInput.value = '';
});

// Рендер рекомендованных видео
function renderSuggestedVideos() {
    suggestedList.innerHTML = '';
    
    // Берем первые 5 видео для рекомендаций
    const suggestedVideos = videosData.slice(0, 5);
    
    suggestedVideos.forEach(video => {
        if (currentVideo && video.id === currentVideo.id) return; // Пропускаем текущее видео
        
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadVideos();
    
    // Обработчик для кнопки меню
    document.querySelector('.menu-toggle').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('collapsed');
    });
});
