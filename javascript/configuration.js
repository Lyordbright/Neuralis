  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBrQFNipW61jkC6zZp-vSQ3dq8p59QTHb4",
    authDomain: "auralis-30f77.firebaseapp.com",
    projectId: "auralis-30f77",
    storageBucket: "auralis-30f77.firebasestorage.app",
    messagingSenderId: "534550869579",
    appId: "1:534550869579:web:31f98ebff69d25e50e3fce"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
   export{
     app
   }