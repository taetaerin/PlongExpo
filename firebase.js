//파이어베이스 

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBLs4g8C1X6Xqmt0sNIo7TjMk8Y7oNcR7k",
  authDomain: "plogging-a9145.firebaseapp.com",
  projectId: "plogging-a9145",
  storageBucket: "plogging-a9145.appspot.com",
  messagingSenderId: "58481871046",
  appId: "1:58481871046:web:de797e1da07b816ee0efc7",
  measurementId: "G-MRX7TLT0RZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;