import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.start = async function () {
  const name = document.getElementById("name").value;

  if (!name) return alert("Введите имя");

  const doc = await addDoc(collection(db, "players"), {
    name,
    score: 0,
    current: 0,
    createdAt: Date.now()
  });

  localStorage.setItem("playerId", doc.id);

  location.href = "quiz.html";
};