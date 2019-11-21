import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const config = {
  apiKey: 'AIzaSyAisIlITIxCckjOsCreb7N_c0QQFySqVTQ',
  authDomain: 'parkright-1e206.firebaseapp.com',
  databaseURL: 'https://parkright-1e206.firebaseio.com',
  projectId: 'parkright-1e206',
  storageBucket: 'parkright-1e206.appspot.com',
  messagingSenderId: '508584935404',
  appId: '1:508584935404:web:39308590d2e8f48acf0ac9',
  measurementId: 'G-8BP1NRQ38C'
}
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// firebase collections
const usersCollection = db.collection('Users')
const reportsCollection = db.collection('Violations')

export { db, auth, currentUser, usersCollection, reportsCollection }
