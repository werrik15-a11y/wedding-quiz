let answered = false;

function startTimer() {
  time = 50;
  timerEl.textContent = time;

  interval = setInterval(() => {
    time--;
    timerEl.textContent = time;

    if (time <= 0) {
      clearInterval(interval);
      lockQuestion();
    }
  }, 1000);
}

function selectAnswer(i) {
  if (answered) return;

  answered = true;

  QUESTIONS[qIndex].selected = i;

  // фиксируем ответ сразу в Firebase (не ждём конца)
  if (i === QUESTIONS[qIndex].correct) {
    score++;
  }

  showCorrectAnswer();

  setTimeout(() => {
    nextQuestion();
  }, 3000);
}

function lockQuestion() {
  if (!answered) {
    answered = true;
    showCorrectAnswer();

    setTimeout(() => {
      nextQuestion();
    }, 3000);
  }
}

function nextQuestion() {
  qIndex++;
  answered = false;

  if (qIndex >= QUESTIONS.length) return finish();

  showQuestion();
}
