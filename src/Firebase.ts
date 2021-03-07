import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/analytics'

export const firebaseApp = firebase.initializeApp({
    apiKey: process.env.firebaseApiKey, //'AIzaSyBTfP2mc_kf3G4bw1t3qBTqnVxRczr1RFk',
    authDomain: 'shoppinglist0603-306805.firebaseapp.com',
    databaseURL: 'https://shoppinglist0603-306805-default-rtdb.firebaseio.com',
    projectId: 'shoppinglist0603-306805',
    storageBucket: 'shoppinglist0603-306805.appspot.com',
    messagingSenderId: '337773700280',
    appId: '1:337773700280:web:d120d07638b32f5083c04d',
})
