// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import 'firebase/auth'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmJJzGfZe4EeuwVA1dJGw62wm6nrPsnkc",
  authDomain: "plongexpo.firebaseapp.com",
  projectId: "plongexpo",
  storageBucket: "plongexpo.appspot.com",
  messagingSenderId: "586366805279",
  appId: "1:586366805279:web:b34da872f8a85d61be3c2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;