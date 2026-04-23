// ================================================
// Firebase config — solo lectura de estaciones
// ================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDrqyqMF_d6Bu7ZSxk81OdexLim961QQ-s",
  authDomain: "paraguas-gemaj-leb-tora.firebaseapp.com",
  projectId: "paraguas-gemaj-leb-tora",
  storageBucket: "paraguas-gemaj-leb-tora.firebasestorage.app",
  messagingSenderId: "318676974922",
  appId: "1:318676974922:web:362adccf363c6dab2a95b3"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
