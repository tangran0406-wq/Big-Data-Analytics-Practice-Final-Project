// 主题切换（可选）
document.getElementById('themeToggle')?.addEventListener('click', () => {
  const d = document.documentElement;
  const dark = d.dataset.theme !== 'light';
  d.dataset.theme = dark ? 'light' : 'dark';
});

// 顶部搜索快捷键：按 / 聚焦
const s = document.getElementById('globalSearch');
window.addEventListener('keydown', e => {
  if (e.key === '/') { e.preventDefault(); s?.focus(); }
});

// 轮播
(function () {
  const root = document.querySelector('.slider');
  if (!root) return;

  const slides = [...root.querySelectorAll('.slide')];
  const dotsBox = root.querySelector('.dots');
  let i = 0, timer = null, paused = false;

  // dots
  slides.forEach((_, idx) => {
    const b = document.createElement('button');
    if (idx === 0) b.classList.add('is-active');
    b.addEventListener('click', () => go(idx, true));
    dotsBox.appendChild(b);
  });
  const dots = [...dotsBox.children];

  function go(n, fromUser) {
    slides[i].classList.remove('is-active');
    dots[i].classList.remove('is-active');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('is-active');
    dots[i].classList.add('is-active');
    if (fromUser) restart();
  }
  const next = () => go(i + 1);
  const prev = () => go(i - 1);
  const start = () => { timer = setInterval(next, 4000); };
  const stop = () => { clearInterval(timer); timer = null; };
  const restart = () => { stop(); start(); };

  root.querySelector('.next')?.addEventListener('click', next);
  root.querySelector('.prev')?.addEventListener('click', prev);
  root.addEventListener('mouseenter', () => { paused = true; stop(); });
  root.addEventListener('mouseleave', () => { if (paused) { paused = false; start(); } });

  start();
})();

// 互动区本地交互：评分、问答、上传
(() => {
  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

  // 评分
  (function () {
    const rating = document.getElementById('rating'); if (!rating) return;
    let score = 0;
    function paint(n) { rating.querySelectorAll('i').forEach((s, i) => s.className = (i < n) ? 'ri-star-fill' : 'ri-star-line'); }
    rating.querySelectorAll('i').forEach(star => {
      star.addEventListener('mouseenter', () => paint(+star.dataset.star));
      star.addEventListener('click', () => { score = +star.dataset.star; paint(score); });
    });
    rating.addEventListener('mouseleave', () => paint(score));
    const reviews = document.getElementById('reviews');
    document.getElementById('saveReview')?.addEventListener('click', () => {
      const box = document.getElementById('reviewText'); const txt = box?.value?.trim(); if (!txt) return;
      const safe = txt.replace(/[&<>\"']/g, ch => ESC[ch]);
      const row = document.createElement('div'); row.className = 'fileitem';
      row.innerHTML = `<div>
        <span style="color:#fbbf24">${'★'.repeat(score || 5)}${'☆'.repeat(5 - (score || 5))}</span>
        <span class="muted" style="margin-left:6px">${new Date().toLocaleString()}</span>
        <div style="margin-top:4px">${safe}</div>
      </div>`;
      reviews?.appendChild(row); if (box) box.value = '';
    });
  })();

  // 提问
  (function () {
    const qaList = document.getElementById('qaList'); const btn = document.getElementById('addQuestion'); const input = document.getElementById('qaInput');
    if (!qaList || !btn || !input) return;
    btn.addEventListener('click', () => {
      const v = input.value.trim(); if (!v) return;
      const row = document.createElement('div'); row.className = 'fileitem'; row.textContent = v;
      qaList.appendChild(row); input.value = '';
    });
  })();

  // 上传
  (function () {
    const drop = document.getElementById('drop'); const fileList = document.getElementById('fileList'); const fileInput = document.getElementById('fileInput');
    if (!drop || !fileList || !fileInput) return;
    function addFiles(files) {
      for (const f of files) {
        const row = document.createElement('div'); row.className = 'fileitem';
        row.textContent = `${f.name} (${Math.round(f.size / 1024)} KB)`;
        fileList.appendChild(row);
      }
    }
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('drag'); }));
    drop.addEventListener('drop', e => addFiles(e.dataTransfer.files));
    fileInput.addEventListener('change', e => addFiles(e.target.files));
  })();
})();

// 教学视频：悬停播放与缩放
(() => {
  document.querySelectorAll('.video-card').forEach(card => {
    const v = card.querySelector('video');
    if (!v) return;

    // 更稳的自动播放设置
    v.muted = true;         // 静音以允许自动播放
    v.playsInline = true;   // iOS 内联播放
    v.loop = true;          // 循环
    v.preload = 'metadata'; // 先取元信息，节省带宽

    const play = () => v.play().catch(() => { });
    const stop = () => { v.pause(); v.currentTime = 0; };

    // 悬停 / 离开
    card.addEventListener('mouseenter', play);
    card.addEventListener('mouseleave', stop);

    // 键盘可访问性：聚焦/失焦
    card.addEventListener('focusin', play);
    card.addEventListener('focusout', stop);

    // 触屏：点击切换播放
    card.addEventListener('click', () => (v.paused ? play() : stop()));
  });
})();

