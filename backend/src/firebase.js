const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

const firebaseConfig = {
  apiKey: "AIzaSyCPUNFP89eIntZ9R71sO2t8sKtjiM5PAV0",
  authDomain: "sheild-9a529.firebaseapp.com",
  databaseURL: "https://sheild-9a529-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sheild-9a529",
  storageBucket: "sheild-9a529.firebasestorage.app",
  messagingSenderId: "44082653347",
  appId: "1:44082653347:web:ba4c00a4b58b6a46cf3716",
  measurementId: "G-LXF2VY173T"
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  ...firebaseConfig
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();
const realtimeDb = admin.database();

module.exports = { admin, db, auth, storage, realtimeDb }; 