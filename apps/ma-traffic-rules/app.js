/* RoadReady MA — app engine. Vanilla JS, no build, fully offline. */
(function () {
  "use strict";

  /* ============================ STATE ============================ */
  const SAVE_KEY = "roadready_ma_v2";
  const MAX_HEARTS = 5;
  const XP_PER_CORRECT = 10;
  const DAILY_GOAL = 40;
  const EXAM_SIZE = 25;
  const EXAM_PASS = 18;
  const EXAM_SECONDS = 25 * 60;

  const fresh = () => ({
    xp: 0, streak: 1, hearts: MAX_HEARTS, heartsAt: Date.now(),
    completed: {}, mistakes: [], examBest: null, examCount: 0, examPassed: false,
    dailyXp: 0, dailyKey: todayKey(), lastDay: todayKey(), achievements: [],
    settings: { dark: null, sound: true, haptics: true },
  });

  function todayKey() { return new Date().toISOString().slice(0, 10); }

  function load() {
    let s;
    try { s = { ...fresh(), ...JSON.parse(localStorage.getItem(SAVE_KEY) || "{}") }; }
    catch (e) { s = fresh(); }
    s.settings = { ...fresh().settings, ...(s.settings || {}) };
    // heart refill: +1 / 30 min
    if (s.hearts < MAX_HEARTS) {
      const g = Math.floor((Date.now() - (s.heartsAt || 0)) / 18e5);
      if (g > 0) { s.hearts = Math.min(MAX_HEARTS, s.hearts + g); s.heartsAt = Date.now(); }
    }
    const t = todayKey();
    if (s.lastDay !== t) {
      const diff = Math.round((new Date(t) - new Date(s.lastDay)) / 864e5);
      s.streak = diff === 1 ? s.streak + 1 : 1;
      s.lastDay = t;
    }
    if (s.dailyKey !== t) { s.dailyKey = t; s.dailyXp = 0; }
    return s;
  }
  let state = load();
  function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {} }

  /* ============================ HELPERS ============================ */
  const $ = (id) => document.getElementById(id);
  function esc(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // flatten lessons
  const allLessons = [];
  UNITS.forEach((u, ui) => u.lessons.forEach((l) => allLessons.push({ ...l, unitIndex: ui, color: u.color })));
  const lessonById = Object.fromEntries(allLessons.map((l) => [l.id, l]));
  const signById = Object.fromEntries(SIGNS.map((s) => [s.id, s]));

  function isUnlocked(id) { const i = allLessons.findIndex((l) => l.id === id); return i === 0 || !!state.completed[allLessons[i - 1].id]; }
  function firstIncompleteId() { const l = allLessons.find((x) => !state.completed[x.id]); return l ? l.id : allLessons[0].id; }

  function addMistake(q) {
    if (state.mistakes.some((m) => m.q === q.q)) return;
    state.mistakes.push({ q: q.q, options: q.options, answer: q.answer, explain: q.explain, figure: q.figure || null });
    if (state.mistakes.length > 60) state.mistakes.shift();
  }
  function removeMistake(q) { state.mistakes = state.mistakes.filter((m) => m.q !== q.q); }

  function addXp(n) {
    state.xp += n; state.dailyXp += n; save();
    renderStats(); renderGoalRing();
  }

  /* ============================ ACHIEVEMENTS ============================ */
  const unitsAllDone = () => UNITS.some((u) => u.lessons.every((l) => state.completed[l.id]));
  const ACHIEVEMENTS = [
    { id: "first", icon: "🚦", title: "First Lesson", desc: "Complete your first lesson", test: (s) => Object.keys(s.completed).length >= 1 },
    { id: "unit", icon: "🏅", title: "Unit Master", desc: "Finish every lesson in a unit", test: () => unitsAllDone() },
    { id: "grad", icon: "🎓", title: "Graduate", desc: "Complete all lessons", test: (s) => Object.keys(s.completed).length >= allLessons.length },
    { id: "pass", icon: "🏆", title: "Licensed!", desc: "Pass the exam simulator", test: (s) => s.examPassed },
    { id: "perfect", icon: "💯", title: "Perfect Score", desc: "Score 25/25 on the exam", test: (s) => s.examBest === EXAM_SIZE },
    { id: "streak3", icon: "🔥", title: "On Fire", desc: "Reach a 3-day streak", test: (s) => s.streak >= 3 },
    { id: "signpro", icon: "🛑", title: "Sign Pro", desc: "Ace a road-sign quiz", test: (s, e) => e.type === "signquiz" && e.acc === 100 },
    { id: "xp500", icon: "⭐", title: "XP Hunter", desc: "Earn 500 total XP", test: (s) => s.xp >= 500 },
    { id: "fixer", icon: "🎯", title: "Comeback", desc: "Finish a mistake-review session", test: (s, e) => e.type === "review" },
  ];
  function awardAchievements(ev) {
    ev = ev || {};
    const newly = [];
    ACHIEVEMENTS.forEach((a) => {
      if (state.achievements.includes(a.id)) return;
      try { if (a.test(state, ev)) { state.achievements.push(a.id); newly.push(a); } } catch (e) {}
    });
    if (newly.length) { save(); newly.forEach((a, i) => setTimeout(() => toast(a), i * 650)); }
  }
  function toast(a) {
    const w = $("toastWrap"); if (!w) return;
    const t = document.createElement("div"); t.className = "toast";
    t.innerHTML = `<span class="t-ico">${a.icon}</span><div class="t-body"><b>Achievement unlocked!</b><span>${esc(a.title)}</span></div>`;
    w.appendChild(t); beep(true); buzz(40);
    setTimeout(() => t.remove(), 3900);
  }

  /* ============================ FEEDBACK FX ============================ */
  let audioCtx = null;
  function beep(ok) {
    if (!state.settings.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.type = "sine";
      const now = audioCtx.currentTime;
      if (ok) { o.frequency.setValueAtTime(660, now); o.frequency.setValueAtTime(880, now + 0.09); }
      else { o.frequency.setValueAtTime(200, now); o.frequency.setValueAtTime(150, now + 0.1); }
      g.gain.setValueAtTime(0.15, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      o.start(now); o.stop(now + 0.24);
    } catch (e) {}
  }
  function buzz(ms) { if (state.settings.haptics && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {} }

  /* ============================ THEME ============================ */
  function applyTheme() {
    const dark = state.settings.dark == null
      ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      : state.settings.dark;
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    const sd = $("setDark"); if (sd) sd.checked = dark;
  }

  /* ============================ TABS ============================ */
  function switchTab(name) {
    document.querySelectorAll(".tab-screen").forEach((s) => s.classList.toggle("is-active", s.id === "tab-" + name));
    document.querySelectorAll(".tabbtn").forEach((b) => b.classList.toggle("is-active", b.dataset.tab === name));
    if (name === "profile") renderProfile();
    if (name === "exam") renderExamTab();
    if (name === "learn") renderPath();
    window.scrollTo(0, 0);
  }
  document.querySelectorAll(".tabbtn").forEach((b) => b.addEventListener("click", () => switchTab(b.dataset.tab)));

  /* ============================ STATS / GOAL ============================ */
  function renderStats() { $("statStreak").textContent = state.streak; $("statXp").textContent = state.xp; }
  function renderGoalRing() {
    const pct = Math.min(100, Math.round((state.dailyXp / DAILY_GOAL) * 100));
    const ring = $("goalRing"); if (ring) ring.style.setProperty("--goal", pct + "%");
    const gt = $("goalText");
    if (gt) gt.textContent = state.dailyXp >= DAILY_GOAL ? "🎯 Daily goal complete!" : `Daily goal · ${state.dailyXp}/${DAILY_GOAL} XP`;
  }

  /* ============================ LEARN: path + guide ============================ */
  const offsets = ["", "off-r", "off-rr", "off-r", "", "off-l", "off-ll", "off-l"];
  function renderPath() {
    const path = $("path"); path.innerHTML = "";
    const startId = firstIncompleteId(); let n = 0;
    UNITS.forEach((unit) => {
      const b = document.createElement("div");
      b.className = "unit-banner unit-" + unit.color;
      b.innerHTML = `<h2>${esc(unit.title)}</h2><p>${esc(unit.subtitle)}</p>`;
      path.appendChild(b);
      const trail = document.createElement("div"); trail.className = "trail";
      unit.lessons.forEach((lesson) => {
        const row = document.createElement("div"); row.className = "node-row " + offsets[n++ % offsets.length];
        const done = !!state.completed[lesson.id], unlocked = isUnlocked(lesson.id), start = lesson.id === startId;
        const btn = document.createElement("button");
        btn.className = "node " + (done ? "node-done" : unlocked || start ? "node-current" : "node-locked");
        btn.setAttribute("aria-label", lesson.title + (unlocked ? "" : " (locked)"));
        btn.innerHTML = `<span class="node-face">${done ? "✓" : unlocked ? lesson.icon : "🔒"}</span>` +
          (done ? `<span class="node-badge">⭐</span>` : "") + `<span class="node-label">${esc(lesson.title)}</span>`;
        if (unlocked) btn.addEventListener("click", () => startLesson(lesson.id));
        else btn.addEventListener("click", () => btn.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 250 }));
        row.appendChild(btn); trail.appendChild(row);
      });
      path.appendChild(trail);
    });
  }
  function renderGuide() {
    const g = $("guideGrid"); g.innerHTML = "";
    allLessons.forEach((l) => {
      const c = document.createElement("button"); c.className = "guide-card";
      c.innerHTML = `<span class="gc-ico">${l.icon}</span><span class="gc-title">${esc(l.title)}</span><span class="gc-ref">${esc(l.rule.ref)}</span>`;
      c.addEventListener("click", () => openRuleModal(l));
      g.appendChild(c);
    });
  }
  function openRuleModal(lesson) {
    $("modalIco").textContent = lesson.icon;
    $("modalTitle").textContent = lesson.rule.heading;
    $("modalFigure").innerHTML = "";
    $("modalPoints").innerHTML = lesson.rule.points.map((p) => `<li>${esc(p)}</li>`).join("");
    $("modalRef").textContent = lesson.rule.ref;
    $("modal").hidden = false;
  }

  /* ============================ ROAD SIGNS ============================ */
  function signSVG(s) {
    const c = s.color, fg = s.fg || "#222";
    const sw = c.toLowerCase() === "#fff" || c.toLowerCase() === "#ffffff" ? "#222" : "#fff";
    let shape = "";
    switch (s.shape) {
      case "octagon": shape = `<polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="${c}" stroke="#fff" stroke-width="4"/>`; break;
      case "triangle": shape = `<polygon points="50,92 5,12 95,12" fill="${c}" stroke="#fff" stroke-width="5"/>`; break;
      case "circle": shape = `<circle cx="50" cy="50" r="46" fill="${c}" stroke="#fff" stroke-width="4"/>`; break;
      case "diamond": shape = `<polygon points="50,3 97,50 50,97 3,50" fill="${c}" stroke="#fff" stroke-width="4"/>`; break;
      case "pentagon": shape = `<polygon points="50,3 94,37 76,96 24,96 6,37" fill="${c}" stroke="#fff" stroke-width="4"/>`; break;
      default: shape = `<rect x="6" y="12" width="88" height="76" rx="8" fill="${c}" stroke="${sw}" stroke-width="4"/>`;
    }
    return `<svg viewBox="0 0 100 100" role="img" aria-label="${esc(s.name)}">${shape}${signInner(s, fg)}</svg>`;
  }
  function signText(str, fg, baseY) {
    const lines = String(str).split("\n");
    const size = lines.length > 1 ? 15 : (str.length > 4 ? 17 : 22);
    const startY = (baseY || 50) - (lines.length - 1) * 9;
    return `<text x="50" text-anchor="middle" dominant-baseline="middle" fill="${fg}" font-family="Nunito,Arial" font-weight="900" font-size="${size}">` +
      lines.map((l, i) => `<tspan x="50" y="${startY + i * 18}">${esc(l)}</tspan>`).join("") + `</text>`;
  }
  function signInner(s, fg) {
    if (s.text) return signText(s.text, fg, s.shape === "triangle" ? 42 : 50);
    switch (s.glyph) {
      case "bar": return `<rect x="22" y="42" width="56" height="15" rx="4" fill="#fff"/>`;
      case "arrow": return `<g fill="#fff"><rect x="20" y="34" width="42" height="12" rx="2"/><polygon points="58,28 82,40 58,52"/></g>` + signText("ONE WAY", "#fff", 70).replace('font-size="22"', 'font-size="11"');
      case "nouturn": return `<g fill="none" stroke="#222" stroke-width="7" stroke-linecap="round"><path d="M36 64 V44 a14 14 0 0 1 28 0 V60"/></g><polygon points="64,72 56,56 72,56" fill="#222"/><line x1="18" y1="20" x2="82" y2="80" stroke="#e3262e" stroke-width="8" stroke-linecap="round"/>`;
      case "rxr": return `<g stroke="#222" stroke-width="7" stroke-linecap="round"><line x1="22" y1="22" x2="78" y2="78"/><line x1="78" y1="22" x2="22" y2="78"/></g><text x="33" y="62" font-size="20" font-weight="900" fill="#222" font-family="Nunito,Arial">R</text><text x="55" y="46" font-size="20" font-weight="900" fill="#222" font-family="Nunito,Arial">R</text>`;
      case "merge": return `<g fill="none" stroke="#222" stroke-width="8" stroke-linecap="round"><path d="M40 90 V52"/><path d="M66 86 C66 66 44 66 42 58"/></g><polygon points="40,40 32,56 48,56" fill="#222"/>`;
      case "noparking": return `<text x="50" y="52" text-anchor="middle" dominant-baseline="middle" font-size="46" font-weight="900" fill="#222" font-family="Nunito,Arial">P</text><circle cx="50" cy="50" r="34" fill="none" stroke="#e3262e" stroke-width="7"/><line x1="26" y1="26" x2="74" y2="74" stroke="#e3262e" stroke-width="7" stroke-linecap="round"/>`;
      default: return `<text x="50" y="52" text-anchor="middle" dominant-baseline="middle" font-size="44">${s.glyph || "?"}</text>`;
    }
  }
  function renderSigns() {
    const box = $("signsContainer"); box.innerHTML = "";
    ["Regulatory", "Warning", "Guide"].forEach((cat) => {
      const list = SIGNS.filter((s) => s.cat === cat); if (!list.length) return;
      const h = document.createElement("div"); h.className = "sign-cat-title"; h.textContent = cat + " signs";
      box.appendChild(h);
      const grid = document.createElement("div"); grid.className = "signs-grid";
      list.forEach((s) => {
        const cell = document.createElement("button"); cell.className = "sign-cell";
        cell.innerHTML = `<span class="sign-art">${signSVG(s)}</span><span class="sign-name">${esc(s.name)}</span>`;
        cell.addEventListener("click", () => openSignModal(s));
        grid.appendChild(cell);
      });
      box.appendChild(grid);
    });
  }
  function openSignModal(s) {
    $("modalIco").textContent = "🛑";
    $("modalTitle").textContent = s.name;
    $("modalFigure").innerHTML = signSVG(s);
    $("modalPoints").innerHTML = `<li>${esc(s.meaning)}</li>`;
    $("modalRef").textContent = s.cat + " sign";
    $("modal").hidden = false;
  }
  $("modalClose").addEventListener("click", () => ($("modal").hidden = true));
  $("modal").addEventListener("click", (e) => { if (e.target.id === "modal") $("modal").hidden = true; });

  /* ============================ EXAM tab ============================ */
  function renderExamTab() {
    $("examBest").textContent = state.examBest == null ? "—" : state.examBest + "/" + EXAM_SIZE;
    $("examCount").textContent = state.examCount;
    $("examStatus").textContent = state.examCount === 0 ? "—" : state.examPassed ? "PASS ✅" : "TRY AGAIN";
    const rev = $("reviewMistakes");
    if (state.mistakes.length) { rev.hidden = false; $("reviewCount").textContent = state.mistakes.length + " question" + (state.mistakes.length > 1 ? "s" : "") + " to review"; }
    else rev.hidden = true;
  }
  $("startExam").addEventListener("click", startExam);
  $("reviewMistakes").addEventListener("click", () => {
    if (!state.mistakes.length) return;
    runQuiz({ mode: "review", questions: shuffle(state.mistakes).slice(0, 20), title: "Mistake review" });
  });

  function examPool() {
    const pool = [];
    UNITS.forEach((u) => u.lessons.forEach((l) => l.questions.forEach((q) => pool.push(q))));
    EXTRA_QUESTIONS.forEach((q) => pool.push(q));
    return pool;
  }
  function startExam() {
    const qs = shuffle(examPool()).slice(0, EXAM_SIZE);
    runQuiz({ mode: "exam", questions: qs, title: "Exam Simulator" });
  }
  $("startPractice").addEventListener("click", () => {
    const qs = shuffle(examPool()).slice(0, 10);
    runQuiz({ mode: "practice", questions: qs, title: "Quick Practice" });
  });

  /* ============================ SIGN QUIZ ============================ */
  $("startSignQuiz").addEventListener("click", () => {
    const picks = shuffle(SIGNS).slice(0, 10);
    const qs = picks.map((s) => {
      const distract = shuffle(SIGNS.filter((x) => x.id !== s.id)).slice(0, 3).map((x) => x.name);
      const options = shuffle([s.name, ...distract]);
      return { q: "What is this sign?", options, answer: options.indexOf(s.name), explain: s.meaning, figure: s.id };
    });
    runQuiz({ mode: "signquiz", questions: qs, title: "Road sign quiz" });
  });

  /* ============================ QUIZ ENGINE ============================ */
  const ov = $("overlay-quiz");
  let Q = null; // active run

  function runQuiz(cfg) {
    Q = { ...cfg, idx: 0, correct: 0, record: [], selected: -1, phase: "answer", timer: null, left: EXAM_SECONDS };
    document.querySelectorAll(".overlay").forEach((o) => o.classList.remove("is-active"));
    ov.classList.add("is-active");
    if (cfg.mode === "exam") startTimer();
    renderQ();
  }
  function immediate() { return Q.mode !== "exam"; }

  function startTimer() {
    updateTimer();
    Q.timer = setInterval(() => {
      Q.left--; updateTimer();
      if (Q.left <= 0) { clearInterval(Q.timer); finishQuiz(); }
    }, 1000);
  }
  function updateTimer() {
    const m = Math.floor(Q.left / 60), s = Q.left % 60;
    const el = $("quizMeta");
    el.textContent = "⏱ " + m + ":" + String(s).padStart(2, "0");
    el.classList.toggle("warn", Q.left <= 60);
  }

  function renderQ() {
    Q.selected = -1; Q.phase = "answer";
    const q = Q.questions[Q.idx];
    $("quizProgressFill").style.width = `${(Q.idx / Q.questions.length) * 100}%`;
    $("quizPrompt").textContent = Q.mode === "signquiz" ? "What does this sign mean?" : "Select the correct answer";

    if (Q.mode === "exam") updateTimer();
    else { const m = $("quizMeta"); m.classList.remove("warn"); m.innerHTML = `❤️ <span>${state.hearts}</span>`; }

    const fig = $("quizFigure");
    if (q.figure && signById[q.figure]) { fig.innerHTML = signSVG(signById[q.figure]); fig.style.display = "flex"; }
    else { fig.innerHTML = ""; fig.style.display = "none"; }

    $("quizQuestion").textContent = q.q;
    const opts = $("quizOptions"); opts.innerHTML = "";
    q.options.forEach((t, i) => {
      const b = document.createElement("button"); b.className = "option"; b.textContent = t;
      b.addEventListener("click", () => selectOpt(i)); opts.appendChild(b);
    });

    const dock = $("dock"); dock.classList.remove("right", "wrong"); $("dockMsg").innerHTML = "";
    const c = $("checkBtn");
    c.textContent = immediate() ? "CHECK" : (Q.idx + 1 >= Q.questions.length ? "FINISH" : "CONTINUE");
    c.disabled = true; c.onclick = primary;
  }

  function selectOpt(i) {
    if (Q.phase !== "answer") return;
    Q.selected = i;
    [...$("quizOptions").children].forEach((el, idx) => el.classList.toggle("selected", idx === i));
    $("checkBtn").disabled = false;
  }

  function primary() {
    const q = Q.questions[Q.idx];
    if (Q.selected < 0) return;

    if (!immediate()) { // EXAM: record, advance, no feedback
      const right = Q.selected === q.answer;
      if (right) Q.correct++; else addMistake(q);
      Q.record.push({ q, selected: Q.selected });
      save();
      return advance();
    }

    if (Q.phase === "answer") { // reveal
      Q.phase = "feedback";
      const right = Q.selected === q.answer;
      [...$("quizOptions").children].forEach((el, idx) => {
        el.disabled = true; el.classList.remove("selected");
        if (idx === q.answer) el.classList.add("correct");
        else if (idx === Q.selected) el.classList.add("wrong");
      });
      const dock = $("dock"), msg = $("dockMsg"), c = $("checkBtn");
      if (right) {
        Q.correct++; beep(true); buzz(20);
        dock.classList.add("right"); msg.innerHTML = `<b>Nice! 🎉</b>${esc(q.explain)}`;
        if (Q.mode === "review") removeMistake(q);
      } else {
        beep(false); buzz([40, 40, 40]);
        if (Q.mode !== "review") addMistake(q);
        if (Q.mode === "lesson") { state.hearts = Math.max(0, state.hearts - 1); state.heartsAt = Date.now(); $("quizMeta").innerHTML = `❤️ <span>${state.hearts}</span>`; }
        dock.classList.add("wrong"); msg.innerHTML = `<b>Not quite</b>${esc(q.explain)}`;
      }
      save();
      c.textContent = Q.idx + 1 >= Q.questions.length ? "FINISH" : "CONTINUE";
      return;
    }
    // feedback -> advance (or fail if hearts gone)
    if (Q.mode === "lesson" && state.hearts <= 0 && Q.selected !== q.answer) return failLesson();
    advance();
  }

  function advance() {
    if (Q.idx + 1 >= Q.questions.length) return finishQuiz();
    Q.idx++; renderQ();
  }

  function failLesson() { if (Q.timer) clearInterval(Q.timer); showResult("fail-hearts"); }

  function finishQuiz() {
    if (Q.timer) clearInterval(Q.timer);
    $("quizProgressFill").style.width = "100%";

    if (Q.mode === "exam") {
      state.examCount++;
      const passed = Q.correct >= EXAM_PASS;
      if (state.examBest == null || Q.correct > state.examBest) state.examBest = Q.correct;
      if (passed) state.examPassed = true;
      addXp(Q.correct * 4);
      save();
      awardAchievements({ type: "exam", score: Q.correct });
      return showResult(passed ? "exam-pass" : "exam-fail");
    }

    if (Q.mode === "lesson") {
      const acc = Math.round((Q.correct / Q.questions.length) * 100);
      const earned = Q.correct * XP_PER_CORRECT + (acc === 100 ? 5 : 0);
      addXp(earned);
      state.completed[Q.lessonId] = Math.max(state.completed[Q.lessonId] || 0, acc);
      save();
      awardAchievements({ type: "lesson", acc });
      return showResult("lesson", { acc, earned });
    }
    // practice / review / signquiz
    const acc = Math.round((Q.correct / Q.questions.length) * 100);
    addXp(Q.correct * 5); save();
    awardAchievements({ type: Q.mode, acc });
    showResult(Q.mode, { acc });
  }

  /* ============================ RESULT ============================ */
  function startLesson(id) {
    const lesson = lessonById[id];
    const qs = lesson.questions.map((q) => ({ ...q }));
    runQuiz({ mode: "lesson", lessonId: id, questions: qs, title: lesson.title });
  }

  function showResult(kind, data) {
    data = data || {};
    document.querySelectorAll(".overlay").forEach((o) => o.classList.remove("is-active"));
    $("overlay-result").classList.add("is-active");
    const emoji = $("resultEmoji"), title = $("resultTitle"), sub = $("resultSub"),
      badges = $("resultBadges"), review = $("resultReview");
    review.hidden = true;
    let confetti = false;

    if (kind === "lesson") {
      emoji.textContent = "🎉"; title.textContent = "Lesson complete!"; title.style.color = "var(--gold-d)";
      sub.textContent = "Great work — keep the streak going.";
      badges.innerHTML = badge("b-gold", "TOTAL XP", "+" + data.earned) + badge("b-blue", "ACCURACY", data.acc + "%");
      confetti = true;
    } else if (kind === "signquiz" || kind === "review" || kind === "practice") {
      emoji.textContent = data.acc >= 80 ? "🌟" : "💪";
      title.textContent = kind === "review" ? "Review done!" : kind === "practice" ? "Practice complete!" : "Quiz complete!";
      title.style.color = "var(--blue-d)";
      sub.textContent = kind === "review" ? "Nice — fewer mistakes to go." : kind === "practice" ? "Keep practicing to lock it in." : "Sign mastery is climbing.";
      badges.innerHTML = badge("b-blue", "ACCURACY", data.acc + "%") + badge("b-green", "CORRECT", Q.correct + "/" + Q.questions.length);
      review.hidden = false;
      confetti = data.acc >= 80;
    } else if (kind === "exam-pass") {
      emoji.textContent = "🏆"; title.textContent = "You passed!"; title.style.color = "var(--green-d)";
      sub.textContent = `You scored ${Q.correct}/${EXAM_SIZE} — above the 18 needed.`;
      badges.innerHTML = badge("b-green", "SCORE", Q.correct + "/" + EXAM_SIZE) + badge("b-gold", "RESULT", "PASS");
      review.hidden = false; confetti = true;
    } else if (kind === "exam-fail") {
      emoji.textContent = "📚"; title.textContent = "Almost there"; title.style.color = "var(--red-d)";
      sub.textContent = `You scored ${Q.correct}/${EXAM_SIZE}. You need 18 to pass — review and retry.`;
      badges.innerHTML = badge("b-red", "SCORE", Q.correct + "/" + EXAM_SIZE) + badge("b-blue", "NEED", EXAM_PASS + "/" + EXAM_SIZE);
      review.hidden = false;
    } else if (kind === "fail-hearts") {
      emoji.textContent = "💔"; title.textContent = "Out of hearts"; title.style.color = "var(--red-d)";
      sub.textContent = "Hearts refill over time. Take a breather and try again.";
      badges.innerHTML = "";
    }

    review.onclick = () => openReview(Q.record);
    if (confetti) fireConfetti(); else $("confetti").innerHTML = "";
  }
  function badge(cls, label, val) { return `<div class="badge ${cls}"><span class="badge-label">${label}</span><span class="badge-value">${esc(val)}</span></div>`; }

  function openReview(record) {
    const list = $("reviewList"); list.innerHTML = "";
    record.forEach((r, i) => {
      const right = r.selected === r.q.answer;
      const item = document.createElement("div"); item.className = "review-q";
      item.innerHTML = `<div class="rq-q">${i + 1}. ${esc(r.q.q)}</div>` +
        (right ? `<div class="rq-a rq-ok">✓ ${esc(r.q.options[r.q.answer])}</div>`
               : `<div class="rq-a rq-no">✗ Your answer: ${esc(r.q.options[r.selected])}</div><div class="rq-a rq-ok">✓ Correct: ${esc(r.q.options[r.q.answer])}</div>`) +
        `<div class="rq-ex">${esc(r.q.explain)}</div>`;
      list.appendChild(item);
    });
    $("reviewModal").hidden = false;
  }
  $("reviewClose").addEventListener("click", () => ($("reviewModal").hidden = true));
  $("reviewModal").addEventListener("click", (e) => { if (e.target.id === "reviewModal") $("reviewModal").hidden = true; });

  $("resultContinue").addEventListener("click", exitOverlays);
  $("quizQuit").addEventListener("click", () => {
    if (!Q || Q.idx === 0 || confirm("Quit now? Progress in this round is lost.")) { if (Q && Q.timer) clearInterval(Q.timer); exitOverlays(); }
  });
  function exitOverlays() {
    document.querySelectorAll(".overlay").forEach((o) => o.classList.remove("is-active"));
    renderStats(); renderGoalRing(); renderPath(); renderExamTab();
    if ($("tab-profile").classList.contains("is-active")) renderProfile();
  }

  function fireConfetti() {
    const box = $("confetti"); box.innerHTML = "";
    const colors = ["#58cc02", "#1cb0f6", "#ffc800", "#ce82ff", "#ff4b4b"];
    for (let i = 0; i < 44; i++) {
      const b = document.createElement("i");
      b.style.left = Math.random() * 100 + "%"; b.style.background = colors[i % colors.length];
      b.style.animationDelay = Math.random() * 0.6 + "s";
      b.style.transform = `rotate(${Math.random() * 360}deg)`;
      box.appendChild(b);
    }
  }

  /* ============================ PROFILE ============================ */
  function renderProfile() {
    $("kpiStreak").textContent = state.streak;
    $("kpiXp").textContent = state.xp;
    $("kpiLessons").textContent = Object.keys(state.completed).length + "/" + allLessons.length;
    $("kpiExam").textContent = state.examBest == null ? "—" : state.examBest + "/" + EXAM_SIZE;
    renderGoalRing();

    const ml = $("masteryList"); ml.innerHTML = "";
    UNITS.forEach((u) => {
      const total = u.lessons.length, done = u.lessons.filter((l) => state.completed[l.id]).length;
      const pct = Math.round((done / total) * 100);
      const colorVar = { green: "--green", blue: "--blue", purple: "--purple", gold: "--gold" }[u.color];
      const item = document.createElement("div"); item.className = "mastery-item";
      item.innerHTML = `<div class="mi-top"><span>${esc(u.title.replace(/^Unit \d+ · /, ""))}</span><span>${pct}%</span></div>` +
        `<div class="mastery-bar"><div class="mastery-fill" style="width:${pct}%;background:var(${colorVar})"></div></div>`;
      ml.appendChild(item);
    });

    const ag = $("achievementsGrid"); ag.innerHTML = "";
    ACHIEVEMENTS.forEach((a) => {
      const un = state.achievements.includes(a.id);
      const d = document.createElement("div"); d.className = "ach " + (un ? "unlocked" : "locked");
      d.title = a.desc;
      d.innerHTML = `<span class="ach-ico">${a.icon}</span><span class="ach-title">${esc(a.title)}</span>`;
      ag.appendChild(d);
    });
    $("achCount").textContent = state.achievements.length + "/" + ACHIEVEMENTS.length;

    $("setSound").checked = state.settings.sound;
    $("setHaptics").checked = state.settings.haptics;
    applyTheme();
  }

  /* ============================ PWA: install + offline ============================ */
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); deferredPrompt = e;
    const b = $("installBtn"); if (b) b.hidden = false;
  });
  const installBtn = $("installBtn");
  if (installBtn) installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try { await deferredPrompt.userChoice; } catch (e) {}
    deferredPrompt = null; installBtn.hidden = true;
  });
  window.addEventListener("appinstalled", () => { if (installBtn) installBtn.hidden = true; });
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
  $("setDark").addEventListener("change", (e) => { state.settings.dark = e.target.checked; save(); applyTheme(); });
  $("setSound").addEventListener("change", (e) => { state.settings.sound = e.target.checked; save(); if (e.target.checked) beep(true); });
  $("setHaptics").addEventListener("change", (e) => { state.settings.haptics = e.target.checked; save(); if (e.target.checked) buzz(30); });
  $("resetBtn").addEventListener("click", () => {
    if (confirm("Reset ALL progress, XP, and streak? This cannot be undone.")) {
      const keepDark = state.settings.dark;
      state = fresh(); state.settings.dark = keepDark; save();
      renderStats(); renderGoalRing(); renderPath(); renderExamTab(); renderProfile();
    }
  });

  /* ============================ BOOT ============================ */
  applyTheme(); renderStats(); renderGoalRing(); renderPath(); renderGuide(); renderSigns();
  awardAchievements({ type: "boot" });
})();
