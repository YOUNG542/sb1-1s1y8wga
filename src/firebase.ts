import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // 🔸 Firestore import 추가

const firebaseConfig = {
  apiKey: 'AIzaSyBmEK0y2R5srs3YG6S3uwGMSNNtwUAXzds',
  authDomain: 'would-you-rather-e7576.firebaseapp.com',
  projectId: 'would-you-rather-e7576',
  storageBucket: 'would-you-rather-e7576.firebasestorage.app',
  messagingSenderId: '782958436163',
  appId: '1:782958436163:web:a8eeb90599ac783003d9f6',
  measurementId: 'G-2ZHF3JWG4H',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // 🔸 이 줄 추가
