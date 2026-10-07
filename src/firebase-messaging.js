import { getMessaging } from "firebase/messaging"
import { app } from "./firebase"

export const messaging = getMessaging(app)

export const vapidKey =
  "BPWajadeaONAxM4obBF5FnqMr5YEboeMHR-rOikR5FIMEy9kB8tUf85nTIrNMaaNPlLahRVmHiuAC8H4gkfw3Yo"