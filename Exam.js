// ===== IMMEDIATE BACK BUTTON BLOCK - يشتغل قبل أي حاجة =====
(function() {
  // استبدل الـ entry الحالية عشان ميبقاش فيه حاجة قبلها
  window.history.replaceState({ examPage: true }, '', window.location.href);
  
  // املأ الـ history بـ 50 entry كلها نفس الصفحة
  for (let i = 0; i < 50; i++) {
    window.history.pushState({ examLock: true, i: i }, '', window.location.href);
  }
  
  // Listener فوري لمنع الـ Back
  window.onpopstate = function() {
    window.history.pushState({ examLock: true }, '', window.location.href);
  };
})();

// ===== AUTH CHECK =====
let examUser = null;
try {
  examUser = JSON.parse(localStorage.getItem('examprep_current_user') || 'null');
} catch (e) {
  console.error("Auth parse error", e);
}
if (!examUser) {
  window.location.href = './auth.html';
}

const SESSION_KEY = 'examprep_exam_session';
const COMPLETED_KEY = 'examprep_exam_completed';

function setExamSession(subjectKey) {
  const session = {
    active: true,
    subject: subjectKey,
    startedAt: Date.now(),
    userEmail: examUser.email
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.removeItem(COMPLETED_KEY);
}

function getExamSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch (e) {
    return null;
  }
}

function endExamSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.setItem(COMPLETED_KEY, JSON.stringify({
    completed: true,
    completedAt: Date.now(),
    userEmail: examUser.email
  }));
}

function isExamCompleted() {
  try {
    const comp = JSON.parse(localStorage.getItem(COMPLETED_KEY) || 'null');
    return comp && comp.completed && comp.userEmail === examUser.email;
  } catch (e) {
    return false;
  }
}

function clearCompleted() {
  localStorage.removeItem(COMPLETED_KEY);
}

if (isExamCompleted()) {
  window.location.replace('./ExamSelect.html');
}

// ===== THEME =====
function initTheme() {
  const saved = localStorage.getItem('examprep_theme');
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('examprep_theme', isDark ? 'dark' : 'light');
}

initTheme();

// ===== SUBJECT CONFIG =====
const subjectConfig = {
  html: { name: "HTML Fundamentals", icon: "fa-brands fa-html5", color: "from-orange-500 to-red-500" },
  css: { name: "CSS Styling & Layout", icon: "fa-brands fa-css3-alt", color: "from-blue-500 to-cyan-500" },
  js: { name: "JavaScript Essentials", icon: "fa-brands fa-js", color: "from-yellow-400 to-yellow-500" },
  csharp: { name: "C# Programming", icon: "fa-brands fa-microsoft", color: "from-purple-600 to-violet-600" }
};

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== QUESTION BANKS =====
const questionBanks = {
  html: [
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], answer: 0 },
    { question: "Which tag is used to create a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1 },
    { question: "Which HTML element is used for the largest heading?", options: ["<h6>", "<heading>", "<head>", "<h1>"], answer: 3 },
    { question: "What is the correct HTML element for inserting a line break?", options: ["<break>", "<lb>", "<br>", "<newline>"], answer: 2 },
    { question: "Which attribute specifies an alternate text for an image?", options: ["title", "alt", "src", "name"], answer: 1 },
    { question: "Which HTML element defines the title of a document?", options: ["<meta>", "<head>", "<title>", "<header>"], answer: 2 },
    { question: "What is the correct HTML for creating a checkbox?", options: ['<input type="check">', '<input type="checkbox">', '<checkbox>', '<check>'], answer: 1 },
    { question: "Which element is used to define an unordered list?", options: ["<ol>", "<list>", "<ul>", "<dl>"], answer: 2 },
    { question: "What does the <DOCTYPE> declaration do?", options: ["Defines document type", "Creates a comment", "Inserts a script", "Defines a link"], answer: 0 },
    { question: "Which tag is used to define a table row?", options: ["<td>", "<tr>", "<th>", "<table>"], answer: 1 }
  ],
  css: [
    { question: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], answer: 1 },
    { question: "Which property is used to change the background color?", options: ["bgcolor", "color", "background-color", "background"], answer: 2 },
    { question: "Which CSS property controls the text size?", options: ["text-style", "font-size", "text-size", "font-style"], answer: 1 },
    { question: "How to select an element with id 'demo'?", options: [".demo", "*demo", "#demo", "demo"], answer: 2 },
    { question: "Which property is used to change the font of an element?", options: ["font-family", "font-weight", "font-style", "text-font"], answer: 0 },
    { question: "What is the default value of the position property?", options: ["relative", "fixed", "absolute", "static"], answer: 3 },
    { question: "Which property creates space between the element's border and content?", options: ["margin", "spacing", "padding", "border"], answer: 2 },
    { question: "How do you make a list not display bullet points?", options: ["list-style: none", "bullet: none", "list: none", "decoration: none"], answer: 0 },
    { question: "Which display value makes an element a flex container?", options: ["block", "inline", "flex", "grid"], answer: 2 },
    { question: "What property is used to make text bold?", options: ["font-style: bold", "text-weight: bold", "font-weight: bold", "text-style: bold"], answer: 2 }
  ],
  js: [
    { question: "Which keyword is used to declare a variable in JavaScript?", options: ["var", "dim", "variable", "v"], answer: 0 },
    { question: "What is the output of typeof null?", options: ["null", "undefined", "object", "number"], answer: 2 },
    { question: "Which method adds an element to the end of an array?", options: ["append()", "push()", "add()", "insert()"], answer: 1 },
    { question: "What does '===' operator do?", options: ["Assigns value", "Compares only value", "Compares value and type", "None of the above"], answer: 2 },
    { question: "Which function converts a string to an integer?", options: ["Integer.parse()", "parseInt()", "int()", "toInteger()"], answer: 1 },
    { question: "What is the correct way to write an IF statement?", options: ["if i == 5 then", "if (i == 5)", "if i = 5", "if i = 5 then"], answer: 1 },
    { question: "How do you write a comment in JavaScript?", options: ["<!-- comment -->", "// comment", "** comment **", "# comment"], answer: 1 },
    { question: "Which event occurs when the user clicks on an HTML element?", options: ["onmouseover", "onclick", "onchange", "onmouseclick"], answer: 1 },
    { question: "What does DOM stand for?", options: ["Document Object Model", "Display Object Management", "Digital Orderly Model", "Document Oriented Mode"], answer: 0 },
    { question: "Which method selects an element by its ID?", options: ["getElement()", "querySelector()", "getElementById()", "findById()"], answer: 2 }
  ],
  csharp: [
    { question: "What type of language is C#?", options: ["Markup", "Scripting", "Object-Oriented", "Functional only"], answer: 2 },
    { question: "Which keyword is used to define a class in C#?", options: ["struct", "define", "class", "object"], answer: 2 },
    { question: "What is the correct way to create an object in C#?", options: ["MyClass obj = MyClass();", "MyClass obj = new MyClass();", "obj = new MyClass;", "create MyClass obj;"], answer: 1 },
    { question: "Which data type stores true or false?", options: ["int", "string", "bool", "char"], answer: 2 },
    { question: "What does the 'static' keyword mean?", options: ["Variable changes", "Belongs to the class", "Is private", "Cannot be accessed"], answer: 1 },
    { question: "Which symbol is used for single-line comments in C#?", options: ["#", "//", "/*", "--"], answer: 1 },
    { question: "What is the entry point of a C# program?", options: ["Start()", "Begin()", "Main()", "Run()"], answer: 2 },
    { question: "Which collection allows key-value pairs?", options: ["List", "Array", "Dictionary", "Queue"], answer: 2 },
    { question: "What does LINQ stand for?", options: ["Language Integrated Query", "Linked Query", "List Integrated Query", "Language Internal Query"], answer: 0 },
    { question: "Which access modifier makes a member accessible only within the same class?", options: ["public", "protected", "internal", "private"], answer: 3 }
  ]
};

// ===== DYNAMIC SETUP =====
const urlParams = new URLSearchParams(window.location.search);
const subjectKey = urlParams.get('subject') || 'html';
const subject = subjectConfig[subjectKey] || subjectConfig.html;
const originalBank = questionBanks[subjectKey] || questionBanks.html;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const persistKey = `examprep_state_${subjectKey}_${examUser.email.replace(/[^a-zA-Z0-9]/g, '')}`;

let restoredState = null;
try {
  const savedStateRaw = localStorage.getItem(persistKey);
  if (savedStateRaw) {
    restoredState = JSON.parse(savedStateRaw);
  }
} catch (e) {
  restoredState = null;
}

let questions;
if (restoredState && restoredState.questions && restoredState.questions.length > 0) {
  questions = restoredState.questions;
} else {
  questions = shuffle(originalBank);
}

setExamSession(subjectKey);

document.title = `ExamPrep - ${subject.name}`;
const titleEl = document.getElementById('examTitle');
if (titleEl) titleEl.textContent = subject.name;

// ===== STATE VARIABLES =====
let current = 0;
let answers = new Array(questions.length).fill(null);
let flagged = new Set();
let timeLeft = 30 * 60;
let timer = null;
let finished = false;

// ============================================================
//  INIT - مع حماية كاملة ضد الـ Back
// ============================================================
function init() {
  console.log("Initializing exam for:", subject.name);

  if (!questions || questions.length === 0) {
    console.error("No questions found!");
    alert("Error: Questions not found.");
    return;
  }

  if (restoredState) {
    timeLeft = restoredState.timeLeft;
    answers = restoredState.answers;
    flagged = new Set(restoredState.flagged || []);
    current = restoredState.current || 0;
  }

  setTimeout(() => {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.classList.add('hide');
      setTimeout(() => { overlay.style.display = 'none'; }, 600);
    }
    timer = setInterval(tick, 1000);
    showTimer();
    render();
  }, 1500);

  // ===== حماية الـ Back - الطبقة الثانية =====
  // الطبقة الأولى موجودة في الـ IIFE في أول الملف
  
  // Override الـ popstate handler بواحد أقوى
  window.onpopstate = function(e) {
    if (!finished) {
      window.history.pushState(null, '', window.location.href);
      window.history.pushState(null, '', window.location.href);
      showBackBlockedToast();
    }
  };

  // ===== منع إغلاق التاب =====
  window.addEventListener('beforeunload', function (e) {
    if (!finished) {
      saveState();
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // ===== منع اختصارات الكيبورد للرجوع =====
  window.addEventListener('keydown', function (e) {
    if (!finished) {
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopImmediatePropagation();
        showBackBlockedToast();
        return false;
      }
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
      if (e.key === 'Backspace' && (e.target === document.body || e.target.tagName === 'BODY')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showBackBlockedToast();
        return false;
      }
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
      }
    }
  }, true);

  // ===== Push مستمر للـ history كل 500ms =====
  setInterval(() => {
    if (!finished) {
      window.history.pushState(null, '', window.location.href);
    }
  }, 500);

  // ===== فحص الجلسة باستمرار =====
  setInterval(() => {
    if (finished) return;
    const session = getExamSession();
    if (!session || !session.active || session.userEmail !== examUser.email) {
      setExamSession(subjectKey);
    }
  }, 2000);

  // ===== لما يرجع للتاب =====
  document.addEventListener('visibilitychange', function () {
    if (!finished && document.visibilityState === 'visible') {
      for (let i = 0; i < 10; i++) {
        window.history.pushState(null, '', window.location.href);
      }
    }
  });

  window.addEventListener('focus', function () {
    if (!finished) {
      for (let i = 0; i < 10; i++) {
        window.history.pushState(null, '', window.location.href);
      }
    }
  });
}

// ============================================================
//  TOAST - رسالة منع الرجوع
// ============================================================
function showBackBlockedToast() {
  if (document.getElementById("backBlockedToast")) return;

  const toast = document.createElement("div");
  toast.id = "backBlockedToast";
  toast.style.cssText = `
    position: fixed; top: 20px; left: 50%;
    transform: translateX(-50%) translateY(-20px) scale(0.9);
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white; padding: 14px 28px; border-radius: 16px;
    font-size: 14px; font-weight: 600; z-index: 99999;
    box-shadow: 0 10px 40px rgba(239,68,68,0.4);
    display: flex; align-items: center; gap: 10px;
    font-family: 'Poppins', sans-serif; opacity: 0;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    max-width: 90vw; white-space: nowrap;
  `;
  toast.innerHTML = `
    <i class="fa-solid fa-shield-halved" style="font-size: 16px;"></i>
    <span>You cannot go back during the exam!</span>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0) scale(1)";
    });
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(-20px) scale(0.9)";
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
  }, 3000);
}

// ============================================================
//  TIMER
// ============================================================
function tick() {
  timeLeft--;
  saveState();
  if (timeLeft <= 0) {
    clearInterval(timer);
    timeLeft = 0;
    finished = true;
    showTimer();
    openModal("timeUpModal");
    return;
  }
  showTimer();
  if (timeLeft <= 300) {
    const el = document.getElementById("timer");
    if (el) el.classList.add("text-red-500");
    const tc = document.getElementById("timerContainer");
    if (tc) tc.classList.add("animate-pulse");
  }
}

function showTimer() {
  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  const el = document.getElementById("timer");
  if (el) el.textContent = m + ":" + s;
}

// ============================================================
//  STATE PERSISTENCE
// ============================================================
function saveState() {
  if (finished) return;
  localStorage.setItem(persistKey, JSON.stringify({
    timeLeft, answers, flagged: Array.from(flagged), current, questions
  }));
}

function clearState() {
  localStorage.removeItem(persistKey);
}

// ============================================================
//  RENDER
// ============================================================
function render() {
  renderQuestion();
  renderGrid();
  renderProgress();
  renderAnsweredCount();
}

function renderQuestion() {
  const q = questions[current];

  document.getElementById("questionCounter").textContent = `Question ${current + 1} of ${questions.length}`;
  document.getElementById("questionTitle").textContent = `Question ${current + 1}`;

  const qTextEl = document.getElementById("questionText");
  qTextEl.textContent = q.question;
  qTextEl.classList.remove('question-enter');
  void qTextEl.offsetWidth;
  qTextEl.classList.add('question-enter');

  const flagBtn = document.getElementById("flagBtn");
  const flagIcon = flagBtn.querySelector("i");
  const flagText = document.getElementById("flagText");

  if (flagged.has(current)) {
    flagBtn.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-orange-400 text-orange-500 bg-orange-50 text-xs font-medium transition-all duration-300";
    flagIcon.className = "fa-solid fa-flag text-xs";
    flagText.textContent = "Flagged";
  } else {
    flagBtn.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-slate-100 text-slate-500 text-xs font-medium hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-all duration-300";
    flagIcon.className = "fa-regular fa-flag text-xs";
    flagText.textContent = "Flag";
  }

  const container = document.getElementById("optionsContainer");
  container.innerHTML = "";

  q.options.forEach((opt, i) => {
    const selected = answers[current] === i;
    const optBtn = document.createElement("button");
    optBtn.style.animationDelay = `${i * 0.08}s`;
    optBtn.className = `anim-option flex items-center gap-3 px-4 py-4 rounded-xl border-2 text-left transition-all duration-300 ${
      selected
        ? "border-primary bg-primary/5 shadow-md shadow-primary/5 selected-option"
        : "border-slate-50 bg-slate-50 hover:border-primary/30 hover:bg-white hover:shadow-sm"
    }`;
    optBtn.innerHTML = `
      <div class="w-6 h-6 min-w-[24px] rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
        selected ? "border-primary bg-gradient-to-r from-primary to-secondary" : "border-slate-200"
      }">
        ${selected ? '<i class="fa-solid fa-check text-white text-[8px]"></i>' : ""}
      </div>
      <span class="text-xs md:text-sm font-medium ${selected ? "text-slate-800" : "text-slate-500"}">${escapeHtml(opt)}</span>
    `;
    optBtn.onclick = () => { answers[current] = i; saveState(); render(); };
    container.appendChild(optBtn);
  });

  // ===== NAVIGATION BUTTONS =====
  document.getElementById("prevBtn").disabled = current === 0;

  const nextText = document.getElementById("nextBtnText");
  const nextIcon = document.getElementById("nextBtnIcon");

  if (current === questions.length - 1) {
    nextText.textContent = "Finish";
    nextIcon.className = "fa-solid fa-check text-[10px]";
  } else {
    nextText.textContent = "Next";
    nextIcon.className = "fa-solid fa-chevron-right text-[10px]";
  }
}

function renderGrid() {
  const grid = document.getElementById("questionGrid");
  grid.innerHTML = "";
  questions.forEach((_, i) => {
    const btn = document.createElement("button");
    const isAnswered = answers[i] !== null;
    const isFlagged = flagged.has(i);
    const isCurrent = i === current;

    let cls = "anim-grid-btn aspect-square rounded-lg text-[11px] font-semibold transition-all duration-300 flex items-center justify-center ";
    btn.style.animationDelay = `${i * 0.03}s`;

    if (isCurrent) cls += "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/30 scale-105 ring-2 ring-primary/20 ring-offset-1";
    else if (isFlagged) cls += "bg-orange-400 text-white hover:bg-orange-500";
    else if (isAnswered) cls += "bg-green-500 text-white hover:bg-green-600";
    else cls += "bg-gray-100 text-gray-500 hover:bg-gray-200";

    btn.className = cls;
    btn.textContent = i + 1;
    btn.onclick = () => { current = i; render(); };
    grid.appendChild(btn);
  });
}

function renderProgress() {
  const pct = ((current + 1) / questions.length) * 100;
  const bar = document.getElementById("progressBar");
  if (bar) bar.style.width = pct + "%";
}

function renderAnsweredCount() {
  const count = answers.filter((a) => a !== null).length;
  const el = document.getElementById("answeredCount");
  if (el) el.textContent = `${count}/${questions.length}`;
}

// ============================================================
//  NAVIGATION
// ============================================================
function goToNext() {
  if (current < questions.length - 1) { current++; render(); }
  else submitExam();
}

function goToPrevious() {
  if (current > 0) { current--; render(); }
}

function toggleFlag() {
  if (flagged.has(current)) flagged.delete(current);
  else flagged.add(current);
  saveState();
  render();
}

// ============================================================
//  SUBMIT
// ============================================================
function submitExam() {
  const answered = answers.filter((a) => a !== null).length;
  const unanswered = questions.length - answered;
  document.getElementById("submitSummary").innerHTML = `
    <div class="flex justify-between"><span class="text-slate-500">Answered:</span><span class="font-bold text-green-600">${answered}</span></div>
    <div class="flex justify-between"><span class="text-slate-500">Unanswered:</span><span class="font-bold text-slate-400">${unanswered}</span></div>
    <div class="flex justify-between"><span class="text-slate-500">Flagged:</span><span class="font-bold text-orange-500">${flagged.size}</span></div>
  `;
  openModal("confirmModal");
}

function confirmSubmit() {
  clearInterval(timer);
  finished = true;
  clearState();
  endExamSession();
  closeModal("confirmModal");
  setTimeout(showResults, 300);
}

function showResults() {
  closeModal("timeUpModal");
  finished = true;
  clearState();
  endExamSession();
  sessionStorage.removeItem("examprep_last_exam");

  let correct = 0;
  questions.forEach((q, i) => {
    if (answers[i] !== null && answers[i] === q.answer) correct++;
  });
  const pct = Math.round((correct / questions.length) * 100);

  localStorage.setItem('grade', questions.length);
  localStorage.setItem('score', correct);

  const user = JSON.parse(localStorage.getItem('examprep_current_user') || '{}');
  const fullNames = (user.name || 'Student Student').split(' ');
  localStorage.setItem('firstName', fullNames[0] || 'Student');
  localStorage.setItem('lastName', fullNames.slice(1).join(' ') || 'User');
  localStorage.setItem('examprep_last_questions', JSON.stringify(questions));
  localStorage.setItem('examprep_last_answers', JSON.stringify(answers));

  if (pct === 100) window.location.replace('./FullMark.html');
  else window.location.replace('./Score.html');
}

function retakeExam() {
  current = 0;
  answers = new Array(questions.length).fill(null);
  flagged.clear();
  timeLeft = 30 * 60;
  finished = false;

  const reshuffled = shuffle(originalBank);
  questions.length = 0;
  reshuffled.forEach((q) => questions.push(q));

  clearCompleted();
  setExamSession(subjectKey);
  sessionStorage.removeItem("examprep_last_exam");

  closeModal("resultsModal");

  setTimeout(() => {
    timer = setInterval(tick, 1000);
    showTimer();
    render();
    const timerEl = document.getElementById("timer");
    if (timerEl) timerEl.classList.remove("text-red-500");
    const tc = document.getElementById("timerContainer");
    if (tc) tc.classList.remove("animate-pulse");
  }, 300);
}

// ============================================================
//  MODAL HELPERS
// ============================================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  const content = modal.children[0];
  modal.classList.remove("opacity-0", "invisible");
  modal.classList.add("opacity-100", "visible");
  content.classList.remove("scale-90");
  content.classList.add("scale-100");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  const content = modal.children[0];
  content.classList.add("scale-90");
  content.classList.remove("scale-100");
  setTimeout(() => {
    modal.classList.add("opacity-0", "invisible");
    modal.classList.remove("opacity-100", "visible");
  }, 200);
}

document.querySelectorAll("[id$='Modal']").forEach((modal) => {
  modal.addEventListener("click", function (e) {
    if (e.target === this && this.id === "confirmModal") closeModal(this.id);
  });
});

// ============================================================
//  KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener("keydown", (e) => {
  if (finished) return;
  const confirmModal = document.getElementById("confirmModal");
  if (confirmModal && !confirmModal.classList.contains("invisible")) return;

  if (e.key === "ArrowRight") goToNext();
  if (e.key === "ArrowLeft") goToPrevious();
  if (e.key === "f" || e.key === "F") toggleFlag();
  if (e.key >= "1" && e.key <= "4") {
    const idx = parseInt(e.key) - 1;
    if (idx < questions[current].options.length) {
      answers[current] = idx;
      saveState();
      render();
    }
  }
});

// ============================================================
//  HANDLE BACK ARROW LINK (السهم في الصفحة)
// ============================================================
function handleBack() {
  if (finished) {
    sessionStorage.removeItem("examprep_last_exam");
    window.location.replace('./ExamSelect.html');
    return;
  }
  showBackBlockedToast();
  window.history.pushState(null, '', window.location.href);
}

const backLink = document.getElementById('backArrow');
if (backLink) {
  backLink.addEventListener('click', function (e) {
    e.preventDefault();
    handleBack();
  });
}

// ============================================================
//  START
// ============================================================
init();