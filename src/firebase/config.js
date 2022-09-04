import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database"
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBH062coQ4oqdlw4RMTC45zUu-3fEXXUA4",
  authDomain: "cfhelp-cc6e7.firebaseapp.com",
  projectId: "cfhelp-cc6e7",
  storageBucket: "cfhelp-cc6e7.appspot.com",
  messagingSenderId: "741466019847",
  appId: "1:741466019847:web:3a33f2270a927f3deef2a2",
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectFirestore = firebase.firestore();
const projectDatabase = firebase.database();
const projectAuth = firebase.auth();
const timestamp = firebase.firestore.Timestamp;
const addToArray = (value) => firebase.firestore.FieldValue.arrayUnion(value);

export { projectFirestore, projectDatabase, projectAuth, timestamp, addToArray };
