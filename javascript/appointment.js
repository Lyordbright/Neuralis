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
});


// firebase

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";


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

let currentUserData;
let currentUserUID; // store UID separately

// DOM Elements
const bookButtonEl = document.getElementById("bookAppointment");
const patientNameEl = document.getElementById("patient-name");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const reasonEl = document.getElementById("reason");
const genderEl = document.getElementById("gender");
const doctorEl = document.getElementById("doctors-name");

// Auth listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserUID = user.uid; // save UID
    const docRef = doc(DB, "user", user.uid); // fix: no need for userColRef
    const userCredential = await getDoc(docRef);
    currentUserData = userCredential.data(); // store user profile data
    console.log("Current user data:", currentUserData);
  } else {
    console.log("No user is signed in");
    currentUserData = null;
    currentUserUID = null;
    window.location.href = "../pages/signin.html"; // optionally redirect
  }
});

// Book appointment function
const bookAppointment = async () => {
  console.log("Booking appointment...");
  bookButtonEl.disabled = true;
  bookButtonEl.textContent = "Booking...";

  if (!currentUserUID) {
    alert("User not authenticated.");
    return;
  }

  const appointmentData = {
    userId: currentUserUID,
    patientName: patientNameEl.value,
    date: dateEl.value,
    time: timeEl.value,
    reason: reasonEl.value,
    gender: genderEl.value,
    doctorName: doctorEl.value,
    // status: "pending",
    // createdAt: new Date()
  };

  try {
    const appointmentColRef = collection(DB, "user", currentUserUID, "appointments");
    const docSnapShot = await addDoc(appointmentColRef, appointmentData);
    console.log("Appointment booked successfully:", docSnapShot.id);
    Swal.fire({
      text: "You Have Booked an Appointment Successfully",
      icon: "success",
   })
   setTimeout(() => {
      location.href = `../pages/appoinment.html?id=${currentUserUID}`;
     }, 3000);
   
  } catch (error) {
    console.error("Error booking appointment:", error);
    alert("Error booking appointment. Please try again.");
  } finally {
    bookButtonEl.textContent = "Book Appointment";
    bookButtonEl.disabled = false;
  }
};

bookButtonEl.addEventListener("click", (e) => {
  e.preventDefault();
  bookAppointment();
});
