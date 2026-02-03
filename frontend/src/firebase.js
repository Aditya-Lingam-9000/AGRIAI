// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC17qtA3guXGV2rLf1ydFISZIYas_zGb_Y",
  authDomain: "agri-8f000.firebaseapp.com",
  projectId: "agri-8f000",
  storageBucket: "agri-8f000.firebasestorage.app",
  messagingSenderId: "478036629673",
  appId: "1:478036629673:web:046987d6ad5a4e37f431b8",
  measurementId: "G-42804TQ2VF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);