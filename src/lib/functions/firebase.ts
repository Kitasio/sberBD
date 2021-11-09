import { initializeApp } from 'firebase/app'
import { getFirestore, serverTimestamp } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

import { writable } from 'svelte/store';

export const imgPath = writable('')
export const username = writable('')
export const selectedUnit = writable('')
export const selectedShip = writable('')

const firebaseConfig = {
  apiKey: "AIzaSyBMbtDEiu8VDP9i_IunXe-EdPXg2crFJFo",
  authDomain: "sber190.firebaseapp.com",
  projectId: "sber190",
  storageBucket: "sber190.appspot.com",
  messagingSenderId: "916024475956",
  appId: "1:916024475956:web:77a82da883749689532561",
  measurementId: "G-MNTEB0EK3X"
};
const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp, 'gs://sber190.appspot.com')
export const db = getFirestore(firebaseApp)
export const ts = serverTimestamp()

// export const upload = async (file, filename) => {
//   const storageRef = ref(storage, 'public/' + filename);
//   await uploadBytes(storageRef, file).then((snapshot) => {
//     console.log('Uploaded a blob or file!');
//   });

//   await getDownloadURL(ref(storage, 'public/' + filename)).then(url => {
//     imgPath.set(url)
//   })
// }

// export const saveToDB = (collection, item) => {
// 	db.collection(collection).add(item).then(e => console.log(e))
// }
