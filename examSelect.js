// ===========================
// ===== PREVENT BACK NAV ====
// ===========================
(function preventBackNavigation() {
  // لو المستخدم رجع بزرار Back لهذه الصفحة من صفحة الامتحان
  const lastExamUrl = sessionStorage.getItem("examprep_last_exam");

  if (lastExamUrl) {
    const navType =
      window.performance.getEntriesByType("navigation")[0]?.type;
    if (navType === "back_forward") {
      // ارجعه لصفحة الامتحان تاني
      window.location.replace(lastExamUrl);
      return;
    }
  }
})();

// دالة الانتقال للامتحان — بتشيل الصفحة الحالية من الـ history
function navigateToExam(subject) {
  sessionStorage.setItem("examprep_last_exam", './Exam.html?subject=' + subject);
  window.location.replace('./Exam.html?subject=' + subject);
}

// ===========================
// ===== THEME TOGGLE ========
// ===========================
function toggleTheme() {
  const html = document.documentElement;
  html.classList.add("theme-transition");
  html.classList.toggle("dark");

  const isDark = html.classList.contains("dark");
  localStorage.setItem("examprep_theme", isDark ? "dark" : "light");

  if (isDark) {
    document.body.style.background =
      "linear-gradient(135deg, #0a0a14, #0f0f1a)";
  } else {
    document.body.style.background = "";
  }

  setTimeout(() => html.classList.remove("theme-transition"), 600);
}

(function loadTheme() {
  const saved = localStorage.getItem("examprep_theme");
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  if (saved === "dark" || (!saved && prefersDark)) {
    document.documentElement.classList.add("dark");
    document.body.style.background =
      "linear-gradient(135deg, #0a0a14, #0f0f1a)";
  }
})();

// ===========================
// ===== AUTH CHECK ===========
// ===========================
let currentUser = null;
try {
  currentUser = JSON.parse(
    localStorage.getItem("examprep_current_user") || "null"
  );
} catch (e) {
  console.error("Auth parse error", e);
}

if (!currentUser) {
  window.location.href = "./auth.html";
} else {
  const navLoginBtn = document.getElementById("navLoginBtn");
  const navUserArea = document.getElementById("navUserArea");

  if (navLoginBtn) navLoginBtn.classList.add("hidden");
  if (navUserArea) {
    navUserArea.classList.remove("hidden");
    navUserArea.classList.add("flex");
  }

  const avatar = document.getElementById("navAvatar");
  const name = document.getElementById("navUserName");
  if (avatar) avatar.textContent = currentUser.name.charAt(0).toUpperCase();
  if (name) name.textContent = currentUser.name;
}

function logoutUser() {
  localStorage.removeItem("examprep_current_user");
  sessionStorage.removeItem("examprep_last_exam");
  window.location.href = "./index.html";
}

// ===========================
// ===== NAVBAR SCROLL =======
// ===========================
const examNav = document.getElementById("examNav");
if (examNav) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      examNav.classList.add("nav-scrolled");
    } else {
      examNav.classList.remove("nav-scrolled");
    }
  });
}

// ===========================
// ===== SEARCH & FILTER =====
// ===========================
const examSearch = document.getElementById("examSearch");
const searchClear = document.getElementById("searchClear");
const searchHint = document.getElementById("searchHint");
const filterTabs = document.querySelectorAll(".filter-tab");
const examCards = document.querySelectorAll(".exam-card-wrapper");
const noResults = document.getElementById("noResults");

let currentFilter = "all";
let currentSearchTerm = "";

function filterExams() {
  let visibleCount = 0;

  examCards.forEach((card, index) => {
    const subject = (card.getAttribute("data-subject") || "").toLowerCase();
    const name = (card.getAttribute("data-name") || "").toLowerCase();

    const filterMatch = currentFilter === "all" || subject === currentFilter;
    const searchMatch =
      currentSearchTerm === "" ||
      subject.includes(currentSearchTerm) ||
      name.includes(currentSearchTerm);

    if (filterMatch && searchMatch) {
      card.classList.remove("card-hidden");
      card.classList.add("card-visible");
      card.style.display = "";
      visibleCount++;

      setTimeout(() => {
        card.classList.add("search-highlight");
        setTimeout(() => card.classList.remove("search-highlight"), 600);
      }, visibleCount * 80);
    } else {
      card.classList.add("card-hidden");
      card.classList.remove("card-visible");
      setTimeout(() => {
        if (card.classList.contains("card-hidden")) {
          card.style.display = "none";
        }
      }, 300);
    }
  });

  if (noResults) {
    if (visibleCount === 0) {
      noResults.classList.remove("hidden");
    } else {
      noResults.classList.add("hidden");
    }
  }
}

// Search input
if (examSearch) {
  examSearch.addEventListener("input", function (e) {
    currentSearchTerm = e.target.value.trim().toLowerCase();

    if (currentSearchTerm.length > 0) {
      if (searchClear) {
        searchClear.classList.remove("hidden");
        searchClear.classList.add("flex");
      }
      if (searchHint) searchHint.classList.add("hidden");
    } else {
      if (searchClear) {
        searchClear.classList.add("hidden");
        searchClear.classList.remove("flex");
      }
      if (searchHint) searchHint.classList.remove("hidden");
    }

    filterExams();
  });

  examSearch.addEventListener("focus", function () {
    if (searchHint && currentSearchTerm.length === 0) {
      searchHint.style.opacity = "0.5";
    }
  });

  examSearch.addEventListener("blur", function () {
    if (searchHint) {
      searchHint.style.opacity = "";
    }
  });
}

// Clear search
if (searchClear) {
  searchClear.addEventListener("click", function () {
    if (examSearch) {
      examSearch.value = "";
      currentSearchTerm = "";
      examSearch.focus();
    }
    searchClear.classList.add("hidden");
    searchClear.classList.remove("flex");
    if (searchHint) searchHint.classList.remove("hidden");
    filterExams();
  });
}

// Reset search
function resetSearch() {
  if (examSearch) {
    examSearch.value = "";
    currentSearchTerm = "";
  }
  currentFilter = "all";

  if (searchClear) {
    searchClear.classList.add("hidden");
    searchClear.classList.remove("flex");
  }
  if (searchHint) searchHint.classList.remove("hidden");

  filterTabs.forEach((tab) => tab.classList.remove("active"));
  const allTab = document.querySelector('.filter-tab[data-filter="all"]');
  if (allTab) allTab.classList.add("active");

  filterExams();
}

// Filter tabs
filterTabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    filterTabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
    currentFilter = this.getAttribute("data-filter");
    filterExams();
  });
});

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    if (examSearch) examSearch.focus();
  }
  if (e.key === "/" && document.activeElement !== examSearch) {
    e.preventDefault();
    if (examSearch) examSearch.focus();
  }
  if (e.key === "Escape" && document.activeElement === examSearch) {
    examSearch.blur();
  }
});

// ===========================
// ===== TILT EFFECT =========
// ===========================
function initTiltEffect() {
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-16px) scale(1.03)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)";
      });
    });
  }
}

initTiltEffect();

// ===========================
// ===== PARTICLE MOUSE ======
// ===========================
function initParticleEffect() {
  if (window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("mousemove", (e) => {
      const particles = document.querySelectorAll(".particle");
      particles.forEach((particle, i) => {
        const speed = (i + 1) * 0.008;
        const x = (window.innerWidth / 2 - e.clientX) * speed;
        const y = (window.innerHeight / 2 - e.clientY) * speed;
        particle.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }
}

initParticleEffect();

// ===========================
// ===== SMOOTH LOAD =========
// ===========================
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.4s ease";
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 50);
});