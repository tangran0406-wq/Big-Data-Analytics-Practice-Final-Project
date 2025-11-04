document.addEventListener('DOMContentLoaded', () => {

    const gridContainer = document.getElementById('ppt-grid-container');

    fetch('ppt.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // 循环遍历从JSON文件获取的数据
            data.forEach(ppt => {
                // 1. 创建卡片容器 <div> (和原来一样)
                const card = document.createElement('div');
                card.className = 'ppt-card';

                // 2. 创建标题 <h2> (和原来一样)
                const title = document.createElement('h2');
                title.textContent = ppt.name;

                // 3. 创建悬停图片 <div> (和原来一样)
                const hoverImage = document.createElement('div');
                hoverImage.className = 'hover-image';
                // 悬停图片依然使用 'assets/picture/' 目录下的图片
                hoverImage.style.backgroundImage = `url('assets/picture/${ppt.name}.jpg')`;

                // 4. 组装卡片 (和原来一样)
                card.appendChild(hoverImage);
                card.appendChild(title);
                
                // 5. 【新增功能】为卡片添加点击事件监听器
                card.addEventListener('click', () => {
                    // 构建PDF文件的路径
                    const pdfPath = `assets/ebooks/${ppt.name}.pdf`;
                    
                    // 在新的标签页中打开这个路径
                    // window.open(url, target)
                    // target '_blank' 表示新标签页
                    window.open(pdfPath, '_blank');
                });

                // 6. 将完成的卡片添加到网格容器中 (和原来一样)
                gridContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('There was a problem fetching the PPT data:', error);
            gridContainer.textContent = 'Failed to load PPTs. Please check the console for errors.';
        });
});