import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function main() {
  await setDoc(doc(db, 'designs', 'test-design'), { title: 'Test' });
  console.log("Written.");
  await new Promise(r => setTimeout(r, 2000));
  const snap = await getDocs(collection(db, 'designs'));
  console.log('Count:', snap.size);
  await deleteDoc(doc(db, 'designs', 'test-design'));
  console.log("Deleted test design.");
  process.exit(0);
}
main().catch(console.error);
