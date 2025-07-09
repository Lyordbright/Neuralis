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
 

// Firebase config
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

const historyEl = document.getElementById("history-container");

let currentUser;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User UID:", user.uid);
    const userDocRef = doc(DB, "user", user.uid); 
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      console.log("No user profile found.");
      return;
    }

    currentUser = userSnapshot.data();
    console.log("User data:", currentUser);

    // ✅ Get subcollection under "user/{uid}/appointments"
    const appointmentsRef = collection(DB, "user", user.uid, "appointments");
    const appointmentSnap = await getDocs(appointmentsRef);

    historyEl.innerHTML = "";

    if (appointmentSnap.empty) {
      historyEl.textContent = `No appointments found.`;
      return;
    }

    appointmentSnap.forEach((doc) => {
      const appt = doc.data();
      historyEl.innerHTML += `
        <div class="appointment-card">
          <p><strong>Doctors Name:</strong><br>${appt.doctorName}</p>
          <p><strong>Patient Name:</strong><br>${appt.patientName}</p>
          <p><strong>Date:</strong><br>${appt.date}</p>
          <p><strong>Time:</strong><br>${appt.time}</p>
          <p><strong>Gender:</strong><br>${appt.gender}</p>
          <p><strong>Reason:</strong><br>${appt.reason}</p>
          <div class="btn-container">
          <button class="delete-btn">Cancel</button>
          <button class="update-btn">Update</button>
          </div>
        </div><br>
      `;
    });

  } else {
    console.log("No user is signed in.");
    // window.location.href = "../pages/signin.html";
  }
});

































//   const firebaseConfig = {
//     apiKey: "AIzaSyBrQFNipW61jkC6zZp-vSQ3dq8p59QTHb4",
//     authDomain: "auralis-30f77.firebaseapp.com",
//     projectId: "auralis-30f77",
//     storageBucket: "auralis-30f77.firebasestorage.app",
//     messagingSenderId: "534550869579",
//     appId: "1:534550869579:web:31f98ebff69d25e50e3fce"
//   };
  
//   const app = initializeApp(firebaseConfig);
//   const auth = getAuth(app);
//   const DB = getFirestore(app);
//   const userColRef = collection(DB, "user", "appointments");
//   const historyEl = document.getElementById("history-container");


//    let currentUser;
//     onAuthStateChanged(auth, async (user) =>{
//       if(user){
//         console.log(user.uid)
//         const docRef = doc(appointmentColRef, user.uid)
//         const userCredential = await getDoc(docRef);
//         currentUser = userCredential.data();
//         console.log(currentUser);
//         // greetingEl.textContent = `Welcome, ${currentUser.name || "User"}!`; 
//         historyEl.innerHTML = ``;
//           } else{
//             console.log("No user is signed in.");
//             window.location.href = "../pages/signin.html";
//           }
//       })