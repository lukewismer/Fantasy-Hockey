import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBi9OQ7brMzz_lDkEMSMGcLkziJ9HrWw90",
    authDomain: "fantasy-hockey-57a7f.firebaseapp.com",
    projectId: "fantasy-hockey-57a7f",
    storageBucket: "fantasy-hockey-57a7f.appspot.com",
    messagingSenderId: "663336487787",
    appId: "1:663336487787:web:5c45ab6667724c7acdda2e",
    measurementId: "G-V4RMDTLXSH"
  };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
