import firebase, { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { getFirestore, query, getDocs, collection, where, addDoc } from 'firebase/firestore';
import { getDatabase, ref, push } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDC_3QeDG8z2yHFZKrIfjyGKGKuhKjQDcg',
  authDomain: 'concordia-js.firebaseapp.com',
  databaseURL: 'https://concordia-js-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'concordia-js',
  storageBucket: 'concordia-js.appspot.com',
  messagingSenderId: '203736340537',
  appId: '1:203736340537:web:d1845275765e59e0be55e8',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);

// const createNewGame = async () => {
//   const games = ref(realtimeDb, 'games');
//   const newGame = await push(games, {
//     name: 'Test game1',
//     players: [],
//     turn: 0,
//   });
//   console.log('newGame created', newGame);
// };
// createNewGame();

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, 'users'), where('uid', '==', user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert((err as any).message);
  }
};

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert((err as any).message);
  }
};

const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      name,
      authProvider: 'local',
      email,
    });
  } catch (err) {
    console.error(err);
    alert((err as any).message);
  }
};

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset link sent!');
  } catch (err) {
    console.error(err);
    alert((err as any).message);
  }
};

const logout = () => {
  signOut(auth);
};

export { auth, db, realtimeDb, signInWithGoogle, logInWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordReset, logout };
