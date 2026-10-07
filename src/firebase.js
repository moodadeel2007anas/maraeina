import { initializeApp } from "firebase/app"

const firebaseConfig = {
apiKey: "AIzaSyD6aBmnshr0GZ0n2rHDVmGqoYRsPbVbl34",
  authDomain: "supermarket-ef079.firebaseapp.com",
  projectId: "supermarket-ef079",
  storageBucket: "supermarket-ef079.firebasestorage.app",
  messagingSenderId: "612512947000",
  appId: "1:612512947000:web:4cc14eaa24eaa819eaffcd",
  measurementId: "G-9F72KKWFNF",
}

const app = initializeApp(firebaseConfig)

export { app }