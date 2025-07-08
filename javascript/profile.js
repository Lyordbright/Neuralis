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


   let currentUser;
    onAuthStateChanged(auth, async (user) =>{
      if(user){
        console.log(user.uid)
        const docRef = doc(userColRef, user.uid)
        const userCredential = await getDoc(docRef);
        currentUser = userCredential.data();
        console.log(currentUser);
        // greetingEl.textContent = `Welcome, ${currentUser.name || "User"}!`; 
        userInfoEl.innerHTML = `
         <h1>Profile</h1> <br>
         <div>
             <h2 style="">Name:</h2>
              <h4>${currentUser.name}</h4>
              <br>
           <div>
           <h2>Email:</h2>
           <h4>${currentUser.email}</h4>
            </div><br>
            <div>
             <h2>Phone Number:</h2>
             <h4>${currentUser.phone}</h4>
            </div><br>
            <div>
            <h2>Age:</h2>
              <h4>${currentUser.age}</h4>
            </div><br>
            <div>
               <h2>Gender:</h2>
               <h4>${currentUser.gender}</h4>
               </div><br>
               <div>
              <h2>Allergies:</h2> 
              <h4>${currentUser.allergies}</h4>  
            </div><br>
            <div>
              <h2>Address:</h2> 
              <h4>${currentUser.address}</h4>  
            </div><br>
            <div>
            <h2>Emergency Contact Name:</h2>    
            <h4>${currentUser.emmergencyContact}</h4>
            </div><br>
            <div>
            <h2>Emergency Contact Number:</h2>
            <h4>${currentUser.emergencyNumber}</h4>
            </div>`;
          } else{
            console.log("No user is signed in.");
            window.location.href = "../pages/signin.html";
          }
      })