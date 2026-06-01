/* Massachusetts Traffic Rules — UI logic. Pure vanilla JS, no build step. */
(function () {
  "use strict";

  /* ---------- Tab navigation ---------- */
  const tabs = document.querySelectorAll(".tab");
  const views = {
    rules: document.getElementById("view-rules"),
    quiz: document.getElementById("view-quiz"),
    about: document.getElementById("view-about"),
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      Object.values(views).forEach((v) => v.classList.remove("is-active"));
      views[tab.dataset.view].classList.add("is-active");
    });
  });

  /* ---------- Rules: rendering, search & filter ---------- */
  const listEl = document.getElementById("rulesList");
  const searchEl = document.getElementById("search");
  const filtersEl = document.getElementById("categoryFilters");
  const countEl = document.getElementById("resultCount");
  const noResultsEl = document.getElementById("noResults");

  let activeCategory = "All";

  const categories = ["All", ...new Set(RULES.map((r) => r.category))];

  categories.forEach((cat) => {
    const chip = document.createElement("button");
    chip.className = "chip" + (cat === "All" ? " is-active" : "");
    chip.textContent = cat;
    chip.addEventListener("click", () => {
      activeCategory = cat;
      filtersEl
        .querySelectorAll(".chip")
        .forEach((c) => c.classList.toggle("is-active", c.textContent === cat));
      render();
    });
    filtersEl.appendChild(chip);
  });

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function matches(rule, term) {
    if (!term) return true;
    const haystack = (
      rule.title +
      " " +
      rule.summary +
      " " +
      rule.category +
      " " +
      rule.details.join(" ") +
      " " +
      rule.tags.join(" ")
    ).toLowerCase();
    return term
      .toLowerCase()
      .split(/\s+/)
      .every((word) => haystack.includes(word));
  }

  function render() {
    const term = searchEl.value.trim();
    const filtered = RULES.filter(
      (r) =>
        (activeCategory === "All" || r.category === activeCategory) &&
        matches(r, term)
    );

    listEl.innerHTML = "";
    noResultsEl.hidden = filtered.length !== 0;
    countEl.textContent = filtered.length
      ? `${filtered.length} rule${filtered.length > 1 ? "s" : ""} shown`
      : "";

    filtered.forEach((rule) => {
      const card = document.createElement("article");
      card.className = "rule-card";
      card.innerHTML = `
        <div class="rule-head" role="button" tabindex="0" aria-expanded="false">
          <span class="rule-icon" aria-hidden="true">${rule.icon}</span>
          <div class="rule-headtext">
            <div class="rule-cat">${escapeHtml(rule.category)}</div>
            <h3 class="rule-title">${escapeHtml(rule.title)}</h3>
            <p class="rule-summary">${escapeHtml(rule.summary)}</p>
          </div>
          <span class="rule-toggle" aria-hidden="true">▾</span>
        </div>
        <div class="rule-body">
          <ul>${rule.details.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul>
          <span class="rule-ref">${escapeHtml(rule.reference)}</span>
        </div>`;

      const head = card.querySelector(".rule-head");
      const toggle = () => {
        const open = card.classList.toggle("is-open");
        head.setAttribute("aria-expanded", String(open));
      };
      head.addEventListener("click", toggle);
      head.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
      listEl.appendChild(card);
    });
  }

  searchEl.addEventListener("input", render);
  render();

  /* ---------- Quiz ---------- */
  const quizIntro = document.getElementById("quizIntro");
  const quizActive = document.getElementById("quizActive");
  const quizResult = document.getElementById("quizResult");
  const questionText = document.getElementById("questionText");
  const answerOptions = document.getElementById("answerOptions");
  const feedback = document.getElementById("feedback");
  const nextBtn = document.getElementById("nextQuestion");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const scoreText = document.getElementById("scoreText");
  const scoreMessage = document.getElementById("scoreMessage");

  document.getElementById("quizTotal").textContent = QUIZ.length;

  let order = [];
  let current = 0;
  let score = 0;
  let answered = false;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startQuiz() {
    order = shuffle(QUIZ.map((_, i) => i));
    current = 0;
    score = 0;
    quizIntro.hidden = true;
    quizResult.hidden = true;
    quizActive.hidden = false;
    showQuestion();
  }

  function showQuestion() {
    answered = false;
    feedback.hidden = true;
    nextBtn.hidden = true;
    const item = QUIZ[order[current]];

    progressFill.style.width = `${(current / QUIZ.length) * 100}%`;
    progressText.textContent = `Question ${current + 1} of ${QUIZ.length}`;
    questionText.textContent = item.q;

    answerOptions.innerHTML = "";
    item.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.textContent = opt;
      btn.addEventListener("click", () => selectAnswer(idx, item, btn));
      answerOptions.appendChild(btn);
    });
  }

  function selectAnswer(idx, item, btn) {
    if (answered) return;
    answered = true;
    const buttons = answerOptions.querySelectorAll(".answer-btn");
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === item.answer) b.classList.add("correct");
    });

    if (idx === item.answer) {
      score++;
      feedback.className = "feedback right";
      feedback.textContent = "✓ Correct! " + item.explain;
    } else {
      btn.classList.add("wrong");
      feedback.className = "feedback wrong";
      feedback.textContent = "✗ Not quite. " + item.explain;
    }
    feedback.hidden = false;
    nextBtn.hidden = false;
    nextBtn.textContent = current + 1 < QUIZ.length ? "Next →" : "See results →";
  }

  function nextQuestion() {
    current++;
    if (current < QUIZ.length) {
      showQuestion();
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    quizActive.hidden = true;
    quizResult.hidden = false;
    const pct = Math.round((score / QUIZ.length) * 100);
    scoreText.textContent = `${score} / ${QUIZ.length}  (${pct}%)`;
    if (pct >= 90) {
      scoreMessage.textContent = "🏆 Excellent! You know the rules of the road.";
    } else if (pct >= 70) {
      scoreMessage.textContent = "✅ You passed! That's above the 70% RMV threshold.";
    } else {
      scoreMessage.textContent =
        "📚 Keep studying — review the Rules tab and try again.";
    }
  }

  document.getElementById("startQuiz").addEventListener("click", startQuiz);
  document.getElementById("retakeQuiz").addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", nextQuestion);
})();
