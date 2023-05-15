const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESAGING_SENDERID,
    appId: process.env.APPID,
};

const useFirebase = initializeApp(firebaseConfig);

const storage = getStorage(useFirebase);

// exports.useFirebase = useFirebase;
exports.storage = storage;
