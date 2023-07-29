// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCJVKaJYUpKus8liMU-_FFVgHYdRRMA3gQ",
  authDomain: "plongapp.firebaseapp.com",
  projectId: "plongapp",
  storageBucket: "plongapp.appspot.com",
  messagingSenderId: "748141945320",
  appId: "1:748141945320:web:3477d53924d3ba2f79445d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

export default {app};
export const firestore = getFirestore();
export const storage = getStorage();
