import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/firestore";
import "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-rD_ORFeEE3qVuVWKqyT2R4TFfWwObUA",
  authDomain: "test-firebase-1-99f85.firebaseapp.com",
  databaseURL: "https://test-firebase-1-99f85.firebaseio.com",
  projectId: "test-firebase-1-99f85",
  storageBucket: "test-firebase-1-99f85.appspot.com",
  messagingSenderId: "186353048639",
  appId: "1:186353048639:web:e04136ca9b7234af26ac8a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };
