import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function main() {
  const snap = await getDocs(collection(db, 'designs'));
  for (const d of snap.docs) {
    await deleteDoc(d.ref);
  }
  console.log("All deleted.");
  // wait 5 seconds and read again to see if they were auto-seeded
  await new Promise(r => setTimeout(r, 5000));
  const snap2 = await getDocs(collection(db, 'designs'));
  console.log('Designs count after 5s:', snap2.size);
  process.exit(0);
}
main().catch(err => { console.error(err); process.exit(1); });
