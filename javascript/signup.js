import {
  getFirestore,
  collection,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBrQFNipW61jkC6zZp-vSQ3dq8p59QTHb4",
  authDomain: "auralis-30f77.firebaseapp.com",
  projectId: "auralis-30f77",
  storageBucket: "auralis-30f77.firebasestorage.app",
  messagingSenderId: "534550869579",
  appId: "1:534550869579:web:31f98ebff69d25e50e3fce"
};

// Initialize
const app = initializeApp(firebaseConfig);
const Auth = getAuth(app);
const DB = getFirestore(app);
const userColRef = collection(DB, "user");

// === SIGN-UP LOGIC ===
const signupFormEl = document.getElementById("signUpForm");
const signUpBtnEl = document.getElementById("signup-btn"); // Make sure you give the sign-up button this ID
const errorMessageEl = document.getElementById("error-message");

const handleSignup = async () => {
  signUpBtnEl.textContent = "Signing Up...";
  signUpBtnEl.disabled = true;

  const email = document.getElementById("emailInp").value.trim();
  const password = document.getElementById("passwordInp").value.trim();
  const name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phoneNumberInp").value.trim();
  const address = document.getElementById("address").value.trim();
  const allergies = document.getElementById("allergies").value.trim();
  const contactName = document.getElementById("contactName").value.trim();
  const contactNum = document.getElementById("contactNum").value.trim();
  const age = document.getElementById("age").value.trim();
  const gender = document.getElementById("gender").value;

  if (!email || !password || !name || !phone || !address || !age || gender === "select") {
    errorMessageEl.textContent = "Please fill in all required fields.";
    errorMessageEl.style.color = "red";
    signUpBtnEl.textContent = "Sign Up";
    signUpBtnEl.disabled = false;
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(Auth, email, password);
    const user = userCredential.user;

    const userData = {
      id: user.uid,
      email,
      name,
      phone,
      address,
      allergies,
      emergencyContactName: contactName,
      emergencyContactNumber: contactNum,
      age,
      gender
    };

    await setDoc(doc(userColRef, user.uid), userData);
    await sendEmailVerification(user);

    Swal.fire({
      icon: "success",
      text: "Sign-up successful! Redirecting...",
      timer: 2000,
      showConfirmButton: false
    });

    setTimeout(() => {
      location.href = `../pages/dashboard.html?id=${user.uid}`;
    }, 2000);

  } catch (error) {
    errorMessageEl.textContent = error.message;
    errorMessageEl.style.color = "red";
  } finally {
    signUpBtnEl.textContent = "Sign Up";
    signUpBtnEl.disabled = false;
  }
};

signupFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSignup();
});


// === SIGN-IN LOGIC ===
const signInFormEl = document.getElementById("signInForm");
const signInBtnEl = document.getElementById("signin-btn");
const signInErrorEl = document.getElementById("error-message");

const handleSignIn = async () => {
  const email = document.getElementById("signinEmail").value.trim();
  const password = document.getElementById("signinPassword").value.trim();

  signInErrorEl.textContent = "";

  if (!email || !password) {
    signInErrorEl.textContent = "Please enter your email and password.";
    return;
  }

  signInBtnEl.textContent = "Signing In...";
  signInBtnEl.disabled = true;

  try {
    const userCredential = await signInWithEmailAndPassword(Auth, email, password);
    const user = userCredential.user;

    Swal.fire({
      icon: "success",
      text: "Login successful! Redirecting...",
      timer: 3000,
      showConfirmButton: false
    });

    setTimeout(() => {
      location.href = `../pages/dashboard.html?id=${user.uid}`;
    }, 3000);
  } catch (error) {
    if (error.code === "auth/invalid-credential") {
      signInErrorEl.textContent = "Invalid credentials.";
    } else if (error.code === "auth/user-not-found") {
      signInErrorEl.textContent = "User not found.";
    } else {
      signInErrorEl.textContent = error.message;
    }
  } finally {
    signInBtnEl.textContent = "Sign In";
    signInBtnEl.disabled = false;
  }
};

signInFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSignIn();
});
