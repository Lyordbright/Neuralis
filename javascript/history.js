// import {
//   getFirestore,
//   collection,
//   getDocs,
//   deleteDoc,
//   doc,
//   updateDoc
// } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
// import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyBrQFNipW61jkC6zZp-vSQ3dq8p59QTHb4",
//   authDomain: "auralis-30f77.firebaseapp.com",
//   projectId: "auralis-30f77",
//   storageBucket: "auralis-30f77.appspot.com",
//   messagingSenderId: "534550869579",
//   appId: "1:534550869579:web:31f98ebff69d25e50e3fce"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// const historyContainer = document.getElementById("history-container");

// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     const appointmentsRef = collection(db, "user", user.uid, "appointments");
//     const snapshot = await getDocs(appointmentsRef);

//     if (snapshot.empty) {
//       historyContainer.innerHTML = `<p class="text-center">No appointment history found.</p>`;
//       return;
//     }

//     snapshot.forEach(docSnap => {
//       const data = docSnap.data();
//       const card = document.createElement("div");
//       card.className = "card m-3 p-3 shadow";
//       card.style.width = "22rem";
//       card.innerHTML = `
//         <div class="card-body">
//           <h5 class="card-title">${data.doctorName}</h5>
//           <p class="card-text"><strong>Patient:</strong> ${data.patientName}</p>
//           <p class="card-text"><strong>Date:</strong> ${data.date}</p>
//           <p class="card-text"><strong>Time:</strong> ${data.time}</p>
//           <p class="card-text"><strong>Reason:</strong> ${data.reason}</p>
//           <p class="card-text"><strong>Gender:</strong> ${data.gender}</p>
//           <div class="d-flex justify-content-between">
//             <button class="btn btn-warning btn-sm edit-btn" data-id="${docSnap.id}"><i class="fa-solid fa-pen"></i> Edit</button>
//             <button class="btn btn-danger btn-sm cancel-btn" data-id="${docSnap.id}"><i class="fa-solid fa-trash"></i> Cancel</button>
//           </div>
//         </div>
//       `;
//       historyContainer.appendChild(card);
//     });

//     setupCancelButtons(user.uid);
//     setupEditButtons(user.uid);
//   } else {
//     location.href = "../pages/signin.html";
//   }
// });

// function setupCancelButtons(uid) {
//   const cancelButtons = document.querySelectorAll(".cancel-btn");
//   cancelButtons.forEach(btn => {
//     btn.addEventListener("click", async () => {
//       const id = btn.getAttribute("data-id");
//       const confirm = await Swal.fire({
//         title: 'Are you sure?',
//         text: "Do you want to cancel this appointment?",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Yes, cancel it!',
//       });

//       if (confirm.isConfirmed) {
//         await deleteDoc(doc(db, "user", uid, "appointments", id));
//         Swal.fire("Cancelled!", "The appointment has been cancelled.", "success");
//         setTimeout(() => {
//           location.reload();
//         }, 2000);
//       }
//     });
//   });
// }

// function setupEditButtons(uid) {
//   const editButtons = document.querySelectorAll(".edit-btn");
//   editButtons.forEach(btn => {
//     btn.addEventListener("click", async () => {
//       const id = btn.getAttribute("data-id");
//       const appointmentRef = doc(db, "user", uid, "appointments", id);
//       const appointmentSnap = await getDocs(collection(db, "user", uid, "appointments"));
//       const data = (await appointmentSnap.docs.find(d => d.id === id))?.data();

//       const { value: formValues } = await Swal.fire({
//         title: 'Edit Appointment',
//         html: `
//           <input id="swal-input1" class="swal2-input" placeholder="Patient Name" value="${data.patientName}">
//           <input id="swal-input2" class="swal2-input" type="date" value="${data.date}">
//           <input id="swal-input3" class="swal2-input" type="time" value="${data.time}">
//           <input id="swal-input4" class="swal2-input" placeholder="Reason" value="${data.reason}">
//         `,
//         focusConfirm: false,
//         showCancelButton: true,
//         preConfirm: () => {
//           return {
//             patientName: document.getElementById("swal-input1").value,
//             date: document.getElementById("swal-input2").value,
//             time: document.getElementById("swal-input3").value,
//             reason: document.getElementById("swal-input4").value,
//           };
//         }
//       });

//       if (formValues) {
//         await updateDoc(appointmentRef, formValues);
//         Swal.fire("Updated!", "Appointment updated successfully.", "success");
//         setTimeout(() => {
//           location.reload();
//         }, 2000);
//       }
//     });
//   });
// }



































































import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
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
const db = getFirestore(app);

// Containers
const upcomingTab = document.getElementById("upcoming-tab");
const completedTab = document.getElementById("completed-tab");
const cancelledTab = document.getElementById("cancelled-tab");

// Auth state
onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "../pages/signin.html";

  const appointmentsRef = collection(db, "user", user.uid, "appointments");
  const snapshot = await getDocs(appointmentsRef);

  if (snapshot.empty) {
    upcomingTab.innerHTML = `<p class="text-center">No appointments found.</p>`;
    completedTab.innerHTML = "";
    cancelledTab.innerHTML = "";
    return;
  }

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const now = new Date();
    const appointmentDate = new Date(`${data.date}T${data.time}`);
    const status = getStatus(data, appointmentDate, now);

    const card = createAppointmentCard(docSnap.id, data, user.uid, status);

    if (status === "upcoming") {
      upcomingTab.appendChild(card);
    } else if (status === "completed") {
      completedTab.appendChild(card);
    } else {
      cancelledTab.appendChild(card);
    }
  });

  setupCancelButtons(user.uid);
  setupDeleteButtons(user.uid);
  setupEditButtons(user.uid);
});

function getStatus(data, appointmentDate, now) {
  if (data.status === "cancelled") return "cancelled";
  return appointmentDate > now ? "upcoming" : "completed";
}

function createAppointmentCard(id, data, uid, status) {
  const card = document.createElement("div");
  card.className = "card m-3 p-3 shadow";
  card.style.width = "22rem";
  card.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${data.doctorName}</h5>
      <p class="card-text"><strong>Patient:</strong> ${data.patientName}</p>
      <p class="card-text"><strong>Date:</strong> ${data.date}</p>
      <p class="card-text"><strong>Time:</strong> ${data.time}</p>
      <p class="card-text"><strong>Reason:</strong> ${data.reason}</p>
      <p class="card-text"><strong>Gender:</strong> ${data.gender}</p>
      <div class="d-flex justify-content-between">
        ${status === "upcoming" ? `
          <button class="btn btn-warning btn-sm edit-btn" data-id="${id}"><i class="fa-solid fa-pen"></i> Edit</button>
          <button class="btn btn-danger btn-sm cancel-btn" data-id="${id}"><i class="fa-solid fa-xmark"></i> Cancel</button>
        ` : `
          <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${id}"><i class="fa-solid fa-trash"></i> Delete</button>
        `}
      </div>
    </div>
  `;
  return card;
}

function setupCancelButtons(uid) {
  document.querySelectorAll(".cancel-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const confirm = await Swal.fire({
        title: "Cancel Appointment?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, cancel it!"
      });
      if (confirm.isConfirmed) {
        await updateDoc(doc(db, "user", uid, "appointments", id), {
          status: "cancelled"
        });
        Swal.fire("Cancelled!", "Appointment marked as cancelled.", "success");
        location.reload();
      }
    });
  });
}

function setupDeleteButtons(uid) {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const confirm = await Swal.fire({
        title: "Delete Appointment?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
      });
      if (confirm.isConfirmed) {
        await deleteDoc(doc(db, "user", uid, "appointments", id));
        Swal.fire("Deleted!", "Appointment removed.", "success");
        location.reload();
      }
    });
  });
}

function setupEditButtons(uid) {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const appointmentSnap = await getDocs(collection(db, "user", uid, "appointments"));
      const data = (await appointmentSnap.docs.find(d => d.id === id))?.data();

      const { value: formValues } = await Swal.fire({
        title: 'Edit Appointment',
        html: `
          <input id="swal-input1" class="swal2-input" value="${data.patientName}">
          <input id="swal-input2" class="swal2-input" type="date" value="${data.date}">
          <input id="swal-input3" class="swal2-input" type="time" value="${data.time}">
          <input id="swal-input4" class="swal2-input" value="${data.reason}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
          return {
            patientName: document.getElementById("swal-input1").value,
            date: document.getElementById("swal-input2").value,
            time: document.getElementById("swal-input3").value,
            reason: document.getElementById("swal-input4").value,
          };
        }
      });

      if (formValues) {
        await updateDoc(doc(db, "user", uid, "appointments", id), formValues);
        Swal.fire("Updated!", "Appointment updated.", "success");
        // location.reload();
        setTimeout(() => {
         location.href = "./appoinment.html";
        }, 2000);
      }
    });
  });
}






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