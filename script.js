// ============ 照片列表(photo-01 ~ photo-28) ============
var PHOTOS = [];
for (var i = 1; i <= 28; i++) {
    PHOTOS.push('photos/photo-' + (i < 10 ? '0' + i : i) + '.jpg');
}

var SLIDE_MS = 5000;   // 每张停留 5 秒

// ============ 生成轮播与小圆点 ============
var slideshow = document.getElementById('slideshow');
var dotsBox = document.getElementById('dots');
var current = 0;
var timer = null;

PHOTOS.forEach(function (src, idx) {
    var div = document.createElement('div');
    div.className = 'slide';
    var img = document.createElement('img');
    img.src = src;
    img.alt = '回忆 ' + (idx + 1);
    div.appendChild(img);
    slideshow.appendChild(div);

    var dot = document.createElement('span');
    dot.className = 'dot';
    dot.onclick = function () { show(idx); restartTimer(); };
    dotsBox.appendChild(dot);
});

var slides = slideshow.querySelectorAll('.slide');
var dots = dotsBox.querySelectorAll('.dot');

function show(idx) {
    current = (idx + PHOTOS.length) % PHOTOS.length;
    slides.forEach(function (s, i) { s.classList.toggle('active', i === current); });
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
}

function next() { show(current + 1); }
function restartTimer() {
    clearInterval(timer);
    timer = setInterval(next, SLIDE_MS);
}
// 点击任意处切换下一张
slideshow.onclick = function () { next(); restartTimer(); };

// 手机左右滑动
var touchX = null;
document.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; });
document.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) { show(current + (dx < 0 ? 1 : -1)); restartTimer(); }
    touchX = null;
});

show(0);
restartTimer();

// ============ 纪念日倒计时(自动指向下一个 10 月 12 日) ============
var START = new Date(2023, 9, 12);          // 在一起的第一天:2023-10-12
var ANNIV_MONTH = 9;                        // 月份从 0 数,9 = 10月
var ANNIV_DAY = 12;

function nextAnniversary(now) {
    var y = now.getFullYear();
    var thisYear = new Date(y, ANNIV_MONTH, ANNIV_DAY);
    var dayOver = new Date(y, ANNIV_MONTH, ANNIV_DAY + 1);   // 当天 24 点过后才算过完
    if (now >= dayOver) return new Date(y + 1, ANNIV_MONTH, ANNIV_DAY);
    return thisYear;
}

function isAnniversaryDay(now) {
    var d = new Date(now.getFullYear(), ANNIV_MONTH, ANNIV_DAY);
    return now.getMonth() === d.getMonth() && now.getDate() === d.getDate();
}

function pad(n) { return n < 10 ? '0' + n : '' + n; }

function tick() {
    var now = new Date();

    // 陪伴天数
    var days = Math.floor((now - START) / 86400000);
    document.getElementById('daysTogether').textContent = days;

    // 纪念日当天:切换文案并庆祝
    if (isAnniversaryDay(now)) {
        document.getElementById('cdLabel').textContent = '今天是我们的纪念日 🎉';
        document.getElementById('cdDay').textContent = '0';
        document.getElementById('cdHour').textContent = '0';
        document.getElementById('cdMin').textContent = '0';
        document.getElementById('cdSec').textContent = '0';
        return;
    }

    var target = nextAnniversary(now);
    var diff = Math.floor((target - now) / 1000);
    document.getElementById('cdLabel').textContent = '距离 ' + target.getFullYear() + ' 年纪念日';
    document.getElementById('cdDay').textContent = Math.floor(diff / 86400);
    document.getElementById('cdHour').textContent = pad(Math.floor(diff / 3600) % 24);
    document.getElementById('cdMin').textContent = pad(Math.floor(diff / 60) % 60);
    document.getElementById('cdSec').textContent = pad(diff % 60);
}
tick();
setInterval(tick, 1000);

// ============ 星星粒子 ============
var canvas = document.getElementById('stars');
var ctx = canvas.getContext('2d');
var stars = [];

function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
resize();
addEventListener('resize', resize);

// 生成 120 颗会闪烁的星星
for (var s = 0; s < 120; s++) {
    stars.push({
        x: Math.random(),
        y: Math.random() * 0.8,          // 集中在上半部分
        r: Math.random() * 1.4 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005
    });
}

(function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(function (st) {
        st.phase += st.speed;
        var alpha = 0.25 + 0.55 * (Math.sin(st.phase) + 1) / 2;   // 0.25 ~ 0.8 闪烁
        ctx.beginPath();
        ctx.arc(st.x * canvas.width, st.y * canvas.height, st.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + alpha.toFixed(3) + ')';
        ctx.fill();
    });
    requestAnimationFrame(drawStars);
})();

// ============ 音乐播放按钮 ============
var btn = document.getElementById('musicBtn');
var bgm = document.getElementById('bgm');

btn.onclick = function () {
    if (bgm.paused) {
        bgm.play();
        btn.classList.add('playing');
    } else {
        bgm.pause();
        btn.classList.remove('playing');
    }
};
