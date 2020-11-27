import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyAMV9PhHlcbQ0rzgbYTyY4a_6ylZnwzXQQ",
    authDomain: "crown-db-a1d1b.firebaseapp.com",
    databaseURL: "https://crown-db-a1d1b.firebaseio.com",
    projectId: "crown-db-a1d1b",
    storageBucket: "crown-db-a1d1b.appspot.com",
    messagingSenderId: "475526589786",
    appId: "1:475526589786:web:861feb13ccb97949571763",
    measurementId: "G-ZB0X98HZW1"
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if(!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const snapShot = await userRef.get();

    if(!snapShot.exists){
        const { displayName, email} = userAuth;
        const createdAt = new Date();

        try{
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            })


        }catch(error){
            console.log('error creating user', error.message);
        }
    }

    return userRef;
}

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;