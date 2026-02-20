(function checkAuthGuard() {
  const currentUser = localStorage.getItem("examprep_current_user");
  if (currentUser) {
    window.location.replace("./index.html");
  }
})();

window.addEventListener("load", () => {
  if (window.location.hash === "#register") {
    toggleAuth(true);
  }
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

function toggleAuth(showRegister) {
  const container = document.getElementById("authContainer");
  if (showRegister) {
    container.classList.add("register-active");
    window.location.hash = "register";
  } else {
    container.classList.remove("register-active");
    window.location.hash = "";
  }
}

// ===== TOGGLE PASSWORD VISIBILITY =====
function togglePass(inputId, el) {
  const input = document.getElementById(inputId);
  const icon = el.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

// ===== PASSWORD STRENGTH (FIXED) =====
const signUpPasswordInput = document.getElementById("signUpPassword");
if (signUpPasswordInput) {
  signUpPasswordInput.addEventListener("input", function () {
    const val = this.value;
    const bar = document.getElementById("strengthBar");
    const text = document.getElementById("strengthText");

    // ★★★ FIX: If empty string, reset to zero ★★★
    if (val.length === 0) {
      bar.style.width = "0%";
      bar.style.backgroundColor = "#d1d5db";
      text.textContent = "";
      text.style.color = "";
      return; // Exit early, no need to calculate
    }

    let strength = 0;
    let label = "";
    let color = "";

    if (val.length >= 6) strength++;
    if (val.length >= 10) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;

    switch (strength) {
      case 0:
      case 1:
        label = "Very Weak";
        color = "#ef4444";
        bar.style.width = "20%";
        break;
      case 2:
        label = "Weak";
        color = "#f97316";
        bar.style.width = "40%";
        break;
      case 3:
        label = "Medium";
        color = "#eab308";
        bar.style.width = "60%";
        break;
      case 4:
        label = "Strong";
        color = "#22c55e";
        bar.style.width = "80%";
        break;
      case 5:
        label = "Very Strong";
        color = "#16a34a";
        bar.style.width = "100%";
        break;
    }

    bar.style.backgroundColor = color;
    text.textContent = `Password strength: ${label}`;
    text.style.color = color;
  });
}

// ===== HANDLE SIGN UP =====
function handleSignUp(e) {
  e.preventDefault();

  const name = document.getElementById("signUpName").value.trim();
  const email = document.getElementById("signUpEmail").value.trim();
  const password = document.getElementById("signUpPassword").value;

  if (!name || !email || !password) return;

  // Check password minimum strength
  if (password.length < 6) {
    shakeElement(document.getElementById("signUpForm"));
    alert("Password must be at least 6 characters long!");
    return;
  }

  // Save to localStorage
  const users = JSON.parse(localStorage.getItem("examprep_users") || "[]");

  // Check if email already exists
  if (users.find((u) => u.email === email)) {
    shakeElement(document.getElementById("signUpForm"));
    alert("This email is already registered!");
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("examprep_users", JSON.stringify(users));

  // Show success modal
  showSuccessModal(
    "Account Created!",
    `Welcome ${name}! Your account has been created successfully.`
  );

  // Reset form
  document.getElementById("signUpForm").reset();

  // ★★★ FIX: Reset strength bar properly ★★★
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");
  if (strengthBar) {
    strengthBar.style.width = "0%";
    strengthBar.style.backgroundColor = "#d1d5db";
  }
  if (strengthText) {
    strengthText.textContent = "";
    strengthText.style.color = "";
  }

  // Switch to login after delay
  setTimeout(() => {
    toggleAuth(false);
  }, 2000);
}

// ===== HANDLE SIGN IN =====
function handleSignIn(e) {
  e.preventDefault();

  const email = document.getElementById("signInEmail").value.trim();
  const password = document.getElementById("signInPassword").value;
  const errorDiv = document.getElementById("loginError");

  if (!email || !password) return;

  const users = JSON.parse(localStorage.getItem("examprep_users") || "[]");
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Store current user
    localStorage.setItem("examprep_current_user", JSON.stringify(user));

    errorDiv.classList.add("hidden");

    showSuccessModal(
      "Welcome Back!",
      `Hello ${user.name}! Redirecting to your dashboard...`
    );

    // Redirect
    setTimeout(() => {
      window.location.href = "./ExamSelect.html";
    }, 2000);
  } else {
    // Show error
    errorDiv.classList.remove("hidden");
    shakeElement(document.getElementById("signInForm"));

    setTimeout(() => {
      errorDiv.classList.add("hidden");
    }, 3000);
  }
}

// ===== SHAKE ANIMATION =====
function shakeElement(el) {
  el.style.animation = "none";
  el.offsetHeight; // trigger reflow
  el.style.animation = "shake 0.5s ease";
  setTimeout(() => {
    el.style.animation = "";
  }, 500);
}

// ===== FORGOT PASSWORD MODAL =====
function showForgotModal(e) {
  e.preventDefault();
  const modal = document.getElementById("forgotModal");
  const content = document.getElementById("forgotModalContent");
  modal.classList.remove("opacity-0", "invisible");
  modal.classList.add("opacity-100", "visible");
  content.classList.remove("scale-90");
  content.classList.add("scale-100");
}

function closeForgotModal() {
  const modal = document.getElementById("forgotModal");
  const content = document.getElementById("forgotModalContent");
  content.classList.add("scale-90");
  content.classList.remove("scale-100");
  setTimeout(() => {
    modal.classList.add("opacity-0", "invisible");
    modal.classList.remove("opacity-100", "visible");
  }, 200);
}

function sendReset() {
  const email = document.getElementById("forgotEmail").value;
  if (!email) return;

  closeForgotModal();
  setTimeout(() => {
    showSuccessModal(
      "Email Sent!",
      `A password reset link has been sent to ${email}`
    );
  }, 300);
}

// ===== SUCCESS MODAL =====
function showSuccessModal(title, message) {
  const modal = document.getElementById("successModal");
  const content = document.getElementById("successModalContent");
  document.getElementById("successTitle").textContent = title;
  document.getElementById("successMessage").textContent = message;

  modal.classList.remove("opacity-0", "invisible");
  modal.classList.add("opacity-100", "visible");
  content.classList.remove("scale-90");
  content.classList.add("scale-100");
}

function closeSuccessModal() {
  const modal = document.getElementById("successModal");
  const content = document.getElementById("successModalContent");
  content.classList.add("scale-90");
  content.classList.remove("scale-100");
  setTimeout(() => {
    modal.classList.add("opacity-0", "invisible");
    modal.classList.remove("opacity-100", "visible");
  }, 200);
}

// ===== INPUT ANIMATION - FOCUS RING =====
document.querySelectorAll(".input-group input").forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentElement.classList.add("scale-[1.02]");
    this.parentElement.style.transition = "transform 0.3s ease";
  });
  input.addEventListener("blur", function () {
    this.parentElement.classList.remove("scale-[1.02]");
  });
});

// ===== SOCIAL ICONS STAGGER ANIMATION =====
document
  .querySelectorAll(".social-icons a, form .flex.gap-3 a")
  .forEach((icon, i) => {
    icon.style.opacity = "0";
    icon.style.animation = `bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${0.3 + i * 0.1}s forwards`;
  });

// ===== KEYBOARD NAVIGATION =====
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeForgotModal();
    closeSuccessModal();
  }
});

// ===== CLOSE MODALS ON BACKDROP CLICK =====
document.getElementById("forgotModal").addEventListener("click", function (e) {
  if (e.target === this) closeForgotModal();
});

document
  .getElementById("successModal")
  .addEventListener("click", function (e) {
    if (e.target === this) closeSuccessModal();
  });

// ===== RESPONSIVE: Handle auth container on mobile =====
function handleResize() {
  const container = document.getElementById("authContainer");
  const signInForm = container.querySelector(".sign-in-form");
  const signUpForm = container.querySelector(".sign-up-form");

  if (window.innerWidth < 1024) {
    signInForm.style.width = "100%";
    signUpForm.style.width = "100%";

    if (container.classList.contains("register-active")) {
      signInForm.style.transform = "translateX(-100%)";
      signUpForm.style.transform = "translateX(0)";
      signUpForm.style.opacity = "1";
      signUpForm.style.pointerEvents = "all";
    } else {
      signInForm.style.transform = "translateX(0)";
      signUpForm.style.transform = "translateX(100%)";
      signUpForm.style.opacity = "0";
      signUpForm.style.pointerEvents = "none";
    }
  } else {
    signInForm.style.width = "50%";
    signUpForm.style.width = "50%";
    signInForm.style.transform = "";
    signUpForm.style.transform = "";
  }
}

window.addEventListener("resize", handleResize);
window.addEventListener("load", handleResize);

// Observe auth container class changes for mobile
const authObserver = new MutationObserver(() => {
  handleResize();
});

authObserver.observe(document.getElementById("authContainer"), {
  attributes: true,
  attributeFilter: ["class"],
});

// ===== PARTICLE MOUSE INTERACTION =====
document.addEventListener("mousemove", (e) => {
  const particles = document.querySelectorAll(".particle");
  particles.forEach((particle, i) => {
    const speed = (i + 1) * 0.01;
    const x = (window.innerWidth / 2 - e.clientX) * speed;
    const y = (window.innerHeight / 2 - e.clientY) * speed;
    particle.style.transform = `translate(${x}px, ${y}px)`;
  });
});