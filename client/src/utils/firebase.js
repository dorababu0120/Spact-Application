// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "todoapp-7fe4c.firebaseapp.com",
  projectId: "todoapp-7fe4c",
  storageBucket: "todoapp-7fe4c.firebasestorage.app",
  messagingSenderId: "984475711160",
  appId: "1:984475711160:web:d62e9e2d2c37b58c3c264d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export {app};