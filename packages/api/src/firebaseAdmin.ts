import admin from "firebase-admin";

if (admin.apps.length == 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // databaseURL: process.env.FIREBASE_DB_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
  console.log("Firebase initialized");
} else {
  console.warn("Firebase already initialized");
}

export const firebaseAdmin = admin;
