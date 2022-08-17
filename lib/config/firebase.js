import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBx5iqiVCrGEC7W1ejmkOki-OOV4F3lDDs",
  authDomain: "pena-project-248c3.firebaseapp.com",
  projectId: "pena-project-248c3",
  storageBucket: "pena-project-248c3.appspot.com",
  messagingSenderId: "373549816000",
  appId: "1:373549816000:web:a4939eed37c722b23e7525"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);


