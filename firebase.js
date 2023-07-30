// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAAbUkoPBFpN5wy3U4Y8le9UZnXoW7O06U",
  authDomain: "plongplong-1a446.firebaseapp.com",
  projectId: "plongplong-1a446",
  storageBucket: "plongplong-1a446.appspot.com",
  messagingSenderId: "709179252984",
  appId: "1:709179252984:web:3abcb4b5bc0098ccf61b0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

export default {app};
export const firestore = getFirestore();
export const storage = getStorage();