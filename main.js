// Глобальные переменные
let videosData = [];

// DOM элементы
const videoListSection = document.getElementById('video-list');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

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
        
        videoCard.addEventListener('click', () => {
            // Переходим на страницу просмотра видео с параметром id
            window.location.href = `player.html?id=${video.id}`;
        });
        
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

// Переключение боковой панели
function toggleSidebar() {
    sidebar.classList.toggle('open');
}

// Показать уведомление
function showNotification(message, type) {
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем видео
    loadVideos();
    
    // Обработчик для кнопки меню
    menuToggle.addEventListener('click', toggleSidebar);
});
