importScripts(
  "https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js"
)

importScripts(
  "https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js"
)

const firebaseConfig = {
  apiKey: "AIzaSyD6aBmnshrG0Z0n2rHDVmGqoYRsPbVbl34",
  authDomain: "supermarket-ef079.firebaseapp.com",
  projectId: "supermarket-ef079",
  storageBucket: "supermarket-ef079.firebasestorage.app",
  messagingSenderId: "612512947000",
  appId: "1:612512947000:web:4cc14eaa24eaa819eaffcd",
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Background message:",
    payload
  )

  const notificationTitle =
    payload?.notification?.title ||
    payload?.data?.title ||
    "مراعينا"

  const notificationBody =
    payload?.notification?.body ||
    payload?.data?.body ||
    payload?.data?.message ||
    ""

  const notificationOptions = {
    body: notificationBody,
    icon: "/icon-512.png",
    badge: "/icon-512.png",
    data: {
      url: "/",
    },
  }

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  )
})

self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close()

    event.waitUntil(
      clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      }).then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            return client.focus()
          }
        }

        if (clients.openWindow) {
          return clients.openWindow("/")
        }

        return undefined
      })
    )
  }
)