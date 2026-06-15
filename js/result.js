const score = localStorage.getItem("finalScore");

document.getElementById("score").textContent = score + " / 7";

if (score >= 5) {
  confetti({
    particleCount: 200,
    spread: 90,
    origin: { y: 0.6 }
  });
}
