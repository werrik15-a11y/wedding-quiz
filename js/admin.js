import { db } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.enableAutoAnimate();

const q = query(
  collection(db, "players"),
  orderBy("score", "desc")
);

onSnapshot(q, (snap) => {

  const players = [];

  snap.forEach(doc => {
    players.push(doc.data());
  });

  renderPodium(players);
  renderTable(players);
});

function renderPodium(players) {

  const podium = document.getElementById("podium");

  const first = players[0];
  const second = players[1];
  const third = players[2];

  podium.innerHTML = `
    <div class="podium-place second">
      <div class="place-number">🥈</div>
      <div class="place-name">${second?.name || "-"}</div>
      <div class="place-score">${second?.score || 0} баллов</div>
    </div>

    <div class="podium-place first">
      <div class="place-number">🥇</div>
      <div class="place-name">${first?.name || "-"}</div>
      <div class="place-score">${first?.score || 0} баллов</div>
    </div>

    <div class="podium-place third">
      <div class="place-number">🥉</div>
      <div class="place-name">${third?.name || "-"}</div>
      <div class="place-score">${third?.score || 0} баллов</div>
    </div>
  `;
}

function renderTable(players) {

  const table = document.getElementById("table");

  let html = `
    <tr>
      <th>Место</th>
      <th>Имя</th>
      <th>Баллы</th>
    </tr>
  `;

  players.slice(3, 10).forEach((p, index) => {

    html += `
      <tr>
        <td>${index + 4}</td>
        <td>${p.name}</td>
        <td>${p.score}</td>
      </tr>
    `;
  });

  table.innerHTML = html;
}
