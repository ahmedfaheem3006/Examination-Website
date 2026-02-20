// ===== AUTH CHECK =====
let currentUser = null;
try {
    currentUser = JSON.parse(localStorage.getItem('examprep_current_user') || 'null');
} catch (e) {
    console.error("Auth parse error", e);
}
if (!currentUser) {
    window.location.href = './auth.html';
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

// ===== HELPER =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== FALLBACK IMAGE FUNCTION =====
function createFallbackImage() {
    return `
        <div class="w-full aspect-square rounded-3xl gradient-bg flex flex-col items-center justify-center text-white p-8">
            <i class="fa-solid fa-trophy text-6xl sm:text-7xl mb-4 opacity-80"></i>
            <p class="text-xl sm:text-2xl font-bold">Well Done!</p>
            <p class="text-sm opacity-70 mt-2">Keep Learning</p>
        </div>
    `;
}

// ===== PAGE ELEMENTS =====
const grade = localStorage.getItem('grade');
const score = localStorage.getItem('score');
const firstName = localStorage.getItem('firstName');
const lastName = localStorage.getItem('lastName');
const Grade = document.getElementById('Grade');
const nameScore = document.getElementById('nameScore');
const Reveiwbtn = document.getElementById('Reveiwbtn');
const Reloadbtn = document.getElementById('Reloadbtn');
const correctCount = document.getElementById('correctCount');
const wrongCount = document.getElementById('wrongCount');
const skippedCount = document.getElementById('skippedCount');
const reviewSection = document.getElementById('reviewSection');
const reviewContainer = document.getElementById('reviewContainer');
const closeReviewBtn = document.getElementById('closeReview');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// ===== SET CONTENT =====
if (nameScore) nameScore.textContent = `Hi, ${firstName || 'Student'}`;
if (Grade) Grade.textContent = `${score || 0} / ${grade || 0}`;

// ===== DYNAMIC MESSAGE =====
function setResultMessage() {
    const msgEl = document.getElementById('resultMessage');
    if (!msgEl || !score || !grade) return;

    const pct = Math.round((parseInt(score) / parseInt(grade)) * 100);

    if (pct === 100) {
        msgEl.innerHTML = `🎉 Perfect Score! <span class="text-secondary font-bold">Outstanding!</span>`;
    } else if (pct >= 80) {
        msgEl.innerHTML = `Great job! <span class="text-secondary font-bold">Keep up</span> the excellent work!`;
    } else if (pct >= 60) {
        msgEl.innerHTML = `Good effort! <span class="text-primary font-bold">Keep practicing</span> to improve!`;
    } else if (pct >= 40) {
        msgEl.innerHTML = `You can do better! <span class="text-orange-500 font-bold">Don't give up</span>, keep studying!`;
    } else {
        msgEl.innerHTML = `Keep trying! <span class="text-red-500 font-bold">Review the material</span> and try again!`;
    }
}

setResultMessage();

// ===== CALCULATE STATS & BUILD REVIEW =====
const rawQuestions = localStorage.getItem('examprep_last_questions');
const rawAnswers = localStorage.getItem('examprep_last_answers');

if (rawQuestions && rawAnswers) {
    const questions = JSON.parse(rawQuestions);
    const answers = JSON.parse(rawAnswers);

    let correct = 0, wrong = 0, skipped = 0;
    questions.forEach((q, i) => {
        if (answers[i] === null) skipped++;
        else if (answers[i] === q.answer) correct++;
        else wrong++;
    });

    // Animate counters
    animateCounter(correctCount, correct);
    animateCounter(wrongCount, wrong);
    animateCounter(skippedCount, skipped);

    // Review stats in header
    const reviewCorrect = document.getElementById('reviewCorrect');
    const reviewWrong = document.getElementById('reviewWrong');
    const reviewSkipped = document.getElementById('reviewSkipped');
    if (reviewCorrect) reviewCorrect.textContent = correct;
    if (reviewWrong) reviewWrong.textContent = wrong;
    if (reviewSkipped) reviewSkipped.textContent = skipped;

    // Build review cards
    if (reviewContainer) {
        reviewContainer.innerHTML = '';
        questions.forEach((q, i) => {
            const user = answers[i];
            const isCorrect = user === q.answer;
            const isSkipped = user === null;

            let borderColor, bgColor, iconBg;
            if (isSkipped) {
                borderColor = "border-slate-200";
                bgColor = "bg-slate-50/50";
                iconBg = "bg-slate-100";
            } else if (isCorrect) {
                borderColor = "border-green-200";
                bgColor = "bg-green-50/50";
                iconBg = "bg-green-100";
            } else {
                borderColor = "border-red-200";
                bgColor = "bg-red-50/50";
                iconBg = "bg-red-100";
            }

            const div = document.createElement("div");
            div.className = `review-card p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 ${borderColor} ${bgColor} transition-all hover:shadow-md`;
            div.style.animationDelay = `${i * 0.05}s`;

            div.innerHTML = `
                <div class="flex items-start gap-3 mb-3">
                    <div class="w-7 h-7 sm:w-8 sm:h-8 ${iconBg} rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <span class="text-xs font-bold ${isSkipped ? 'text-slate-500' : isCorrect ? 'text-green-600' : 'text-red-600'}">${i + 1}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed break-words">${escapeHtml(q.question)}</p>
                    </div>
                    <i class="${isSkipped
                    ? "fa-solid fa-minus text-slate-300"
                    : isCorrect
                        ? "fa-solid fa-circle-check text-green-500"
                        : "fa-solid fa-circle-xmark text-red-500"
                } text-base sm:text-lg shrink-0 mt-0.5"></i>
                </div>
                
                <div class="ml-10 sm:ml-11 space-y-1.5">
                    <div class="flex items-start gap-2">
                        <span class="text-[10px] sm:text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md shrink-0">✓ Correct</span>
                        <span class="text-[10px] sm:text-xs text-slate-600 break-words">${escapeHtml(q.options[q.answer])}</span>
                    </div>
                    ${isSkipped
                    ? `<div class="flex items-center gap-2">
                            <span class="text-[10px] sm:text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">— Skipped</span>
                          </div>`
                    : `<div class="flex items-start gap-2">
                            <span class="text-[10px] sm:text-xs font-semibold ${isCorrect ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2 py-0.5 rounded-md shrink-0">${isCorrect ? '✓ Yours' : '✗ Yours'}</span>
                            <span class="text-[10px] sm:text-xs text-slate-600 break-words">${escapeHtml(q.options[user])}</span>
                          </div>`
                }
                </div>
            `;
            reviewContainer.appendChild(div);
        });
    }
}

// ===== ANIMATE COUNTER =====
function animateCounter(element, target) {
    if (!element) return;
    let count = 0;
    const duration = 1500;
    const step = target / (duration / 16);

    function update() {
        count += step;
        if (count >= target) {
            element.textContent = target;
            return;
        }
        element.textContent = Math.floor(count);
        requestAnimationFrame(update);
    }

    // Delay to sync with animations
    setTimeout(() => {
        if (target === 0) {
            element.textContent = '0';
            return;
        }
        update();
    }, 800);
}

// ===== REVIEW BUTTON =====
if (Reveiwbtn && reviewSection) {
    Reveiwbtn.addEventListener('click', () => {
        if (reviewSection.classList.contains('hidden')) {
            reviewSection.classList.remove('hidden');

            // Smooth scroll to review section
            setTimeout(() => {
                reviewSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);

            // Update button text
            Reveiwbtn.innerHTML = '<i class="fa-solid fa-eye-slash mr-2"></i> Hide Review';
        } else {
            reviewSection.classList.add('hidden');
            Reveiwbtn.innerHTML = '<i class="fa-solid fa-magnifying-glass mr-2"></i> Review Questions';

            // Scroll back to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// ===== CLOSE REVIEW BUTTON =====
if (closeReviewBtn && reviewSection) {
    closeReviewBtn.addEventListener('click', () => {
        reviewSection.classList.add('hidden');
        if (Reveiwbtn) {
            Reveiwbtn.innerHTML = '<i class="fa-solid fa-magnifying-glass mr-2"></i> Review Questions';
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== SCROLL TO TOP BUTTON =====
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== RELOAD BUTTON =====
if (Reloadbtn) {
    Reloadbtn.addEventListener('click', () => {
        localStorage.removeItem(COMPLETED_KEY);
        localStorage.removeItem(SESSION_KEY);
        window.location.replace('./index.html');
    });
}

// ===== LOADING OVERLAY =====
window.addEventListener('load', () => {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('hide');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }, 800);
    }
});