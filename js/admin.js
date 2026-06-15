import { db } from "./firebase.js";
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const q = query(collection(db, "players"), orderBy("score", "desc"));

let prev = {};
let chart;

onSnapshot(q, (snap) => {
  const table = document.getElementById("table");

  let html = `
    <tr><th>#</th><th>Имя</th><th>Баллы</th></tr>
  `;

  let i = 1;
  const players = [];

  snap.forEach(doc => {
    const d = doc.data();
    players.push(d);

    let cls = "";
    if (d.score > (prev[d.name] || 0)) cls = "up";
    if (d.score < (prev[d.name] || 0)) cls = "down";
    prev[d.name] = d.score;

    html += `
      <tr class="${cls}">
        <td>${i}</td>
        <td>${d.name}</td>
        <td>${d.score}</td>
      </tr>
    `;

    i++;
  });

  table.innerHTML = html;

  renderChart(players);
});

function renderChart(players) {
  const ctx = document.getElementById("chart");

  const map = {};

  players.forEach(p => {
    map[p.score] = (map[p.score] || 0) + 1;
  });

  const labels = Object.keys(map);
  const data = Object.values(map);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Распределение баллов",
        data
      }]
    }
  });
}
