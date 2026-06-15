import { QUESTIONS } from "./questions.js";
import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const playerId = localStorage.getItem("playerId");

let qIndex = 0;
let score = 0;
let time = 50;
let interval;

const qEl = document.getElementById("q");
const aEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const resultEl = document.getElementById("result");

async function load() {
  showQuestion();
}

function showQuestion() {
  if (qIndex >= QUESTIONS.length) return finish();

  const q = QUESTIONS[qIndex];

  qEl.textContent = q.q;
  aEl.innerHTML = "";
  resultEl.innerHTML = "";
  time = 50;

  q.a.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.textContent = text;

    btn.onclick = () => select(i);
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

function select(i) {
  QUESTIONS[qIndex].selected = i;
}

function showAnswer() {
  const q = QUESTIONS[qIndex];

  if (q.selected === q.correct) {
    score++;
  }

  resultEl.innerHTML =
    "Правильный ответ: " + q.a[q.correct];

  setTimeout(() => {
    qIndex++;
    showQuestion();
  }, 5000);
}

async function finish() {
  const ref = doc(db, "players", playerId);
  await updateDoc(ref, {
    score
  });

  localStorage.setItem("finalScore", score);
  location.href = "result.html";
}

load();