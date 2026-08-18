import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function main() {
  console.log("Deleting design-1...");
  try {
    await deleteDoc(doc(db, 'designs', 'design-1'));
    console.log("Delete success.");
  } catch (err) {
    console.log("Delete failed:", err);
  }
  const snap = await getDocs(collection(db, 'designs'));
  console.log('Designs count after delete:', snap.size);
  process.exit(0);
}
main().catch(err => { console.error(err); process.exit(1); });
