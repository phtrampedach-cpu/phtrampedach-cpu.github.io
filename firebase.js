const firebaseConfig = {
  apiKey: "AIzaSyBQBoHOBENQHP20J7pv1kkEs2gTd7r_flg",
  authDomain: "trampestips.firebaseapp.com",
  projectId: "trampestips",
  storageBucket: "trampestips.firebasestorage.app",
  messagingSenderId: "759235788489",
  appId: "1:759235788489:web:9515bc438a7c7d68469718",
  measurementId: "G-B6YTNFRJPS"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Tilføj services
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();// til login
const analytics = firebase.analytics(app);  // IKKE getAnalytics()
const db = firebase.firestore(); // til gæt og point

let selectedTournament = localStorage.getItem("selectedTournament") || "VM2026";

