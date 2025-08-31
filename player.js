let videosData = [];
let currentVideo = null;

const videoPlayer = document.getElementById('main-video');
const videoTitle = document.getElementById('video-title');
const videoViews = document.getElementById('video-views');
const videoDate = document.getElementById('video-date');
const suggestedList = document.getElementById('suggested-list');

async function loadVideos() {
    try {
        const response = await fetch('videos.json');
        if (!response.ok) {
            throw new Error('Не удалось загрузить данные о видео');
        }
        videosData = await response.json();
        loadCurrentVideo();
    } catch (error) {
        console.error('Ошибка загрузки видео:', error);
        document.body.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Не удалось загрузить видео</h2>
                <p>Пожалуйста, проверьте наличие файла videos.json</p>
                <a href="index.html" class="back-button">Вернуться на главную</a>
            </div>
        `;
    }
}

function loadCurrentVideo() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = parseInt(urlParams.get('id'));
    
    if (!videoId) {
        window.location.href = 'index.html';
        return;
    }
    
    currentVideo = videosData.find(video => video.id === videoId);
    
    if (!currentVideo) {
        window.location.href = 'index.html';
        return;
    }
    
    videoPlayer.innerHTML = `
        <source src="${currentVideo.videoUrl}" type="video/mp4">
        Ваш браузер не поддерживает видео тег.
    `;
    
    videoPlayer.poster = currentVideo.thumbnailUrl;
    videoTitle.textContent = currentVideo.title;
    videoViews.textContent = `${formatViews(currentVideo.views)} просмотров`;
    videoDate.textContent = `Опубликовано: ${formatDate(currentVideo.date)}`;
    
    // Настройка обработчиков ошибок для видео
    videoPlayer.addEventListener('error', function() {
        console.error('Ошибка загрузки видео:', currentVideo.videoUrl);
        videoPlayer.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #ff3366;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 16px;"></i>
                <p>Не удалось загрузить видео. Пожалуйста, проверьте ссылку.</p>
                <p><small>${currentVideo.videoUrl}</small></p>
            </div>
        `;
    });
    
    renderSuggestedVideos();
}

function formatViews(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

function renderSuggestedVideos() {
    suggestedList.innerHTML = '';
    
    const suggestedVideos = videosData.filter(video => video.id !== currentVideo.id);
    
    suggestedVideos.slice(0, 4).forEach(video => {
        const suggestedItem = document.createElement('div');
        suggestedItem.className = 'suggested-item';
        suggestedItem.innerHTML = `
            <img src="${video.thumbnailUrl}" alt="${video.title}" class="suggested-thumb" onerror="this.src='https://via.placeholder.com/160x90/333333/ffffff?text=Ошибка+загрузки'">
            <div class="suggested-info">
                <div class="suggested-title">${video.title}</div>
                <div class="suggested-channel">${video.channel}</div>
                <div class="suggested-views">${formatViews(video.views)} просмотров</div>
            </div>
        `;
        
        suggestedItem.addEventListener('click', () => {
            window.location.href = `player.html?id=${video.id}`;
        });
        
        suggestedList.appendChild(suggestedItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadVideos();
});
