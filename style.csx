/* Общие стили */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Roboto', Arial, sans-serif;
    background-color: #0f0f0f;
    color: #f1f1f1;
    line-height: 1.6;
}

.hidden {
    display: none !important;
}

/* Шапка */
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #0f0f0f;
    border-bottom: 1px solid #272727;
    position: sticky;
    top: 0;
    z-index: 100;
}

.logo h1 {
    color: #ff0000;
    font-size: 1.8rem;
}

.search {
    display: flex;
}

.search input {
    padding: 0.5rem 1rem;
    background-color: #121212;
    border: 1px solid #303030;
    color: #f1f1f1;
    border-radius: 2px 0 0 2px;
    width: 400px;
}

.search button {
    padding: 0.5rem 1rem;
    background-color: #303030;
    border: 1px solid #303030;
    color: #f1f1f1;
    border-radius: 0 2px 2px 0;
    cursor: pointer;
}

.search button:hover {
    background-color: #404040;
}

/* Контейнер для видео */
.video-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 2rem;
}

.video-card {
    background-color: #181818;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, background-color 0.2s;
    cursor: pointer;
}

.video-card:hover {
    background-color: #272727;
    transform: scale(1.03);
}

.video-thumbnail {
    width: 100%;
    height: 180px;
    object-fit: cover;
}

.video-details {
    padding: 1rem;
}

.video-card-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.video-meta {
    color: #aaa;
    font-size: 0.9rem;
}

/* Видеоплеер */
#video-player {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.player-container {
    margin-bottom: 2rem;
}

#main-video {
    width: 100%;
    border-radius: 8px;
    background-color: #000;
}

.video-info {
    margin: 1rem 0;
}

.video-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    color: #aaa;
}

.reactions {
    display: flex;
    gap: 1rem;
}

.like-btn, .dislike-btn {
    background: none;
    border: none;
    color: #aaa;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 4px;
}

.like-btn:hover, .dislike-btn:hover {
    background-color: #272727;
}

/* Секция комментариев */
.comments-section {
    margin-top: 2rem;
}

.comment-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
    background-color: #181818;
    padding: 1.5rem;
    border-radius: 8px;
}

.comment-form input, .comment-form textarea {
    padding: 0.8rem;
    background-color: #121212;
    border: 1px solid #303030;
    color: #f1f1f1;
    border-radius: 4px;
}

.comment-form textarea {
    min-height: 100px;
    resize: vertical;
}

#submit-comment {
    padding: 0.8rem;
    background-color: #ff0000;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    align-self: flex-end;
    width: 150px;
}

#submit-comment:hover {
    background-color: #cc0000;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.comment {
    background-color: #181818;
    padding: 1rem;
    border-radius: 8px;
}

.comment-author {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #f1f1f1;
}

.comment-text {
    color: #ddd;
}

#back-button {
    padding: 0.8rem 1.5rem;
    background-color: #303030;
    color: #f1f1f1;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

#back-button:hover {
    background-color: #404040;
}

/* Подвал */
footer {
    text-align: center;
    padding: 2rem;
    border-top: 1px solid #272727;
    color: #aaa;
    margin-top: 2rem;
}

/* Адаптивность */
@media (max-width: 768px) {
    header {
        flex-direction: column;
        gap: 1rem;
    }
    
    .search input {
        width: 100%;
    }
    
    .video-container {
        grid-template-columns: 1fr;
        padding: 1rem;
    }
    
    #video-player {
        padding: 1rem;
    }
}
