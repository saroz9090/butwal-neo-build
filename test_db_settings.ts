import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function main() {
  const docSnap = await getDoc(doc(db, 'settings', 'global'));
  console.log("Settings global exists:", docSnap.exists());
  if (docSnap.exists()) {
    console.log("Data:", docSnap.data());
  }
  process.exit(0);
}
main().catch(console.error);
