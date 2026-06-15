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

  let html = "<tr><th>Имя</th><th>Баллы</th></tr>";

  let i = 0;

  snap.forEach(doc => {
    if (i < 10) {
      const d = doc.data();
      html += `<tr><td>${d.name}</td><td>${d.score}</td></tr>`;
      i++;
    }
  });

  table.innerHTML = html;
});