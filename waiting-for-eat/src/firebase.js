import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLF96Ko_PxIEANL2etu4ax5myq_xvnK6c",
  authDomain: "project-fire-6a02f.firebaseapp.com",
  projectId: "project-fire-6a02f",
  storageBucket: "project-fire-6a02f.appspot.com",
  messagingSenderId: "938279563215",
  appId: "1:938279563215:web:19960404f8ca45f41bacba",
  measurementId: "G-MLHM03JQLJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); //建立 Firebase App 物件
const analytics = getAnalytics(app);
const db = getFirestore(app); //database
export const storage = getStorage(app); //storage connect

export default db; //要用的地方就要用db
