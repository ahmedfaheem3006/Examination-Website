// ============================================================
//  FullMark.js - Full Mark Results Page (Enhanced)
// ============================================================

// ===== AUTH CHECK =====
let currentUser = null;
try {
    currentUser = JSON.parse(localStorage.getItem('examprep_current_user') || 'null');
} catch (e) {
    console.error("Auth parse error", e);
}
if (!currentUser) {
    window.location.href = './Auth.html';
}

// ===== CHECK EXAM WAS COMPLETED =====
const COMPLETED_KEY = 'examprep_exam_completed';
const SESSION_KEY = 'examprep_exam_session';

function isExamCompleted() {
    try {
        const comp = JSON.parse(localStorage.getItem(COMPLETED_KEY) || 'null');
        return comp && comp.completed && comp.userEmail === currentUser.email;
    } catch (e) {
        return false;
    }
}

if (!isExamCompleted()) {
    const hasScore = localStorage.getItem('score');
    if (!hasScore) {
        window.location.replace('./ExamSelect.html');
    }
}

localStorage.removeItem(SESSION_KEY);

// ===== PREVENT BACK TO EXAM =====
(function blockBack() {
    for (let i = 0; i < 20; i++) {
        history.pushState({ resultLock: true }, '', window.location.href);
    }

    window.addEventListener('popstate', function (e) {
        history.pushState({ resultLock: true }, '', window.location.href);
    });

    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            for (let i = 0; i < 5; i++) {
                history.pushState({ resultLock: true }, '', window.location.href);
            }
        }
    });

    window.addEventListener('focus', function () {
        for (let i = 0; i < 5; i++) {
            history.pushState({ resultLock: true }, '', window.location.href);
        }
    });
})();

// ===== BLOCK KEYBOARD SHORTCUTS =====
window.addEventListener('keydown', function (e) {
    if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
    }
    if (e.key === 'Backspace' && e.target === document.body) {
        e.preventDefault();
    }
});

// ===== FALLBACK IMAGE =====
function createFallbackImage() {
    return `
        <div class="w-full aspect-square rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex flex-col items-center justify-center text-white p-8 relative z-10 shadow-xl">
            <i class="fa-solid fa-trophy text-6xl sm:text-7xl mb-4 drop-shadow-lg"></i>
            <p class="text-2xl sm:text-3xl font-black">100%</p>
            <p class="text-sm sm:text-base opacity-90 mt-1 font-medium">Perfect Score!</p>
            <div class="absolute top-4 right-4">
                <i class="fa-solid fa-star text-yellow-200 text-lg animate-pulse"></i>
            </div>
            <div class="absolute bottom-4 left-4">
                <i class="fa-solid fa-star text-yellow-200 text-sm animate-pulse" style="animation-delay: 0.5s;"></i>
            </div>
        </div>
    `;
}

// ===== PAGE ELEMENTS =====
const scoreFullmark = document.getElementById('scoreFullmark');
const namefullmark = document.getElementById('namefullmark');
const grade = localStorage.getItem('grade');
const score = localStorage.getItem('score');
const firstName = localStorage.getItem('firstName');
const lastName = localStorage.getItem('lastName');
const Reloadbtn = document.getElementById('Reloadbtn');
const newExamBtn = document.getElementById('newExamBtn');
const scoreBar = document.getElementById('scoreBar');

// ===== SET CONTENT =====
if (namefullmark) namefullmark.textContent = `Hi, ${firstName || 'Student'}`;
if (scoreFullmark) scoreFullmark.textContent = `${score || 0} / ${grade || 0}`;

// ===== ANIMATE SCORE BAR =====
function animateScoreBar() {
    if (scoreBar) {
        setTimeout(() => {
            scoreBar.style.width = '100%';
        }, 1200);
    }
}

// ===== CONFETTI EFFECT =====
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;

    const colors = [
        '#5c6bc0', '#2da0a8', '#f59e0b', '#ef4444',
        '#22c55e', '#a855f7', '#ec4899', '#3b82f6',
        '#f97316', '#14b8a6'
    ];

    // Create confetti pieces
    for (let i = 0; i < 60; i++) {
        const piece = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = Math.random() * 3 + 2;
        const rotation = Math.random() * 360;

        piece.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size * 0.6}px;
            background: ${color};
            left: ${left}%;
            top: -20px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            animation: confettiDrop ${duration}s ease-in ${delay}s infinite;
            transform: rotate(${rotation}deg);
            opacity: 0.9;
        `;

        container.appendChild(piece);
    }

    // Add confetti drop keyframes dynamically
    if (!document.getElementById('confettiStyles')) {
        const style = document.createElement('style');
        style.id = 'confettiStyles';
        style.textContent = `
            @keyframes confettiDrop {
                0% {
                    transform: translateY(-20px) rotate(0deg) scale(1);
                    opacity: 1;
                }
                25% {
                    transform: translateY(25vh) rotate(90deg) translateX(20px) scale(0.9);
                    opacity: 0.9;
                }
                50% {
                    transform: translateY(50vh) rotate(180deg) translateX(-15px) scale(0.8);
                    opacity: 0.7;
                }
                75% {
                    transform: translateY(75vh) rotate(270deg) translateX(10px) scale(0.6);
                    opacity: 0.5;
                }
                100% {
                    transform: translateY(105vh) rotate(360deg) translateX(-5px) scale(0.4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Stop confetti after 8 seconds
    setTimeout(() => {
        container.innerHTML = '';
    }, 8000);
}

// ===== LOADING & INIT =====
window.addEventListener('load', () => {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('hide');
            setTimeout(() => {
                overlay.style.display = 'none';

                // Start animations after loading
                animateScoreBar();
                createConfetti();
            }, 500);
        }, 1000);
    }
});

// ===== RELOAD BUTTON =====
if (Reloadbtn) {
    Reloadbtn.addEventListener('click', () => {
        localStorage.removeItem(COMPLETED_KEY);
        localStorage.removeItem(SESSION_KEY);
        window.location.replace('./index.html');
    });
}

// ===== NEW EXAM BUTTON =====
if (newExamBtn) {
    newExamBtn.addEventListener('click', () => {
        localStorage.removeItem(COMPLETED_KEY);
        localStorage.removeItem(SESSION_KEY);
        window.location.replace('./ExamSelect.html');
    });
}