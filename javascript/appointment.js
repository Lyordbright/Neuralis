// ---------------------- SEARCH FUNCTION ----------------------
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector("input[type='search']");
  const doctorCards = document.querySelectorAll(".doc-con .card");

  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase().trim();

    doctorCards.forEach(card => {
      const name = card.querySelector(".card-title").textContent.toLowerCase();
      const specialty = card.querySelector(".card-text").textContent.toLowerCase();
      const matches = name.includes(searchValue) || specialty.includes(searchValue);
      card.style.display = matches ? "block" : "none";
    });
  });

  // ---------------------- PREFILL DOCTOR NAME ----------------------
  const modal = document.getElementById("exampleModal");
  modal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const card = button.closest(".card");
    const doctorName = card.querySelector(".card-title").textContent;

    const inputDoctor = document.getElementById("doctors-name");
    inputDoctor.value = doctorName;
  });
});


// ---------------------- FIREBASE SETUP ----------------------
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrQFNipW61jkC6zZp-vSQ3dq8p59QTHb4",
  authDomain: "auralis-30f77.firebaseapp.com",
  projectId: "auralis-30f77",
  storageBucket: "auralis-30f77.appspot.com",
  messagingSenderId: "534550869579",
  appId: "1:534550869579:web:31f98ebff69d25e50e3fce"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const DB = getFirestore(app);

let currentUserUID = null;
let currentUserData = null;

// ---------------------- AUTH CHECK ----------------------
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserUID = user.uid;
    const userDoc = await getDoc(doc(DB, "user", currentUserUID));
    currentUserData = userDoc.data();
    // console.log("Authenticated as:", currentUserData?.name || "User");
  } else {
    window.location.href = "../pages/signin.html";
  }
});

// ---------------------- BOOK APPOINTMENT ----------------------
const bookBtn = document.getElementById("bookAppointment");
bookBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const patientName = document.getElementById("patient-name").value.trim();
  const doctorName = document.getElementById("doctors-name").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const reason = document.getElementById("reason").value.trim();
  const gender = document.getElementById("gender").value;

  if (!patientName || !doctorName || !date || !time || !reason || gender === "gender") {
    Swal.fire("Error", "All fields are required.", "error");
    return;
  }

  const appointmentData = {
    userId: currentUserUID,
    patientName,
    doctorName,
    date,
    time,
    reason,
    gender
  };

  try {
    bookBtn.disabled = true;
    bookBtn.textContent = "Booking...";

    const appointmentRef = collection(DB, "user", currentUserUID, "appointments");
    await addDoc(appointmentRef, appointmentData);

    Swal.fire("Success", "Appointment booked successfully!", "success");

    setTimeout(() => {
      location.href = "./appoinment.html";
    }, 2000);
  } catch (error) {
    // console.error("Booking failed:", error);
    Swal.fire("Error", "Something went wrong. Try again.", "error");
  } finally {
    bookBtn.disabled = false;
    bookBtn.textContent = "Book";
  }
});

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
