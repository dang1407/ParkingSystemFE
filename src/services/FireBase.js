// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  updateCurrentUser,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOF-wSoDTHUX0kSRHxddUCyuCwp4lMJwk",
  authDomain: "learn-firebase-a69e8.firebaseapp.com",
  projectId: "learn-firebase-a69e8",
  storageBucket: "learn-firebase-a69e8.appspot.com",
  messagingSenderId: "747245342761",
  appId: "1:747245342761:web:bd1feea4483a4e99d4cc38",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireBaseAuth = getAuth();
// init service
const fireStore = getFirestore();
const storage = getStorage();
const timeStamp = serverTimestamp();
const firebaseRef = ref;
export {
  fireBaseAuth,
  fireStore,
  timeStamp,
  storage,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  firebaseRef,
  uploadBytes,
  getDownloadURL,
};
