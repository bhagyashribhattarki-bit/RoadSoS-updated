import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    orderBy,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
window.where = where;
window.orderBy = orderBy;
window.query = query;
window.deleteDoc = deleteDoc;
window.doc = doc;
const firebaseConfig = {
    apiKey: "AIzaSyA3FUxtSrNmLdZ_jXfczJf_9hPuCTL8nzY",
    authDomain: "roadsos-b7e23.firebaseapp.com",
    projectId: "roadsos-b7e23",
    storageBucket: "roadsos-b7e23.firebasestorage.app",
    messagingSenderId: "26958341556",
    appId: "1:26958341556:web:81e00693f0d6aff9aa3ee1"
};

const app = initializeApp(firebaseConfig);

window.auth = getAuth(app);

window.createUserWithEmailAndPassword =
    createUserWithEmailAndPassword;

window.signInWithEmailAndPassword =
    signInWithEmailAndPassword;

window.signOut = signOut;

window.db = getFirestore(app);

window.collection = collection;
window.addDoc = addDoc;
window.getDocs = getDocs;