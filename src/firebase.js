import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/firestore";
import "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYfqZ5GGRok538J5x94uMg-DclnRMDIR4",
  authDomain: "remote-easter-tap.firebaseapp.com",
  databaseURL: "https://remote-easter-tap.firebaseio.com",
  projectId: "remote-easter-tap",
  storageBucket: "remote-easter-tap.appspot.com",
  messagingSenderId: "39955025923",
  appId: "1:39955025923:web:8f9dd39ba0b89dec0cbe36"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };
