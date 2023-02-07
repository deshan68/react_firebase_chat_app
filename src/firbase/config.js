import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVJR9YdWGJFlmAfS64wf75xUZQ5jCQ-L0",
  authDomain: "chat-app-react-2f82a.firebaseapp.com",
  projectId: "chat-app-react-2f82a",
  storageBucket: "chat-app-react-2f82a.appspot.com",
  messagingSenderId: "382473501440",
  appId: "1:382473501440:web:275180536332f0833351e5",
  measurementId: "G-S9G8Z0J1LB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
