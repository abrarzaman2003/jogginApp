const { firestore } = require('firebase-admin');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('./joggingapp-377521-d6ee155166e9.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function fireStoreGetAllRouteHeaders(){
    console.log("getting all routes from firebase...");
    try{
        const arr = [];
        const collectionRef = db.collection('routes');
        const snapshot = await collectionRef.orderBy('created','desc').get();
        snapshot.forEach((doc)=>{
            console.log(doc.data());
            arr.push(doc.data());
        }); 
        return arr;
    }catch(error){
        return [];
    }
}

async function fireStoreAddRoute(routeObject){
    console.log("testing firebase" , routeObject);
    try{
        const docRef = db.collection('routes').doc(routeObject.id);
        await docRef.set({...routeObject, created: firestore.FieldValue.serverTimestamp()});
        return true;
    }catch (error){
        console.error(error);
        return false;
    }
}

module.exports = {
   fireStoreAddRoute: fireStoreAddRoute , 
   fireStoreGetAllRouteHeaders: fireStoreGetAllRouteHeaders,
}