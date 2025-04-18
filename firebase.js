// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYjToFuVDbnkbEVBHyUPruOzwOgtaeow8",
  authDomain: "app-project-fef04.firebaseapp.com",
  projectId: "app-project-fef04",
  storageBucket: "app-project-fef04.firebasestorage.app",
  messagingSenderId: "203298090968",
  appId: "1:203298090968:web:acb67d442bcfab9441ccad",
  measurementId: "G-JHBN8R9PZ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
