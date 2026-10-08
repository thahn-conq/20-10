/* ==========================================================================
   20/10 VIETNAMESE WOMEN'S DAY - MAIN JAVASCRIPT
   ========================================================================== */

// 1. Trái tim SVG chữ chạy chuyển động mượt mà
const shape = document.getElementById("shape");
const partialPath = document.getElementById("partialPath");
let rid = null;
const SVG_NS = "http://www.w3.org/2000/svg";
const pathlength = shape ? shape.getTotalLength() : 0;
let t = 0;
let lengthAtT = pathlength * t;
let d = shape ? shape.getAttribute("d") : "";
let n = (d.match(/C/gi) || []).length;
let pos = 0;

class SubPath {
    constructor(d) {
        this.d = d;
        this.getPointsRy();
        this.previous = subpaths.length > 0 ? subpaths[subpaths.length - 1] : null;
        this.measurePath();
        this.getMPoint();
        this.getLastCubicBezier();
    }

    getPointsRy() {
        this.pointsRy = [];
        let temp = this.d.split(/[A-Z,a-z\s,]/).filter(Boolean);
        temp.forEach(item => {
            this.pointsRy.push(Number.parseFloat(item));
        });
    }

    measurePath() {
        let path = document.createElementNS(SVG_NS, "path");
        path.setAttributeNS(null, "d", this.d);
        this.pathLength = path.getTotalLength();
    }

    getMPoint() {
        if (this.previous) {
            let p = this.previous.pointsRy;
            let l = p.length;
            this.M_point = [p[l - 2], p[l - 1]];
        } else {
            let p = this.pointsRy;
            this.M_point = [p[0], p[1]];
        }
    }

    getLastCubicBezier() {
        let lastIndexOfC = this.d.lastIndexOf("C");
        let temp = this.d.substring(lastIndexOfC + 1).split(/[\s,]/).filter(Boolean);
        let _temp = [];
        temp.forEach(item => {
            _temp.push(Number.parseFloat(item));
        });
        this.lastCubicBezier = [this.M_point];
        for (let i = 0; i < _temp.length; i += 2) {
            this.lastCubicBezier.push(_temp.slice(i, i + 2));
        }
    }
}

let subpaths = [];
if (shape && d) {
    for (let i = 0; i < n; i++) {
        let newpos = d.indexOf("C", pos + 1);
        if (i > 0) {
            let sPath = new SubPath(d.substring(0, newpos));
            subpaths.push(sPath);
        }
        pos = newpos;
    }
    subpaths.push(new SubPath(d));
}

let index = 0;
function getT(t, index) {
    let T;
    lengthAtT = pathlength * t;
    if (index > 0) {
        T = (lengthAtT - subpaths[index].previous.pathLength) / (subpaths[index].pathLength - subpaths[index].previous.pathLength);
    } else {
        T = lengthAtT / subpaths[index].pathLength;
    }
    return T;
}

function lerp(A, B, t) {
    return [(B[0] - A[0]) * t + A[0], (B[1] - A[1]) * t + A[1]];
}

function getBezierPoints(t, points) {
    let helperPoints = [];
    for (let i = 1; i < 4; i++) {
        helperPoints.push(lerp(points[i - 1], points[i], t));
    }
    helperPoints.push(lerp(helperPoints[0], helperPoints[1], t));
    helperPoints.push(lerp(helperPoints[1], helperPoints[2], t));
    helperPoints.push(lerp(helperPoints[3], helperPoints[4], t));
    return [points[0], helperPoints[0], helperPoints[3], helperPoints[5]];
}

function drawCBezier(points, path, index) {
    let dStr;
    if (index > 0) {
        dStr = subpaths[index].previous.d;
    } else {
        dStr = `M${points[0][0]},${points[0][1]} C`;
    }
    for (let i = 1; i < 4; i++) {
        dStr += ` ${points[i][0]},${points[i][1]} `;
    }
    path.setAttributeNS(null, "d", dStr);
}

function animateHeartSvg() {
    if (t >= 1) {
        window.cancelAnimationFrame(rid);
        rid = null;
        return;
    }
    t += 0.003;
    lengthAtT = pathlength * t;
    for (index = 0; index < subpaths.length; index++) {
        if (subpaths[index].pathLength >= lengthAtT) {
            break;
        }
    }
    if (index >= subpaths.length) index = subpaths.length - 1;
    let T = getT(t, index);
    let newPoints = getBezierPoints(T, subpaths[index].lastCubicBezier);
    if (partialPath) {
        drawCBezier(newPoints, partialPath, index);
    }
    rid = window.requestAnimationFrame(animateHeartSvg);
}

if (shape && partialPath) {
    rid = window.requestAnimationFrame(animateHeartSvg);
}

// 2. Hiệu ứng gõ chữ máy đánh chữ (Typewriter effect)
const textLetter = document.querySelector('.textLetter h2');
const textLetterContent = document.querySelector('.contentLetter');
const textLetterH2 = "💖 Happy Vietnamese Women's Day 20/10 💖";
const textLetterP = `Gửi ngàn lời chúc yêu thương và ngọt ngào nhất nhân ngày 20/10! 🌸

Chúc Mẹ cùng tất cả những người phụ nữ tuyệt vời luôn xinh đẹp rạng ngời như đóa hoa, mỗi ngày đều ngập tràn nụ cười, bình an, hạnh phúc và luôn được trân trọng, yêu thương đong đầy! ✨🌷`;

let timerTitle = null;
let timerContent = null;

function typeWriter() {
    if (!textLetter || !textLetterContent) return;
    textLetter.textContent = '';
    textLetterContent.textContent = '';
    clearTimeout(timerTitle);
    clearTimeout(timerContent);

    let i = 0;
    function writeTitle() {
        if (i < textLetterH2.length) {
            textLetter.textContent += textLetterH2.charAt(i);
            i++;
            timerTitle = setTimeout(writeTitle, 50);
        } else {
            let j = 0;
            function writeContent() {
                if (j < textLetterP.length) {
                    textLetterContent.textContent += textLetterP.charAt(j);
                    j++;
                    timerContent = setTimeout(writeContent, 35);
                }
            }
            timerContent = setTimeout(writeContent, 200);
        }
    }
    writeTitle();
}

// 3. Tương tác với phong bì & Quản lý âm thanh
$(document).ready(function () {
    const bgm = document.getElementById('bgm');
    let isLetterOpened = false;

    $('.valentines').mouseenter(function () {
        if (!isLetterOpened) {
            $('.card').stop().animate({ top: '-90px' }, 300);
        }
    }).mouseleave(function () {
        if (!isLetterOpened) {
            $('.card').stop().animate({ top: '0px' }, 300);
        }
    });

    // 🎵 Xử lý âm nhạc
    let isMusicPlaying = false;
    const $musicBtn = $('#musicToggleBtn');

    function playMusicSmoothly() {
        if (!bgm) return;
        bgm.volume = 0;
        bgm.play().then(() => {
            isMusicPlaying = true;
            $musicBtn.addClass('playing');
            $musicBtn.find('i').attr('class', 'fa-solid fa-compact-disc');

            // Tăng âm lượng êm dịu dần từ 0 lên 0.6
            let currentVol = 0;
            const fadeTimer = setInterval(() => {
                if (currentVol < 0.6) {
                    currentVol = Math.min(0.6, currentVol + 0.05);
                    bgm.volume = currentVol;
                } else {
                    clearInterval(fadeTimer);
                }
            }, 100);
        }).catch(() => {
            isMusicPlaying = false;
        });
    }

    function toggleMusic() {
        if (!bgm) return;
        if (isMusicPlaying) {
            bgm.pause();
            isMusicPlaying = false;
            $musicBtn.removeClass('playing');
            $musicBtn.find('i').attr('class', 'fa-solid fa-volume-xmark');
        } else {
            bgm.volume = 0.6;
            bgm.play().then(() => {
                isMusicPlaying = true;
                $musicBtn.addClass('playing');
                $musicBtn.find('i').attr('class', 'fa-solid fa-compact-disc');
            }).catch(() => {});
        }
    }

    $musicBtn.click(toggleMusic);

    function openLetter() {
        if (isLetterOpened) return;
        isLetterOpened = true;

        const $valentine = $('.valentines');
        const $glow = $('<div class="glowEffect"></div>');
        $valentine.append($glow);
        $valentine.addClass('fly-up');
        $('#hintBadge').fadeOut(300);

        // Phát nhạc êm dịu khi mở thư
        if (!isMusicPlaying) {
            playMusicSmoothly();
        }

        setTimeout(() => {
            $('.wrapperLetterForm').fadeIn(400);
            typeWriter();
        }, 1200);
    }

    $('.card, .valentines, #hintBadge').click(openLetter);

    function closeLetter() {
        $('.wrapperLetterForm').fadeOut(300, function() {
            const $valentine = $('.valentines');
            $valentine.removeClass('fly-up');
            $valentine.find('.glowEffect').remove();
            $('.card').css('top', '0px');
            $('#hintBadge').fadeIn(300);
            isLetterOpened = false;
        });
    }

    // 1. Nhấp vào nút đóng góc thiệp
    $('#closeLetterBtn').click(function (e) {
        e.stopPropagation();
        closeLetter();
    });

    // 2. Nhấp ra ngoài lá thư (vùng nền mờ) để đóng
    $('#letterModalOverlay, .boxLetter').click(function (e) {
        if ($(e.target).is('#letterModalOverlay, .boxLetter')) {
            closeLetter();
        }
    });

    // 3. Nhấn phím ESC trên bàn phím để đóng nhanh
    $(document).keydown(function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            if (isLetterOpened) {
                closeLetter();
            }
        }
    });
});

// 4. 🌸 Hiệu ứng hoa & tim rơi nhẹ nhàng
const emojis = ['🌸', '💖', '🌷', '💐', '🌺', '🌻'];
let activeEmojis = 0;
const MAX_EMOJIS = 20;

function createFallingEmojis() {
    if (activeEmojis >= MAX_EMOJIS) return;

    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const el = document.createElement('span');
    el.className = 'falling';
    el.textContent = emoji;

    const randomX = Math.random() * 95;
    const duration = 4 + Math.random() * 3;
    el.style.left = `${randomX}vw`;
    el.style.fontSize = `${20 + Math.random() * 10}px`;
    el.style.animationDuration = `${duration}s`;

    document.body.appendChild(el);
    activeEmojis++;

    setTimeout(() => {
        el.remove();
        activeEmojis--;
    }, duration * 1000);
}

$('body').append('<div class="sparkle-bg"></div>');
setInterval(createFallingEmojis, 500);

// 5. 🌸 Xử lý ẩn màn hình Loading khi trang tải xong
window.addEventListener('load', function () {
    setTimeout(function () {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('loaded');
    }, 600);
});

// Tự động tắt Preloader sau tối đa 2.5s (dự phòng mạng chậm)
setTimeout(function () {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('loaded')) {
        preloader.classList.add('loaded');
    }
}, 2500);

// 6. 📡 Xử lý thông báo khi mất kết nối mạng / kết nối lại
const networkToast = document.getElementById('networkToast');
const networkIcon = document.getElementById('networkIcon');
const networkMsg = document.getElementById('networkMsg');
let hideToastTimer = null;

function showOfflineNotice() {
    if (!networkToast) return;
    clearTimeout(hideToastTimer);
    networkToast.className = 'network-toast show';
    if (networkIcon) networkIcon.className = 'fa-solid fa-plane-slash';
    if (networkMsg) networkMsg.textContent = '📡 Bạn đang mất kết nối mạng. Hãy bật lại WiFi/4G để tải nhạc và thiệp mượt mà nhé! 💕';
}

function showOnlineNotice() {
    if (!networkToast) return;
    networkToast.className = 'network-toast show online-toast';
    if (networkIcon) networkIcon.className = 'fa-solid fa-wifi';
    if (networkMsg) networkMsg.textContent = '✨ Đã kết nối lại Internet! Chúc bạn trải nghiệm thật vui vẻ! 🌸';
    hideToastTimer = setTimeout(() => {
        networkToast.classList.remove('show');
    }, 3000);
}

window.addEventListener('offline', showOfflineNotice);
window.addEventListener('online', showOnlineNotice);
if (!navigator.onLine) {
    showOfflineNotice();
}
