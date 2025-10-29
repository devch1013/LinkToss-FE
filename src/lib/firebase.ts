import { getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAM0n9O-myFcYbCQ9-Xk_5P8rwhQLfra6I",
  authDomain: "linktoss-476608.firebaseapp.com",
  projectId: "linktoss-476608",
  storageBucket: "linktoss-476608.firebasestorage.app",
  messagingSenderId: "864206559275",
  appId: "1:864206559275:web:56d8eba8dc7cb5826e726e",
  measurementId: "G-Y2VT5G05T3"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };

