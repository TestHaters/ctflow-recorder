import { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import {
  collection,
  addDoc,
  getDoc,
  query,
  where,
  getFirestore,
  onSnapshot,
  doc,
  setDoc,
  getDocs,
} from 'firebase/firestore';

export function getFirestoreDb() {
  const firebaseConfig = {
    apiKey: 'AIzaSyDJga4UJsowB__cuIrztHfZn5Dnh6L43aw',
    authDomain: 'ctflow-69ddf.firebaseapp.com',
    projectId: 'ctflow-69ddf',
    storageBucket: 'ctflow-69ddf.appspot.com',
    messagingSenderId: '246981269934',
    appId: '1:246981269934:web:a46fc4e01c4fe1a727903f',
    measurementId: 'G-DVT8PMKM44',
  };

  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
}

export const firestoreDB = getFirestoreDb();

export async function initTestDbOnFirestore() {
  const db = firestoreDB;
  const citiesRef = collection(db, 'cities');

  await setDoc(doc(citiesRef, 'SF'), {
    name: 'San Francisco',
    state: 'CA',
    country: 'USA',
    capital: false,
    population: 860000,
    regions: ['west_coast', 'norcal'],
  });
  await setDoc(doc(citiesRef, 'LA'), {
    name: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    capital: false,
    population: 3900000,
    regions: ['west_coast', 'socal'],
  });
  await setDoc(doc(citiesRef, 'DC'), {
    name: 'Washington, D.C.',
    state: null,
    country: 'USA',
    capital: true,
    population: 680000,
    regions: ['east_coast'],
  });
  await setDoc(doc(citiesRef, 'TOK'), {
    name: 'Tokyo',
    state: null,
    country: 'Japan',
    capital: true,
    population: 9000000,
    regions: ['kanto', 'honshu'],
  });
  await setDoc(doc(citiesRef, 'BJ'), {
    name: 'Beijing',
    state: null,
    country: 'China',
    capital: true,
    population: 21500000,
    regions: ['jingjinji', 'hebei'],
  });
}

export async function testFirestore() {
  console.log('TEST FIRESTORE');
  const db = firestoreDB;

  const cityRef = doc(db, 'cities', 'LA');
  const citySnap = await getDoc(cityRef);
  console.log('citySnap: ', citySnap);
  console.log('citySnap: ', citySnap.data());

  const q = query(collection(db, 'cities'), where('state', '==', 'CA'));

  const querySnapshot = await getDocs(q);
  console.log('querySnapshot', querySnapshot);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, ' => ', doc.data());
  });
}

export async function testFirestoreSync() {
  const unsub = onSnapshot(doc(firestoreDB, 'cities', 'SF'), (doc) => {
    const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server';
    console.log(source, ' data: ', doc.data());
  });
}

// Save recording actions to firebase under recording collection
// data structure:
// recording doc:
// - actions
// - ip
// - userId
// - created_at
// - updated_at
export async function addRecordingAction(
  id: string,
  nodes: any[],
  edges: any[]
) {
  // get docRef to check if any
  let refDoc = await getDoc(doc(firestoreDB, 'recorders', id));
  let newNodes = refDoc.exists() ? refDoc.data().nodes : [];
  let newEdges = refDoc.exists() ? refDoc.data().edges : [];
  newNodes.push(...nodes);
  newEdges.push(...edges);

  console.log('here');
  // create new doc if not exist
  let newDoc = {
    nodes: newNodes,
    edges: newEdges,
    ip: '127.0.0.1',
    userId: 'test',
    created_at: new Date(),
    updated_at: new Date(),
  };
  // if doc exist, update it
  if (refDoc.exists()) {
    newDoc = { ...newDoc, ...refDoc.data() };
    newDoc.edges = newEdges;
    newDoc.nodes = newNodes;
    newDoc.updated_at = new Date();
  }

  await setDoc(doc(firestoreDB, 'recorders', id), newDoc);
}

export async function setRecordingAction(
  id: string,
  nodes: any[],
  edges: any[]
) {
  console.log('here');
  // create new doc if not exist
  let newDoc = {
    nodes: nodes,
    edges: edges,
    ip: '127.0.0.1',
    userId: 'test',
    created_at: new Date(),
    updated_at: new Date(),
  };

  await setDoc(doc(firestoreDB, 'recorders', id), newDoc);
}

export async function setAIRecord(
  id: string,
  currentHtml: string,
  simplifiedHtml: string
) {
  await setDoc(doc(firestoreDB, 'ai_records', id), {
    currentHtml,
    simplifiedHtml,
    thoughts_actions: [],
    current_thought: '',
    current_actions: [{}],
    ip: '127.0.0.1',
    userId: 'test',
    created_at: new Date(),
    updated_at: new Date(),
  });
}
