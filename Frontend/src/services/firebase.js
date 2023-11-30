import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCT4mQRh2L_EN3tQVOUoQH-K72Aq7o2vmc",
    authDomain: "project-management-2dc3c.firebaseapp.com",
    projectId: "project-management-2dc3c",
    storageBucket: "project-management-2dc3c.appspot.com",
    messagingSenderId: "688330650216",
    appId: "1:688330650216:web:6fe2bae387a2a5ba6681dd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;