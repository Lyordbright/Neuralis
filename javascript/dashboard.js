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
  