import { db } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const q = query(
  collection(db, "players"),
  orderBy("score", "desc")
);

onSnapshot(q, (snap) => {
  const table = document.getElementById("table");

  let html = `
    <tr>
      <th>#</th>
      <th>Имя</th>
      <th>Баллы</th>
    </tr>
  `;

  let i = 1;

  snap.forEach(doc => {
    const d = doc.data();

    if (i <= 10) {
      html += `
        <tr>
          <td>${i}</td>
          <td>${d.name}</td>
          <td>${d.score}</td>
        </tr>
      `;
    }

    i++;
  });

  table.innerHTML = html;
});
