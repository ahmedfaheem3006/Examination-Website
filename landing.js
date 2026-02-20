// ===== PROGRESS BAR =====
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.getElementById("progressBar").style.width = scrollPercent + "%";
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    navbar.classList.add("nav-scrolled");
  } else {
    navbar.classList.remove("nav-scrolled");
  }
});

// ===== HAMBURGER MENU (FIXED) =====
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const bar1 = document.getElementById("bar1");
const bar2 = document.getElementById("bar2");
const bar3 = document.getElementById("bar3");
let menuOpen = false;

function openMenu() {
  menuOpen = true;
  mobileMenu.classList.remove("translate-x-full");
  mobileMenu.classList.add("translate-x-0");

  // Animate bars to X shape using inline styles for precision
  bar1.style.transform = "translateY(8px) rotate(45deg)";
  bar1.style.width = "24px";
  bar2.style.opacity = "0";
  bar2.style.transform = "translateX(-10px)";
  bar3.style.transform = "translateY(-8px) rotate(-45deg)";
  bar3.style.width = "24px";

  // Lock body scroll
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  menuOpen = false;
  mobileMenu.classList.remove("translate-x-0");
  mobileMenu.classList.add("translate-x-full");

  // Reset bars
  bar1.style.transform = "";
  bar1.style.width = "";
  bar2.style.opacity = "";
  bar2.style.transform = "";
  bar3.style.transform = "";
  bar3.style.width = "";

  // Unlock body scroll
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  if (menuOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

// Close mobile menu on link click
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

// Close menu when clicking outside (on the overlay)
mobileMenu.addEventListener("click", (e) => {
  if (e.target === mobileMenu) {
    closeMenu();
  }
});

// Close menu on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuOpen) {
    closeMenu();
  }
});

// Close menu on window resize (if switching to desktop)
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024 && menuOpen) {
    closeMenu();
  }
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll("section[id]");
const navLinksAll = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 200;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinksAll.forEach((link) => {
    link.classList.remove("!text-primary", "!bg-primary/10");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("!text-primary", "!bg-primary/10");
    }
  });
});

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .reveal-scale"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -60px 0px",
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ===== PROGRESS BARS ANIMATION =====
const progressBars = document.querySelectorAll("[data-width]");

const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        setTimeout(() => {
          target.style.width = target.getAttribute("data-width");
        }, 300);
        barObserver.unobserve(target);
      }
    });
  },
  { threshold: 0.5 }
);

progressBars.forEach((bar) => barObserver.observe(bar));

// ===== FAQ ACCORDION =====
document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const parent = question.parentElement;
    const answer = parent.querySelector(".faq-answer");
    const icon = question.querySelector(".faq-icon");
    const isOpen = answer.style.maxHeight && answer.style.maxHeight !== "0px";

    // Close all
    document.querySelectorAll(".faq-answer").forEach((a) => {
      a.style.maxHeight = "0px";
    });
    document.querySelectorAll(".faq-icon").forEach((i) => {
      i.classList.remove("rotate-180");
    });
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("ring-2", "ring-primary/20");
    });

    // Open current if it was closed
    if (!isOpen) {
      answer.style.maxHeight = answer.scrollHeight + "px";
      icon.classList.add("rotate-180");
      parent.classList.add("ring-2", "ring-primary/20");
    }
  });
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    backToTop.classList.remove("opacity-0", "invisible", "translate-y-5");
    backToTop.classList.add("opacity-100", "visible", "translate-y-0");
  } else {
    backToTop.classList.add("opacity-0", "invisible", "translate-y-5");
    backToTop.classList.remove("opacity-100", "visible", "translate-y-0");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute("data-target"));
        const suffix = counter.getAttribute("data-suffix") || "";
        let count = 0;
        const increment = target / 80;

        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          counter.textContent = Math.floor(count) + suffix;
        }, 20);

        counterObserver.unobserve(counter);
      }
    });
  },
  { threshold: 0.8 }
);

counters.forEach((counter) => counterObserver.observe(counter));

// ===== MAGNETIC BUTTON EFFECT =====
document.querySelectorAll(".magnetic").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0, 0)";
  });
});

// ===== TILT EFFECT ON CARDS =====
document.querySelectorAll(".card-hover").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)";
  });
});

// ===== PARALLAX ON HERO IMAGE =====
const heroImage = document.querySelector(".image-wrapper");

if (heroImage) {
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    if (scrolled < 800) {
      heroImage.style.transform = `translateY(${scrolled * 0.08}px)`;
    }
  });
}

// ===== SMOOTH APPEAR ON LOAD =====
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// ===== THEME TOGGLE =====
function toggleTheme() {
  const html = document.documentElement;

  // Add smooth transition class
  html.classList.add("theme-transition");

  // Toggle dark class
  html.classList.toggle("dark");

  // Save preference
  const isDark = html.classList.contains("dark");
  localStorage.setItem("examprep_theme", isDark ? "dark" : "light");

  // Update body background for dark mode
  if (isDark) {
    document.body.style.background =
      "linear-gradient(135deg, #0a0a14, #0f0f1a)";
  } else {
    document.body.style.background = "";
  }

  // Remove transition class after animation completes
  setTimeout(() => {
    html.classList.remove("theme-transition");
  }, 600);
}

// Load saved theme on page load
function loadTheme() {
  const savedTheme = localStorage.getItem("examprep_theme");
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add("dark");
    document.body.style.background =
      "linear-gradient(135deg, #0a0a14, #0f0f1a)";
  }
}

// Initialize theme
loadTheme();

function checkAuthState() {
  let user = null;
  try {
    user = JSON.parse(
      localStorage.getItem("examprep_current_user") || "null"
    );
  } catch (e) {
    console.error("Auth parse error", e);
  }

  if (user) {
    const initial = user.name.charAt(0).toUpperCase();
    // Desktop
    const deskGuest = document.getElementById("desktopGuest");
    const deskUser = document.getElementById("desktopUser");
    if (deskGuest) deskGuest.classList.add("hidden");
    if (deskUser) {
      deskUser.classList.remove("hidden");
      deskUser.classList.add("flex");
    }
    const deskAvatar = document.getElementById("desktopAvatar");
    const deskName = document.getElementById("desktopUserName");
    if (deskAvatar) deskAvatar.textContent = initial;
    if (deskName) deskName.textContent = user.name;

    // Mobile
    const mobGuest = document.getElementById("mobileGuest");
    const mobUser = document.getElementById("mobileUser");
    if (mobGuest) mobGuest.classList.add("hidden");
    if (mobUser) {
      mobUser.classList.remove("hidden");
      mobUser.classList.add("flex");
    }
    const mobAvatar = document.getElementById("mobileAvatar");
    const mobName = document.getElementById("mobileUserName");
    if (mobAvatar) mobAvatar.textContent = initial;
    if (mobName) mobName.textContent = user.name;
  }
}

function logoutUser() {
  localStorage.removeItem("examprep_current_user");
  window.location.href = "./auth.html";
}

checkAuthState();