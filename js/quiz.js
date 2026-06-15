import { QUESTIONS } from "./questions.js";
import { db } from "./firebase.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const playerId = localStorage.getItem("playerId");

let qIndex = 0;
let score = 0;
let time = 50;
let selected = null;
let interval;

const qEl = document.getElementById("q");
const aEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const resultEl = document.getElementById("result");

function renderQuestion() {
  selected = null;
  time = 50;

  const q = QUESTIONS[qIndex];

  qEl.textContent = q.q;
  aEl.innerHTML = "";
  resultEl.innerHTML = "";

  // ответы
  q.a.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.textContent = text;

    btn.onclick = () => {
      selected = i;

      document.querySelectorAll("#answers button").forEach(b => {
        b.classList.remove("selected");
      });

      btn.classList.add("selected");

      document.getElementById("confirmBtn").disabled = false;
    };

    aEl.appendChild(btn);
  });

  document.getElementById("confirmBtn").disabled = true;

  startTimer();
}

function startTimer() {
  clearInterval(interval);

  timerEl.textContent = time;

  interval = setInterval(() => {
    time--;
    timerEl.textContent = time;

    if (time <= 0) {
      clearInterval(interval);
      autoSubmit();
    }
  }, 1000);
}

function autoSubmit() {
  submitAnswer();
}

function submitAnswer() {
  const q = QUESTIONS[qIndex];

  if (selected === q.correct) {
    score++;
  }

  resultEl.innerHTML =
    "Правильный ответ: " + q.a[q.correct];

  setTimeout(nextQuestion, 2500);
}

function nextQuestion() {
  qIndex++;

  if (qIndex >= QUESTIONS.length) return finish();

  renderQuestion();
}

async function finish() {
  await updateDoc(doc(db, "players", playerId), {
    score
  });

  localStorage.setItem("finalScore", score);
  location.href = "result.html";
}

/* кнопка */
window.confirmAnswer = submitAnswer;

renderQuestion();
