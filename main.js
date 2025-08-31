let videosData = [];
const videoListSection = document.getElementById('video-list');

async function loadVideos() {
    try {
        videoListSection.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';
        
        const response = await fetch('videos.json');
        if (!response.ok) {
            throw new Error('Не удалось загрузить данные о видео');
        }
        videosData = await response.json();
        renderVideoList();
    } catch (error) {
        console.error('Ошибка загрузки видео:', error);
        videoListSection.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Не удалось загрузить видео</h2>
                <p>Пожалуйста, проверьте наличие файла videos.json</p>
            </div>
        `;
    }
}

function renderVideoList() {
    videoListSection.innerHTML = '';
    
    videosData.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <div class="thumbnail-container">
                <img src="${video.thumbnailUrl}" alt="${video.title}" class="video-thumbnail" onerror="this.src='https://via.placeholder.com/320x200/333333/ffffff?text=Ошибка+загрузки+превью'">
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
            window.location.href = `player.html?id=${video.id}`;
        });
        
        videoListSection.appendChild(videoCard);
    });
}

function formatViews(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views;
}

document.addEventListener('DOMContentLoaded', () => {
    loadVideos();
});
