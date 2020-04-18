import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/firestore";
import "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// Andrei Pet's firebase
const firebaseConfig = {
    apiKey: "AIzaSyAeHT25wUYbw3GtEFyhiSj4bYCYvQCZxpE",
    authDomain: "eggster.firebaseapp.com",
    databaseURL: "https://eggster.firebaseio.com",
    projectId: "eggster",
    storageBucket: "eggster.appspot.com",
    messagingSenderId: "899598577489",
    appId: "1:899598577489:web:331ca666050417bdb66d70"
};
  

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };
