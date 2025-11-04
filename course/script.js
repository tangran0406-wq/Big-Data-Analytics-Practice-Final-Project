// 当整个页面的HTML加载完成后执行
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 获取URL中的视频ID ---
    const urlParams = new URLSearchParams(window.location.search);
    const currentVideoId = urlParams.get('id');

    // --- DOM元素引用 ---
    const mainVideoPlayer = document.getElementById('main-video-player');
    const mainVideoTitle = document.getElementById('main-video-title');
    const mainVideoAuthorName = document.getElementById('main-video-author-name');
    const videoListContainer = document.getElementById('video-list-container');

    // --- 2. 获取并处理视频数据 ---
    fetch('videos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('网络错误，无法加载视频数据');
            }
            return response.json();
        })
        .then(videos => {
            // 如果URL中没有ID，或ID无效，则默认播放第一个视频
            const videoToPlay = videos.find(v => v.id === currentVideoId) || videos[0];
            
            // 3. 渲染主播放器
            renderMainPlayer(videoToPlay);

            // 4. 渲染推荐列表
            renderVideoList(videos);
        })
        .catch(error => {
            console.error('加载视频数据失败:', error);
            mainVideoTitle.textContent = '无法加载视频';
        });
    
    /**
     * 渲染主视频播放器
     * @param {object} video - 要播放的视频对象
     */
    function renderMainPlayer(video) {
        if (!video) return;
        mainVideoPlayer.src = video.embedUrl;
        mainVideoTitle.textContent = video.title;
        mainVideoAuthorName.textContent = video.author || '未知作者'; // 从 video 对象读取 author
        document.title = video.title; // 同时更新页面标题
    }

    /**
     * 渲染右侧的视频推荐列表
     * @param {Array<object>} videos - 所有视频的数据数组
     */
    function renderVideoList(videos) {
        // 清空容器，防止重复渲染
        videoListContainer.innerHTML = ''; 

        videos.forEach(video => {
            // 创建列表项的外部容器
            const itemDiv = document.createElement('div');
            itemDiv.className = 'video-list-item';

            // 创建链接，点击后跳转到对应的播放页面
            const link = document.createElement('a');
            // 使用 ?id=... 的方式传递视频ID
            link.href = `player.html?id=${video.id}`;

            // 创建左侧视频预览部分
            const previewDiv = document.createElement('div');
            previewDiv.className = 'video-preview';
            const previewIframe = document.createElement('iframe');
            previewIframe.src = video.embedUrl;
            previewIframe.setAttribute('frameborder', '0');
            // 禁止预览视频的交互，使其仅作为封面展示
            previewIframe.style.pointerEvents = 'none'; 
            previewDiv.appendChild(previewIframe);

            // 创建右侧视频信息部分
            const infoDiv = document.createElement('div');
            infoDiv.className = 'video-info';

            const titleP = document.createElement('p');
            titleP.className = 'title';
            titleP.textContent = video.title;

            const authorP = document.createElement('p');
            authorP.className = 'author';
            authorP.textContent = video.author || '未知作者';
            
            infoDiv.appendChild(titleP);
            infoDiv.appendChild(authorP);
            
            // 将预览和信息添加到链接中
            link.appendChild(previewDiv);
            link.appendChild(infoDiv);

            // 将链接添加到列表项容器中
            itemDiv.appendChild(link);
            
            // 将最终的列表项添加到主列表容器中
            videoListContainer.appendChild(itemDiv);
        });
    }
});