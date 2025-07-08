import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDocs,
    deleteDoc,
    updateDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword,  sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
 
 
  const firebaseConfig = {
    apiKey: "AIzaSyBrQFNipW61jkC6zZp-vSQ3dq8p59QTHb4",
    authDomain: "auralis-30f77.firebaseapp.com",
    projectId: "auralis-30f77",
    storageBucket: "auralis-30f77.firebasestorage.app",
    messagingSenderId: "534550869579",
    appId: "1:534550869579:web:31f98ebff69d25e50e3fce"
  };
  
  const app = initializeApp(firebaseConfig)
  const Auth = getAuth(app)
  const DB = getFirestore(app);
  const userColRef = collection(DB, "user")



    const emailEL = document.getElementById("emailInp")
    const passwordEL = document.getElementById("passwordInp")
  const buttonEl1  = document.getElementById("signup-btn")
  const signupformel = document.getElementById("signUpForm")
  const errorMessageEl = document.getElementById("error-message");
   const handleSignup = async () => {
   buttonEl1 .textContent = "Authenticating...";
  //  buttonEl1 .disabled = true;
  const email = emailEL .value.trim();
  const password = passwordEL.value.trim();
  const nameEl = document.getElementById("fullName");
  const phoneEl = document.getElementById("phoneNumberInp");
  const addressEl = document.getElementById("address");
  const allergiesEl = document.getElementById("allergies");
  const emmergencyContactNameEl = document.getElementById("contactName");
  const emergencyNumberEl = document.getElementById("contactNum");
  const ageEl = document.getElementById("age");
  const genderEl = document.getElementById("gender")

  
  if (!navigator.onLine) {
    errorMessageEl.textContent = "You're offline. Please check your internet connection.";
    errorMessageEl.style.color = "red";
    signupButtonEl.textContent = "Sign up";
    signupButtonEl.disabled = false;
    return;
  }


  if (!email || !password) {
    errorMessageEl.textContent = "All fields are required";
    errorMessageEl.style.color = "red";
    signupButtonEl.textContent = "Sign up";
    signupButtonEl.disabled = false;
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(Auth, email, password);
    const user = userCredential.user;

    if (!user) {
      errorMessageEl.textContent = "User not created.";
      errorMessageEl.style.color = "red";
      return;
    }

    const newUser = {
      id: user.uid,
      email: email,
      name: nameEl.value.trim(),
      phone: phoneEl.value.trim(),
      address: addressEl.value.trim(),
      allergies: allergiesEl.value.trim(),
      emmergencyContact: emmergencyContactNameEl.value.trim(),
      emergencyNumber: emergencyNumberEl.value.trim(),
      age: ageEl.value.trim(),
      gender: genderEl.value.trim(),
    };

    const docRef = doc(userColRef, user.uid);
    await setDoc(docRef, newUser);
    await sendEmailVerification(userCredential.user);
    Swal.fire({
      text: "You Have Signed Up Successfully",
      icon: "success",
   })
    errorMessageEl.textContent = "Signup successful!";
    errorMessageEl.style.color = "blue";
    setTimeout(() => {
      location.href = `../pages/dashboard.html?id=${userCredential.uid}`;
     }, 2000);
    // alert("Signup Successful");
    // window.location.href = "./Dashboard/dashboard.html";

  } catch (error) {
    console.log(error.message);
    errorMessageEl.textContent = error.message;
    errorMessageEl.style.color = "red";
  } finally {
    signupButtonEl.textContent = "Sign up";
    signupButtonEl.disabled = false;
    console.log("Signup process completed.");
  }
};
signupformel.addEventListener("submit", (e)=>{
    e.preventDefault()
    handleSignup()
})





const signInFormEl = document.getElementById("signUpForm");
const errorEl = document.getElementById("error-message");
const signInBtnEl = document.getElementById("signin-btn");

const signIn = async () => {
  
  const email = document.getElementById("emailInp").value.trim();
  const password = document.getElementById("passwordInp").value.trim();

  
  errorEl.textContent = "";

 
  if (!email || !password) {
    errorEl.textContent = "Please enter email and password.";
    return;
  }

  signInBtnEl.textContent = "Signing In...";
  signInBtnEl.disabled = true;
  console.log("Signing in...");

  try {
    
    const userCredential = await signInWithEmailAndPassword(Auth, email, password);
    const user = userCredential.user;

    console.log(user);

    if (user) {
      Swal.fire({
      text: "You Have Signed Up Successfully",
      icon: "success",
     })
      // alert("Welcome");
      setTimeout(() => {
      location.href = `../pages/dashboard.html?id=${userCredential.uid}`;
     }, 2000);
      // window.location.href = "./Dashboard/dashboard.html";
    }
  } catch (error) {
    console.error(error);
    console.error(error.code);

   
    if (error.code === "auth/invalid-credential") {
      errorEl.textContent = "Invalid credentials provided";
    } else if (error.code === "auth/user-not-found") {
      errorEl.textContent = "No user found with this email";
    }
  } finally {
    // signInBtnEl.textContent = "Sign In";
    signInBtnEl.disabled = false;
    console.log("Done...");
  }
};


signInFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  signIn();
});