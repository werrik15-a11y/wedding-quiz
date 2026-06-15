// js/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ⬇️ ВСТАВЬ СЮДА СВОЙ CONFIG
  const firebaseConfig = {
    apiKey: "AIzaSyBiOUjMBs1B6_jvYFrGnDmLbgTJWAgskp4",
    authDomain: "wedding-site-4ee49.firebaseapp.com",
    projectId: "wedding-site-4ee49",
    storageBucket: "wedding-site-4ee49.firebasestorage.app",
    messagingSenderId: "689680959339",
    appId: "1:689680959339:web:1498226953352f73c5ae2e"
  };

// инициализация
const app = initializeApp(firebaseConfig);

// экспорт базы
export const db = getFirestore(app);