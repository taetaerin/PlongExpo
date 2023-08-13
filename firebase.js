// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Your web app's Firebase configuration

//plongplong
const firebaseConfig = {
  apiKey: "AIzaSyAAbUkoPBFpN5wy3U4Y8le9UZnXoW7O06U",
  authDomain: "plongplong-1a446.firebaseapp.com",
  projectId: "plongplong-1a446",
  storageBucket: "plongplong-1a446.appspot.com",
  messagingSenderId: "709179252984",
  appId: "1:709179252984:web:3abcb4b5bc0098ccf61b0d"
};

//ㅗㅗ
// const firebaseConfig = {
//   apiKey: "AIzaSyBLAfV7UXDBAM07V37mHmGGO-W7dIxMEjA",
//   authDomain: "practice2-e14c0.firebaseapp.com",
//   projectId: "practice2-e14c0",
//   storageBucket: "practice2-e14c0.appspot.com",
//   messagingSenderId: "378231998660",
//   appId: "1:378231998660:web:aac6a907e0ef8f9de8e191"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

export default {app};
export const firestore = getFirestore();
export const storage = getStorage();
