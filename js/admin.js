import { db } from "./firebase.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const podium = document.getElementById("podium");
const tbody = document.getElementById("tableBody");

const rowMap = new Map();

const q = query(
  collection(db, "players"),
  orderBy("score", "desc"),
  orderBy("createdAt", "asc")
);

onSnapshot(q, (snap) => {

  const players = [];

  snap.forEach(doc => {
    players.push({
      id: doc.id,
      ...doc.data()
    });
  });

  renderPodium(players);
  renderRanking(players);
});

function renderPodium(players) {

  const first = players[0];
  const second = players[1];
  const third = players[2];

  podium.innerHTML = `
    <div class="podium-place second">
      <div class="place-medal">🥈</div>
      <div class="place-name">${second?.name || "-"}</div>
      <div class="place-score">${second?.score || 0} баллов</div>
      <div class="place-rank">2 место</div>
    </div>

    <div class="podium-place first">
      <div class="place-medal">👑</div>
      <div class="place-name">${first?.name || "-"}</div>
      <div class="place-score">${first?.score || 0} баллов</div>
      <div class="place-rank">Победитель</div>
    </div>

    <div class="podium-place third">
      <div class="place-medal">🥉</div>
      <div class="place-name">${third?.name || "-"}</div>
      <div class="place-score">${third?.score || 0} баллов</div>
      <div class="place-rank">3 место</div>
    </div>
  `;
}

function renderRanking(players) {

  const visiblePlayers = players.slice(3, 15);

  const oldPositions = new Map();

  Array.from(tbody.children).forEach(row => {
    oldPositions.set(
      row.dataset.id,
      row.getBoundingClientRect().top
    );
  });

const visibleIds = new Set(
  visiblePlayers.map(p => p.id)
);

Array.from(tbody.children).forEach(row => {

  if (!visibleIds.has(row.dataset.id)) {

    rowMap.delete(row.dataset.id);

    row.remove();
  }

});
  
  visiblePlayers.forEach((player, index) => {

    const realPlace =
  players.findIndex(p => p.id === player.id) + 1;

    let row = rowMap.get(player.id);

    if (!row) {

      row = document.createElement("tr");

      row.dataset.id = player.id;

      row.innerHTML = `
        <td></td>
        <td></td>
        <td></td>
      `;

      rowMap.set(player.id, row);
    }

    row.children[0].textContent = realPlace;
    row.children[1].textContent = player.name;
    row.children[2].textContent = player.score;

    tbody.appendChild(row);
  });

  requestAnimationFrame(() => {

    Array.from(tbody.children).forEach(row => {

      const oldTop = oldPositions.get(row.dataset.id);

      if (!oldTop) return;

      const newTop =
        row.getBoundingClientRect().top;

      const delta = oldTop - newTop;

      if (Math.abs(delta) > 1) {

        row.style.transition = "none";

        row.style.transform =
          `translateY(${delta}px)`;

        row.offsetHeight;

        row.style.transition =
          "transform .8s ease";

        row.style.transform =
          "translateY(0px)";

        row.classList.add("rank-moved");

        setTimeout(() => {
          row.classList.remove("rank-moved");
        }, 800);
      }
    });
  });
}
