// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYhLaQN-mEYFhMD9nT5LiPPicYtn9Vib8",
  authDomain: "my-crud-app-2b66d.firebaseapp.com",
  projectId: "my-crud-app-2b66d",
  storageBucket: "my-crud-app-2b66d.firebasestorage.app",
  messagingSenderId: "124957638524",
  appId: "1:124957638524:web:fdaabc0a8fee29d11deef9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);