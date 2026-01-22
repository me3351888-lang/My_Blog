import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWL2nKL49VvkM8dTiWS29KAgoFpcnNdZw",
  authDomain: "blog-a222e.firebaseapp.com",
  projectId: "blog-a222e",
  storageBucket: "blog-a222e.firebasestorage.app",
  messagingSenderId: "419483735976",
  appId: "1:419483735976:web:37fc43579178ae8e87af9d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);