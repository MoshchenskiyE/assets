/* RoadReady MA — gamified course logic. Vanilla JS, no build, fully offline. */
(function () {
  "use strict";

  /* ---------------- Persistent state ---------------- */
  const SAVE_KEY = "roadready_ma_v1";
  const MAX_HEARTS = 5;
  const XP_PER_CORRECT = 10;

  const defaultState = {
    xp: 0,
    streak: 1,
    hearts: MAX_HEARTS,
    heartsAt: Date.now(),
    completed: {}, // lessonId -> bestAccuracy
    lastDay: todayKey(),
  };

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return { ...defaultState };
      const s = { ...defaultState, ...JSON.parse(raw) };
      // Refill 1 heart every 30 min, cap at MAX.
      if (s.hearts < MAX_HEARTS) {
        const gained = Math.floor((Date.now() - (s.heartsAt || 0)) / (30 * 60 * 1000));
        if (gained > 0) {
          s.hearts = Math.min(MAX_HEARTS, s.hearts + gained);
          s.heartsAt = Date.now();
        }
      }
      // Streak bookkeeping.
      const t = todayKey();
      if (s.lastDay !== t) {
        const diff = (new Date(t) - new Date(s.lastDay)) / 86400000;
        s.streak = diff === 1 ? s.streak + 1 : 1;
        s.lastDay = t;
      }
      return s;
    } catch (e) {
      return { ...defaultState };
    }
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
      /* storage may be unavailable (private mode) — run in-memory */
    }
  }

  let state = load();

  /* ---------------- Flatten lessons for ordering ---------------- */
  const allLessons = [];
  UNITS.forEach((u, ui) =>
    u.lessons.forEach((l) => allLessons.push({ ...l, unitIndex: ui, color: u.color }))
  );
  const lessonById = Object.fromEntries(allLessons.map((l) => [l.id, l]));

  function isUnlocked(lessonId) {
    const idx = allLessons.findIndex((l) => l.id === lessonId);
    if (idx === 0) return true;
    return !!state.completed[allLessons[idx - 1].id];
  }
  function firstIncompleteId() {
    const l = allLessons.find((x) => !state.completed[x.id]);
    return l ? l.id : null;
  }

  /* ---------------- DOM refs ---------------- */
  const $ = (id) => document.getElementById(id);
  const screens = {
    home: $("screen-home"),
    lesson: $("screen-lesson"),
    complete: $("screen-complete"),
    failed: $("screen-failed"),
  };
  function show(name) {
    Object.values(screens).forEach((s) => s.classList.remove("is-active"));
    screens[name].classList.add("is-active");
    window.scrollTo(0, 0);
  }

  /* ---------------- Top-bar stats ---------------- */
  function renderStats() {
    $("statStreak").textContent = state.streak;
    $("statXp").textContent = state.xp;
    $("statHearts").textContent = state.hearts;
  }

  /* ---------------- Build learning path ---------------- */
  const offsets = ["", "off-r", "off-rr", "off-r", "", "off-l", "off-ll", "off-l"];
  function renderPath() {
    const path = $("path");
    path.innerHTML = "";
    const startId = firstIncompleteId();
    let nodeCounter = 0;

    UNITS.forEach((unit) => {
      const banner = document.createElement("div");
      banner.className = "unit-banner unit-" + unit.color;
      banner.innerHTML = `<h2>${esc(unit.title)}</h2><p>${esc(unit.subtitle)}</p>`;
      path.appendChild(banner);

      const trail = document.createElement("div");
      trail.className = "trail";
      unit.lessons.forEach((lesson) => {
        const row = document.createElement("div");
        row.className = "node-row " + offsets[nodeCounter % offsets.length];
        nodeCounter++;

        const done = !!state.completed[lesson.id];
        const unlocked = isUnlocked(lesson.id);
        const isStart = lesson.id === startId;

        const btn = document.createElement("button");
        btn.className =
          "node " + (done ? "node-done" : isStart ? "node-current" : unlocked ? "node-current" : "node-locked");
        btn.setAttribute("aria-label", lesson.title + (unlocked ? "" : " (locked)"));
        btn.innerHTML =
          `<span class="node-face">${done ? "✓" : unlocked ? lesson.icon : "🔒"}</span>` +
          (done ? `<span class="node-badge">⭐</span>` : "") +
          `<span class="node-label">${esc(lesson.title)}</span>`;

        if (unlocked) {
          btn.addEventListener("click", () => startLesson(lesson.id));
        } else {
          btn.addEventListener("click", () => bump(btn));
        }
        row.appendChild(btn);
        trail.appendChild(row);
      });
      path.appendChild(trail);
    });
  }
  function bump(el) {
    el.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
      { duration: 260 }
    );
  }

  /* ---------------- Quick reference cards + modal ---------------- */
  function renderGuide() {
    const grid = $("guideGrid");
    grid.innerHTML = "";
    allLessons.forEach((l) => {
      const card = document.createElement("button");
      card.className = "guide-card";
      card.innerHTML =
        `<span class="gc-ico">${l.icon}</span>` +
        `<span class="gc-title">${esc(l.title)}</span>` +
        `<span class="gc-ref">${esc(l.rule.ref)}</span>`;
      card.addEventListener("click", () => openModal(l));
      grid.appendChild(card);
    });
  }
  function openModal(lesson) {
    $("modalIco").textContent = lesson.icon;
    $("modalTitle").textContent = lesson.rule.heading;
    $("modalPoints").innerHTML = lesson.rule.points.map((p) => `<li>${esc(p)}</li>`).join("");
    $("modalRef").textContent = lesson.rule.ref;
    $("modal").hidden = false;
  }
  $("modalClose").addEventListener("click", () => ($("modal").hidden = true));
  $("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") $("modal").hidden = true;
  });

  /* ---------------- Lesson engine ---------------- */
  let lesson = null;
  let qIndex = 0;
  let correctCount = 0;
  let answeredCount = 0;
  let selected = -1;
  let locked = false;

  function startLesson(id) {
    lesson = lessonById[id];
    qIndex = 0;
    correctCount = 0;
    answeredCount = 0;
    // show the rule card on the first question as a primer
    show("lesson");
    $("lessonHearts").textContent = state.hearts;
    renderQuestion(true);
  }

  function renderQuestion(showPrimer) {
    selected = -1;
    locked = false;
    const q = lesson.questions[qIndex];

    $("lessonProgressFill").style.width = `${(qIndex / lesson.questions.length) * 100}%`;
    $("lessonPrompt").textContent = "Select the correct answer";

    const card = $("lessonCard");
    if (showPrimer) {
      card.classList.add("show");
      card.innerHTML =
        `<span class="lc-ico">${lesson.icon}</span> <b>${esc(lesson.rule.heading)}</b>`;
    } else {
      card.classList.remove("show");
    }

    $("lessonQuestion").textContent = q.q;

    const opts = $("lessonOptions");
    opts.innerHTML = "";
    q.options.forEach((text, i) => {
      const b = document.createElement("button");
      b.className = "option";
      b.textContent = text;
      b.addEventListener("click", () => selectOption(i));
      opts.appendChild(b);
    });

    // reset dock
    const dock = $("dock");
    dock.classList.remove("right", "wrong");
    $("dockMsg").innerHTML = "";
    const check = $("checkBtn");
    check.textContent = "CHECK";
    check.disabled = true;
    check.onclick = checkAnswer;
  }

  function selectOption(i) {
    if (locked) return;
    selected = i;
    [...$("lessonOptions").children].forEach((el, idx) =>
      el.classList.toggle("selected", idx === i)
    );
    $("checkBtn").disabled = false;
  }

  function checkAnswer() {
    if (locked || selected < 0) return;
    locked = true;
    answeredCount++;
    const q = lesson.questions[qIndex];
    const right = selected === q.answer;
    const opts = [...$("lessonOptions").children];
    opts.forEach((el, idx) => {
      el.disabled = true;
      el.classList.remove("selected");
      if (idx === q.answer) el.classList.add("correct");
      else if (idx === selected) el.classList.add("wrong");
    });

    const dock = $("dock");
    const msg = $("dockMsg");
    const check = $("checkBtn");

    if (right) {
      correctCount++;
      dock.classList.add("right");
      msg.innerHTML = `<b>Nice! 🎉</b>${esc(q.explain)}`;
    } else {
      state.hearts = Math.max(0, state.hearts - 1);
      state.heartsAt = Date.now();
      save();
      $("lessonHearts").textContent = state.hearts;
      renderStats();
      dock.classList.add("wrong");
      msg.innerHTML = `<b>Not quite</b>${esc(q.explain)}`;
      pulse($("lessonHearts"));
    }

    const last = qIndex + 1 >= lesson.questions.length;
    check.textContent = last ? "FINISH" : "CONTINUE";
    check.disabled = false;
    check.onclick = () => {
      if (state.hearts <= 0 && !right) {
        return failLesson();
      }
      if (last) return finishLesson();
      qIndex++;
      renderQuestion(false);
    };
  }

  function finishLesson() {
    $("lessonProgressFill").style.width = "100%";
    const accuracy = Math.round((correctCount / lesson.questions.length) * 100);
    const earned = correctCount * XP_PER_CORRECT + (accuracy === 100 ? 5 : 0);
    state.xp += earned;
    const prevBest = state.completed[lesson.id] || 0;
    state.completed[lesson.id] = Math.max(prevBest, accuracy);
    save();
    renderStats();

    $("completeXp").textContent = "+" + earned;
    $("completeAcc").textContent = accuracy + "%";
    show("complete");
    fireConfetti();
  }

  function failLesson() {
    show("failed");
  }

  /* ---------------- Navigation buttons ---------------- */
  $("lessonQuit").addEventListener("click", () => {
    if (answeredCount === 0 || confirm("Quit this lesson? Progress in it will be lost.")) {
      goHome();
    }
  });
  $("completeContinue").addEventListener("click", goHome);
  $("failedContinue").addEventListener("click", goHome);

  function goHome() {
    renderStats();
    renderPath();
    show("home");
  }

  /* ---------------- FX helpers ---------------- */
  function fireConfetti() {
    const box = $("confetti");
    box.innerHTML = "";
    const colors = ["#58cc02", "#1cb0f6", "#ffc800", "#ce82ff", "#ff4b4b"];
    for (let i = 0; i < 40; i++) {
      const bit = document.createElement("i");
      bit.style.left = Math.random() * 100 + "%";
      bit.style.background = colors[i % colors.length];
      bit.style.animationDelay = Math.random() * 0.6 + "s";
      bit.style.transform = `translateY(0) rotate(${Math.random() * 360}deg)`;
      box.appendChild(bit);
    }
  }
  function pulse(el) {
    el.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.4)" }, { transform: "scale(1)" }],
      { duration: 320 }
    );
  }

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  /* ---------------- Boot ---------------- */
  renderStats();
  renderPath();
  renderGuide();
})();
