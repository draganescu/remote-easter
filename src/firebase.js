import firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/firestore";
import "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// Andrei Pet's firebase
const firebaseConfig = {
    apiKey: "AIzaSyBTjMGkj1vbTcWTJTawLMlYM-EH6o2hB50",
    authDomain: "easter-2021.firebaseapp.com",
    databaseURL:
        "https://easter-2021-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "easter-2021",
    storageBucket: "easter-2021.appspot.com",
    messagingSenderId: "501908955059",
    appId: "1:501908955059:web:d2a7b3ea8274009dbab5c6",
    measurementId: "G-3DK8562BQR"
};
  

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };
