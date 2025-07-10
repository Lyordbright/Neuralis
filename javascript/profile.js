import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrQFNipW61jkC6zZp-vSQ3dq8p59QTHb4",
  authDomain: "auralis-30f77.firebaseapp.com",
  projectId: "auralis-30f77",
  storageBucket: "auralis-30f77.firebasestorage.app",
  messagingSenderId: "534550869579",
  appId: "1:534550869579:web:31f98ebff69d25e50e3fce"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const DB = getFirestore(app);
const userColRef = collection(DB, "user");

// DOM Elements
const greetingEl = document.getElementById("greeting");
const userInfoEl = document.getElementById("user-info");
const form = document.getElementById("editProfileForm");

// Auth State
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(userColRef, user.uid);
    const userSnap = await getDoc(docRef);

    if (!userSnap.exists()) {
      alert("User profile not found.");
      return;
    }

    const currentUser = userSnap.data();
    console.log("Loaded user:", currentUser);

    // Greeting
    greetingEl.innerHTML = `<h2 class="fw-bold">Welcome, ${currentUser.name || "User"}!</h2>`;

    // Display Profile Info
    userInfoEl.innerHTML = `
      <h3 class="text-center mb-4">Profile Details</h3>
      <div class="row g-3">
        <div class="col-md-6"><strong>Name:</strong><p>${currentUser.name}</p></div>
        <div class="col-md-6"><strong>Email:</strong><p>${currentUser.email}</p></div>
        <div class="col-md-6"><strong>Phone Number:</strong><p>${currentUser.phone}</p></div>
        <div class="col-md-6"><strong>Age:</strong><p>${currentUser.age}</p></div>
        <div class="col-md-6"><strong>Gender:</strong><p>${currentUser.gender}</p></div>
        <div class="col-md-6"><strong>Allergies:</strong><p>${currentUser.allergies}</p></div>
        <div class="col-md-6"><strong>Address:</strong><p>${currentUser.address}</p></div>
        <div class="col-md-6"><strong>Emergency Contact Name:</strong><p>${currentUser.emmergencyContact}</p></div>
        <div class="col-md-6"><strong>Emergency Contact Number:</strong><p>${currentUser.emergencyNumber}</p></div>
      </div>
    `;

    // Pre-fill form inputs
    document.getElementById("editName").value = currentUser.name || "";
    document.getElementById("editEmail").value = currentUser.email || "";
    document.getElementById("editPhone").value = currentUser.phone || "";
    document.getElementById("editAge").value = currentUser.age || "";
    document.getElementById("editGender").value = currentUser.gender || "";
    document.getElementById("editAllergies").value = currentUser.allergies || "";
    document.getElementById("editAddress").value = currentUser.address || "";
    document.getElementById("editEmergencyName").value = currentUser.emmergencyContact || "";
    document.getElementById("editEmergencyNumber").value = currentUser.emergencyNumber || "";
  } else {
    console.log("User not signed in");
    window.location.href = "../pages/signin.html";
  }
});

// Handle Form Submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedData = {
    name: document.getElementById("editName").value,
    email: document.getElementById("editEmail").value,
    phone: document.getElementById("editPhone").value,
    age: document.getElementById("editAge").value,
    gender: document.getElementById("editGender").value,
    allergies: document.getElementById("editAllergies").value,
    address: document.getElementById("editAddress").value,
    emmergencyContact: document.getElementById("editEmergencyName").value,
    emergencyNumber: document.getElementById("editEmergencyNumber").value,
  };

  try {
    const userRef = doc(userColRef, auth.currentUser.uid);
    await updateDoc(userRef, updatedData);
     Swal.fire({
      text: "Profile Updated Successfully",
      icon: "success",
   })
   setTimeout(() => {
     location.reload();
     }, 3000);
  } catch (error) {
    console.error("Failed to update profile:", error);
    alert("An error occurred while updating your profile.");
  }
});
