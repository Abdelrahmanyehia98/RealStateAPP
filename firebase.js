// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBMsgy7FgOnt5gI6yq9c4fNgCzbxXBEv0",
  authDomain: "project-try-256e7.firebaseapp.com",
  projectId: "project-try-256e7",
  storageBucket: "project-try-256e7.firebasestorage.app",
  messagingSenderId: "280597614578",
  appId: "1:280597614578:web:19770672dc3fc372a1256b",
  measurementId: "G-PHE1EDM3YS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Set persistence to LOCAL (persists even when browser is closed)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Initialize other Firebase services
const db = getFirestore(app);
const storage = getStorage(app);

// Function to test Firebase connection
const testFirebaseConnection = async () => {
  try {
    // Test authentication
    const authTest = auth.app.name;

    // Test Firestore
    const dbTest = db.app.name;

    // Test Storage
    const storageTest = storage.app.name;

    console.log('Firebase connection successful!');
    console.log('Auth:', authTest);
    console.log('Firestore:', dbTest);
    console.log('Storage:', storageTest);

    return true;
  } catch (error) {
    console.error('Firebase connection error:', error);
    return false;
  }
};

export { auth, db, storage, testFirebaseConnection };





//  apiKey: "AIzaSyCGIXXxW7kpcfl-oHU-tOvZ6qjAp9l6iQA",
//   authDomain: "test-cc2b3.firebaseapp.com",
//   projectId: "test-cc2b3",
//   storageBucket: "test-cc2b3.firebasestorage.app",
//   messagingSenderId: "540492894422",
//   appId: "1:540492894422:web:7e8833c7197bd5d3f9b977",
//   measurementId: "G-7CB0ZDKYDQ"