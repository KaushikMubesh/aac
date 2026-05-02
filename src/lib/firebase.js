import { initializeApp } from "firebase/app";
import {
  arrayUnion,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  collection,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

let db = null;

if (hasFirebaseConfig) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

const studentsCollectionName = "students";

function ensureFirebase() {
  if (!db) {
    throw new Error(
      "Firebase is not configured. Add your Vite Firebase environment variables to connect cloud storage.",
    );
  }
}

export function isFirebaseConfigured() {
  return hasFirebaseConfig;
}

export async function fetchStudentsFromCloud() {
  ensureFirebase();
  const snapshot = await getDocs(collection(db, studentsCollectionName));
  return snapshot.docs.map((studentDoc) => studentDoc.data());
}

export async function upsertStudentInCloud(student) {
  ensureFirebase();
  const ref = doc(db, studentsCollectionName, student.studentId);
  await setDoc(
    ref,
    {
      ...student,
      attempts: student.attempts ?? [],
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}

export async function appendQuizAttemptInCloud(studentId, attempt) {
  ensureFirebase();
  const ref = doc(db, studentsCollectionName, studentId);
  await setDoc(
    ref,
    {
      attempts: arrayUnion(attempt),
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}
