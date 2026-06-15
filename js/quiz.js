import { QUESTIONS } from "./questions.js";
import { db } from "./firebase.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const playerId = localStorage.getItem("playerId");

let qIndex = 0;
let score = 0;
let time = 50;
let answered = false;
let interval;

const qEl = document.getElementById("q");
const aEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const resultEl = document.getElementById("result");

function animateChange(cb) {
  const box = document.querySelector(".container");
  box.classList.add("fade-out");

  setTimeout(() => {
    cb();
    box.classList.remove("fade-out");
    box.classList.add("fade-in");
  }, 300);
}

function startQuestion() {
  answered = false;
  time = 50;
  timerEl.textContent = time;
  resultEl.innerHTML = "";

  const q = QUESTIONS[qIndex];

  qEl.textContent = q.q;
  aEl.innerHTML = "";

  q.a.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.textContent = text;

    btn.onclick = () => select(i, btn);

    aEl.appendChild(btn);
  });

  clearInterval(interval);

  interval = setInterval(() => {
    time--;
    timerEl.textContent = time;

    if (time <= 0) {
      clearInterval(interval);
      showAnswer();
    }
  }, 1000);
}

function select(i, btn) {
  if (answered) return;

  answered = true;
  const q = QUESTIONS[qIndex];

  q.selected = i;

  document.querySelectorAll("#answers button").forEach(b => {
    b.classList.add("disabled");
  });

  btn.classList.add("selected");

  if (i === q.correct) score++;
}

function showAnswer() {
  const q = QUESTIONS[qIndex];

  resultEl.innerHTML = "Правильный ответ: " + q.a[q.correct];

  setTimeout(() => {
    animateChange(() => {
      qIndex++;

      if (qIndex >= QUESTIONS.length) return finish();

      startQuestion();
    });
  }, 3000);
}

async function finish() {
  await updateDoc(doc(db, "players", playerId), {
    score
  });

  localStorage.setItem("finalScore", score);
  location.href = "result.html";
}

startQuestion();
