const dateDisplay = document.getElementById("dateDisplay");
if (dateDisplay) {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  dateDisplay.textContent = `${year}-${month}-${day}`;
}

function numberValue(id) {
  const el = document.getElementById(id);
  if (!el) return NaN;
  const v = Number(el.value);
  return Number.isFinite(v) ? v : NaN;
}

function setOutput(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function typesetIfAvailable(target = document.body) {
  if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
    window.MathJax.typesetPromise([target]).catch(() => {});
  }
}

function toggleOne(id) {
  const el = document.getElementById(id);
  if (el) {
    const show = el.style.display !== "block";
    el.style.display = show ? "block" : "none";
    if (show) typesetIfAvailable(el);
  }
}

function toggleGroup(headerBtn) {
  const group = headerBtn.parentElement;
  if (group) group.classList.toggle("collapsed");
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const header = document.querySelector(".header");
  if (sidebar && header) {
    sidebar.classList.toggle("mobile-open");
    header.classList.toggle("menu-open");
  }
}

function navigateTo(sectionId, subLinkId = null, navId = null) {
  const sidebar = document.querySelector(".sidebar");
  const header = document.querySelector(".header");
  if (sidebar) sidebar.classList.remove("mobile-open");
  if (header) header.classList.remove("menu-open");

  const sections = document.querySelectorAll(".content-section");
  sections.forEach((sec) => sec.classList.remove("active"));

  const target = document.getElementById(sectionId);
  if (target) target.classList.add("active");

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((item) => item.classList.remove("active"));

  const activeNav = navId ? document.getElementById(navId) : document.getElementById("nav-" + sectionId);
  if (activeNav) {
    activeNav.classList.add("active");
    let parent = activeNav.parentElement;
    while (parent && !parent.classList.contains("sidebar")) {
      if (parent.classList.contains("nav-group")) parent.classList.remove("collapsed");
      parent = parent.parentElement;
    }
  }

  const mainScroll = document.getElementById("main-scroll");
  if (subLinkId) {
    setTimeout(() => {
      const subTarget = document.getElementById(subLinkId);
      if (subTarget) subTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      if (target) typesetIfAvailable(target);
    }, 70);
  } else if (mainScroll) {
    mainScroll.scrollTop = 0;
    if (target) typesetIfAvailable(target);
  }
}

function scrollToProgress() {
  navigateTo("study-system", null, "nav-study-system");
  setTimeout(() => {
    const target = document.getElementById("progressAnchor");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 70);
}

function initProgressTracking() {
  const checks = document.querySelectorAll("input[data-progress]");
  checks.forEach((chk) => {
    const key = `physics_progress_${chk.dataset.progress}`;
    const saved = localStorage.getItem(key);
    chk.checked = saved === "1";
    chk.addEventListener("change", () => {
      localStorage.setItem(key, chk.checked ? "1" : "0");
    });
  });
}

function initUnitCalculators() {
  const u1Btn = document.getElementById("u1CalcBtn");
  if (u1Btn) {
    u1Btn.addEventListener("click", () => {
      const di = numberValue("u1di");
      const df = numberValue("u1df");
      const dt = numberValue("u1dt");
      if ([di, df, dt].some((v) => Number.isNaN(v)) || dt === 0) {
        setOutput("u1Output", "Enter valid numbers and a non-zero time interval.");
        return;
      }
      const dd = df - di;
      const vavg = dd / dt;
      const direction = dd > 0 ? "positive direction" : dd < 0 ? "negative direction" : "no net direction change";
      setOutput("u1Output", `Displacement = ${dd.toFixed(3)} m. Average velocity = ${vavg.toFixed(3)} m/s. Motion summary: ${direction}.`);
    });
  }

  const u2Btn = document.getElementById("u2CalcBtn");
  if (u2Btn) {
    u2Btn.addEventListener("click", () => {
      const vi = numberValue("u2vi");
      const a = numberValue("u2a");
      const t = numberValue("u2t");
      if ([vi, a, t].some((v) => Number.isNaN(v))) {
        setOutput("u2Output", "Enter valid numbers for vi, a, and t.");
        return;
      }
      const vf = vi + a * t;
      const d = vi * t + 0.5 * a * t * t;
      setOutput("u2Output", `Final velocity v_f = ${vf.toFixed(3)} m/s. Displacement Δd = ${d.toFixed(3)} m.`);
    });
  }

  const u3Btn = document.getElementById("u3CalcBtn");
  if (u3Btn) {
    u3Btn.addEventListener("click", () => {
      const v0 = numberValue("u3v0");
      const ang = numberValue("u3ang");
      const g = numberValue("u3g");
      if ([v0, ang, g].some((v) => Number.isNaN(v)) || g <= 0) {
        setOutput("u3Output", "Enter valid speed, angle, and positive g.");
        return;
      }
      const rad = ang * Math.PI / 180;
      const vx = v0 * Math.cos(rad);
      const vy = v0 * Math.sin(rad);
      const tFlight = (2 * vy) / g;
      const range = vx * tFlight;
      const hMax = (vy ** 2) / (2 * g);
      setOutput("u3Output", `Horizontal speed = ${vx.toFixed(3)} m/s, vertical launch speed = ${vy.toFixed(3)} m/s, flight time = ${tFlight.toFixed(3)} s, range = ${range.toFixed(3)} m, max height = ${hMax.toFixed(3)} m.`);
    });
  }

  const u4Btn = document.getElementById("u4CalcBtn");
  if (u4Btn) {
    u4Btn.addEventListener("click", () => {
      const m = numberValue("u4m");
      const Fr = numberValue("u4Fr");
      const Fl = numberValue("u4Fl");
      if ([m, Fr, Fl].some((v) => Number.isNaN(v)) || m <= 0) {
        setOutput("u4Output", "Enter valid mass and force values.");
        return;
      }
      const net = Fr - Fl;
      const a = net / m;
      const dir = net > 0 ? "right" : net < 0 ? "left" : "no acceleration (balanced forces)";
      setOutput("u4Output", `Net force = ${net.toFixed(3)} N. Acceleration = ${a.toFixed(3)} m/s². Direction: ${dir}.`);
    });
  }

  const u5Btn = document.getElementById("u5CalcBtn");
  if (u5Btn) {
    u5Btn.addEventListener("click", () => {
      const m1 = numberValue("u5m1");
      const v1 = numberValue("u5v1");
      const m2 = numberValue("u5m2");
      const v2 = numberValue("u5v2");
      const typeEl = document.querySelector("input[name='u5type']:checked");
      const type = typeEl ? typeEl.value : "inelastic";
      if ([m1, v1, m2, v2].some((v) => Number.isNaN(v)) || m1 <= 0 || m2 <= 0) {
        setOutput("u5Output", "Enter valid masses and velocities.");
        return;
      }
      if (type === "inelastic") {
        const vf = (m1 * v1 + m2 * v2) / (m1 + m2);
        setOutput("u5Output", `Perfectly inelastic result: combined final velocity = ${vf.toFixed(3)} m/s.`);
      } else {
        const v1f = ((m1 - m2) / (m1 + m2)) * v1 + ((2 * m2) / (m1 + m2)) * v2;
        const v2f = ((2 * m1) / (m1 + m2)) * v1 + ((m2 - m1) / (m1 + m2)) * v2;
        setOutput("u5Output", `Elastic (ideal 1D): v1f = ${v1f.toFixed(3)} m/s, v2f = ${v2f.toFixed(3)} m/s.`);
      }
    });
  }

  const u6Btn = document.getElementById("u6CalcBtn");
  if (u6Btn) {
    u6Btn.addEventListener("click", () => {
      const m = numberValue("u6m");
      const v = numberValue("u6v");
      const h = numberValue("u6h");
      const g = numberValue("u6g");
      if ([m, v, h, g].some((n) => Number.isNaN(n)) || m <= 0 || g <= 0) {
        setOutput("u6Output", "Enter valid positive values.");
        return;
      }
      const K = 0.5 * m * v * v;
      const Ug = m * g * h;
      const Em = K + Ug;
      setOutput("u6Output", `Kinetic energy K = ${K.toFixed(3)} J, gravitational potential U_g = ${Ug.toFixed(3)} J, total mechanical energy E = ${Em.toFixed(3)} J.`);
    });
  }
}

const quickfireBank = [
  {
    q: "If an object returns to where it started, what is its displacement?",
    choices: ["Positive", "Negative", "Zero", "Unknown"],
    ans: 2,
    explain: "Displacement compares final and initial position only, so start = end gives zero displacement."
  },
  {
    q: "Slope of a displacement-time graph gives:",
    choices: ["Velocity", "Acceleration", "Mass", "Power"],
    ans: 0,
    explain: "Slope means change in displacement per time, which is velocity."
  },
  {
    q: "Area under a velocity-time graph gives:",
    choices: ["Force", "Displacement", "Acceleration", "Weight"],
    ans: 1,
    explain: "Area is velocity multiplied by time, which is displacement."
  },
  {
    q: "In ideal projectile motion, horizontal acceleration is:",
    choices: ["0", "g", "-g", "depends on mass"],
    ans: 0,
    explain: "In the ideal model, gravity acts vertically, so horizontal acceleration is zero."
  },
  {
    q: "Which equation matches Newton's second law?",
    choices: ["p = mv", "ΣF = ma", "K = 1/2mv^2", "P = ΔE/Δt"],
    ans: 1,
    explain: "Net external force determines acceleration through ΣF = ma."
  },
  {
    q: "In a closed-system collision, which quantity is conserved?",
    choices: ["Momentum", "Temperature", "Height", "Power"],
    ans: 0,
    explain: "Momentum is conserved when external impulse is negligible."
  },
  {
    q: "If speed doubles, kinetic energy changes by factor:",
    choices: ["2", "3", "4", "8"],
    ans: 2,
    explain: "Kinetic energy is proportional to v^2, so doubling speed multiplies K by 4."
  },
  {
    q: "A free body diagram shows:",
    choices: ["All objects in room", "Only external forces on one chosen system", "Only internal forces", "Only acceleration arrows"],
    ans: 1,
    explain: "Pick one system and draw only forces from outside that system."
  },
  {
    q: "Power is best described as:",
    choices: ["Energy stored", "Rate of energy change", "Mass times velocity", "Direction of motion"],
    ans: 1,
    explain: "Power tells how fast energy is transferred or transformed over time."
  }
];

let gameScore = 0;
let gameTotal = 0;

function renderGameQuestion() {
  const prompt = document.getElementById("gamePrompt");
  const choicesWrap = document.getElementById("gameChoices");
  const output = document.getElementById("gameOutput");
  if (!prompt || !choicesWrap || !output) return;

  const qObj = quickfireBank[Math.floor(Math.random() * quickfireBank.length)];
  prompt.textContent = qObj.q;
  choicesWrap.innerHTML = "";

  qObj.choices.forEach((choiceText, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.type = "button";
    btn.textContent = choiceText;
    btn.addEventListener("click", () => {
      gameTotal += 1;
      const isCorrect = idx === qObj.ans;
      if (isCorrect) {
        gameScore += 1;
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
      }
      Array.from(choicesWrap.children).forEach((child, childIdx) => {
        if (childIdx === qObj.ans) child.classList.add("correct");
        child.disabled = true;
      });
      const feedback = isCorrect ? "Correct." : "Not quite.";
      output.textContent = `Score: ${gameScore} / ${gameTotal}. ${feedback} ${qObj.explain}`;
    });
    choicesWrap.appendChild(btn);
  });
}

function initQuickfire() {
  const startBtn = document.getElementById("gameStartBtn");
  const resetBtn = document.getElementById("gameResetBtn");
  const output = document.getElementById("gameOutput");

  if (startBtn) {
    startBtn.addEventListener("click", () => renderGameQuestion());
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      gameScore = 0;
      gameTotal = 0;
      if (output) output.textContent = "Score: 0 / 0";
      const choicesWrap = document.getElementById("gameChoices");
      const prompt = document.getElementById("gamePrompt");
      if (choicesWrap) choicesWrap.innerHTML = "";
      if (prompt) prompt.textContent = "Press Start to begin quickfire.";
    });
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const sidebar = document.querySelector(".sidebar");
    const header = document.querySelector(".header");
    if (sidebar) sidebar.classList.remove("mobile-open");
    if (header) header.classList.remove("menu-open");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  navigateTo("intro-page", null, "nav-intro-page");
  initProgressTracking();
  initUnitCalculators();
  initQuickfire();
  typesetIfAvailable(document.body);
});

window.toggleOne = toggleOne;
window.toggleGroup = toggleGroup;
window.navigateTo = navigateTo;
window.toggleSidebar = toggleSidebar;
window.scrollToProgress = scrollToProgress;
