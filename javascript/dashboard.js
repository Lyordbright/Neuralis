import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
 import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDocs,
    getDoc,
    deleteDoc,
    updateDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
 
  const firebaseConfig = {
    apiKey: "AIzaSyBrQFNipW61jkC6zZp-vSQ3dq8p59QTHb4",
    authDomain: "auralis-30f77.firebaseapp.com",
    projectId: "auralis-30f77",
    storageBucket: "auralis-30f77.firebasestorage.app",
    messagingSenderId: "534550869579",
    appId: "1:534550869579:web:31f98ebff69d25e50e3fce"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const DB = getFirestore(app);
  const userColRef = collection(DB, "user")
  const greetingEl = document.getElementById("greeting");
  const userInfoEl = document.getElementById("user-info");
  

  // console.log("User is signed in:", user);
  // greetingEl.textContent = `Welcome, ${user.name}!`;

  const now = new Date();
  const hour = now.getHours();

  let timeGreeting;

  if (hour >= 5 && hour < 12) {
   timeGreeting = "Good morning";
  } else if (hour >= 12 && hour < 16) {
   timeGreeting = "Good afternoon";
  } else if (hour >= 16 && hour < 20) {
   timeGreeting = "Good evening";
  } else {
   timeGreeting = "Good night"; 
 }




  let currentUser;
  onAuthStateChanged(auth, async (user) =>{
    if(user){
      console.log(user.uid)
      const docRef = doc(userColRef, user.uid)
      const userCredential = await getDoc(docRef);
      currentUser = userCredential.data();
      console.log(currentUser);
      greetingEl.innerHTML = `<h1>${timeGreeting}, ${currentUser.name || "User"}!</h1>`; 
    }else{
      console.log("No user is signed in.");
      window.location.href = "../pages/signin.html";
    }
  })


// DOM Elements
const upcomingEl = document.getElementById("upcoming-appointments");
const totalEl = document.getElementById("total-appointments");
const completedEl = document.getElementById("completed-appointments");
const pendingEl = document.getElementById("pending-appointments");
const reminderEl = document.getElementById("health-reminder");


onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDocRef = doc(DB, "user", user.uid);
    const userSnapshot = await getDoc(userDocRef);
    currentUser = userSnapshot.data();
    showGreeting(currentUser.name || "User");
    loadAppointments(user.uid);
  } else {
    window.location.href = "../pages/signin.html";
  }
});

// Show dynamic greeting
function showGreeting(name) {
  const hour = new Date().getHours();
  let timeGreeting = "Hello";

  if (hour >= 5 && hour < 12) timeGreeting = "Good morning";
  else if (hour >= 12 && hour < 17) timeGreeting = "Good afternoon";
  else if (hour >= 17 && hour < 21) timeGreeting = "Good evening";
  else timeGreeting = "Good night";

  greetingEl.innerHTML = `<h2>${timeGreeting}, ${name}!</h2>`;
}

// Load appointment data
async function loadAppointments(uid) {
  const appointmentsRef = collection(DB, "user", uid, "appointments");
  const snap = await getDocs(appointmentsRef);

  let total = 0, completed = 0, pending = 0;
  let count = 0;

  upcomingEl.innerHTML = `No upcoming appointments found.`;

  snap.forEach(doc => {
    const data = doc.data();
    total++;

    if (data.status === "completed") completed++;
    else pending++;

    if (count < 3) {
      upcomingEl.innerHTML += `
        <div class="col-md-4">
          <div class="card shadow-sm p-3">
            <h5>${data.doctorName || "Unknown Doctor"}</h5>
            <p><strong>Patient:</strong> ${data.patientName}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Status:</strong> ${data.status || "Pending"}</p>
          </div>
        </div>
      `;
      count++;
    }
  });

  totalEl.textContent = total;
  completedEl.textContent = completed;
  pendingEl.textContent = pending;
}

// Random health tips
const tips = [
  "💧 Drink 8 glasses of water daily.",
  "🧘 Take 10 minutes today to breathe and relax.",
  "🍎 Eat at least 2 servings of fruits.",
  "🏃 Walk for 30 minutes to stay active.",
  "🛌 Aim for 7-9 hours of sleep tonight.",
  "📵 Reduce screen time before bed for better rest."
];

const randomTip = tips[Math.floor(Math.random() * tips.length)];
reminderEl.textContent = randomTip;






// === DARK/LIGHT MODE TOGGLE ===
const themeToggleBtn = document.getElementById("theme-toggle");
const body = document.body;

// Load saved preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark-mode");
  themeToggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i> Light`;
}

// Toggle theme
themeToggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const isDark = body.classList.contains("dark-mode");

  themeToggleBtn.innerHTML = isDark
    ? `<i class="fa-solid fa-sun"></i> Light`
    : `<i class="fa-solid fa-moon"></i> Dark`;

  localStorage.setItem("theme", isDark ? "dark" : "light");
});
