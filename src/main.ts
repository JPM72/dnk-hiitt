import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDuR_81xpprBCkkPaaVfaM1dn0_8aBXBPg",
	authDomain: "dnk-hiitt.firebaseapp.com",
	projectId: "dnk-hiitt",
	storageBucket: "dnk-hiitt.firebasestorage.app",
	messagingSenderId: "676965594884",
	appId: "1:676965594884:web:9338338e3f0a9861e5c251",
	measurementId: "G-G7KZKGRYR2"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)