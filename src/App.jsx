import { useEffect, useState } from "react"

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"

import {
  getToken,
  onMessage,
} from "firebase/messaging"

import {
  messaging,
  vapidKey,
} from "./firebase-messaging"

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore"

import { app } from "./firebase"

import milkImage from "./images/products/milk.jpg"
import sugarImage from "./images/products/sugar.jpg"
import oilImage from "./images/products/oil.jpg"
import waterImage from "./images/products/water.jpg"
import triangleCheeseImage from "./images/products/triangle-cheese.jpg"
import roumyCheeseImage from "./images/products/roumy-cheese.jpg"

const isAdmin = window.location.pathname === "/admin"

const db = getFirestore(app)
const auth = getAuth(app)

const defaultProducts = [
  {
    id: 1,
    name: "لبن كامل الدسم",
    price: 50,
    category: "ألبان",
    emoji: "🥛",
    image: milkImage,
  },
  {
    id: 2,
    name: "سكر 1 كيلو",
    price: 35,
    category: "بقالة",
    emoji: "🍚",
    image: sugarImage,
  },
  {
    id: 3,
    name: "زيت طعام 1 لتر",
    price: 80,
    category: "بقالة",
    emoji: "🫗",
    image: oilImage,
  },
  {
    id: 4,
    name: "مياه معدنية 1.5 لتر",
    price: 15,
    category: "مشروبات",
    emoji: "💧",
    image: waterImage,
  },
  {
    id: 5,
    name: "عصير مانجا 1 لتر",
    price: 45,
    category: "مشروبات",
    emoji: "🧃",
  },
  {
    id: 6,
    name: "شاي 40 فتلة",
    price: 60,
    category: "بقالة",
    emoji: "🍵",
  },
  {
    id: 7,
    name: "مكرونة 400 جرام",
    price: 15,
    category: "بقالة",
    emoji: "🍝",
  },
  {
    id: 8,
    name: "جبنة بيضاء 500 جرام",
    price: 70,
    category: "ألبان",
    emoji: "🧀",
  },
  {
    id: 9,
    name: "زبادي",
    price: 12,
    category: "ألبان",
    emoji: "🥛",
  },
  {
    id: 10,
    name: "نسكافيه كلاسيك",
    price: 90,
    category: "مشروبات",
    emoji: "☕",
  },
  {
    id: 11,
    name: "جبنة مثلثات",
    price: 45,
    category: "ألبان",
    emoji: "🧀",
    image: triangleCheeseImage,
  },
  {
    id: 12,
    name: "جبنة رومي",
    price: 120,
    category: "ألبان",
    emoji: "🧀",
    image: roumyCheeseImage,
  },
  {
    id: 13,
    name: "قهوة",
    price: 80,
    category: "مشروبات",
    emoji: "☕",
  },
  {
    id: 14,
    name: "صلصة طماطم",
    price: 20,
    category: "بقالة",
    emoji: "🍅",
  },
  {
    id: 15,
    name: "خل",
    price: 15,
    category: "بقالة",
    emoji: "🍶",
  },
  {
    id: 16,
    name: "ملح",
    price: 10,
    category: "بقالة",
    emoji: "🧂",
  },
  {
    id: 17,
    name: "فول معلب",
    price: 25,
    category: "بقالة",
    emoji: "🥫",
  },
  {
    id: 18,
    name: "تونة",
    price: 55,
    category: "بقالة",
    emoji: "🐟",
  },
  {
    id: 19,
    name: "بسكويت",
    price: 15,
    category: "بقالة",
    emoji: "🍪",
  },
  {
    id: 20,
    name: "ويفر",
    price: 20,
    category: "بقالة",
    emoji: "🍫",
  },
  {
    id: 21,
    name: "مربى",
    price: 50,
    category: "بقالة",
    emoji: "🍓",
  },
  {
    id: 22,
    name: "عسل",
    price: 80,
    category: "بقالة",
    emoji: "🍯",
  },
  {
    id: 23,
    name: "مياه معدنية 600 مل",
    price: 10,
    category: "مشروبات",
    emoji: "💧",
  },
  {
    id: 24,
    name: "بيبسي 1 لتر",
    price: 35,
    category: "مشروبات",
    emoji: "🥤",
  },
  {
    id: 25,
    name: "كوكاكولا كان",
    price: 25,
    category: "مشروبات",
    emoji: "🥤",
  },
  {
    id: 26,
    name: "سبرايت",
    price: 25,
    category: "مشروبات",
    emoji: "🥤",
  },
  {
    id: 27,
    name: "فانتا",
    price: 25,
    category: "مشروبات",
    emoji: "🥤",
  },
  {
    id: 28,
    name: "عصير برتقال",
    price: 40,
    category: "مشروبات",
    emoji: "🍊",
  },
  {
    id: 29,
    name: "مشروب طاقة",
    price: 50,
    category: "مشروبات",
    emoji: "⚡",
  },
  {
    id: 30,
    name: "بودرة عصير",
    price: 15,
    category: "مشروبات",
    emoji: "🧃",
  },
  {
    id: 35,
    name: "لبان",
    price: 10,
    category: "حلويات",
    emoji: "🍬",
  },
  {
    id: 36,
    name: "جيلي",
    price: 15,
    category: "حلويات",
    emoji: "🍮",
  },
  {
    id: 37,
    name: "مناديل ورقية",
    price: 35,
    category: "بقالة",
    emoji: "🧻",
  },
]

const localImages = {
  1: milkImage,
  2: sugarImage,
  3: oilImage,
  4: waterImage,
  11: triangleCheeseImage,
  12: roumyCheeseImage,
}

function App() {
  const [products, setProducts] = useState(defaultProducts)
  const [cart, setCart] = useState({})
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] =
    useState("الكل")
  const [showCart, setShowCart] = useState(false)

  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [customerNotes, setCustomerNotes] = useState("")

  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)

  const [tokenCount, setTokenCount] = useState(0)
  const [orders, setOrders] = useState([])

  const [notificationTitle, setNotificationTitle] =
    useState("")
  const [notificationMessage, setNotificationMessage] =
    useState("")
  const [sendingNotification, setSendingNotification] =
    useState(false)

  const [newProductName, setNewProductName] = useState("")
  const [newProductPrice, setNewProductPrice] = useState("")
  const [newProductCategory, setNewProductCategory] =
    useState("بقالة")
  const [newProductEmoji, setNewProductEmoji] =
    useState("🛒")

  const [editingProductId, setEditingProductId] =
    useState(null)
  const [editingName, setEditingName] = useState("")
  const [editingPrice, setEditingPrice] = useState("")
  const [editingCategory, setEditingCategory] =
    useState("")
  const [editingEmoji, setEditingEmoji] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setAdminLoggedIn(Boolean(user))
      }
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    let unsubscribe = () => {}

    try {
      unsubscribe = onMessage(
        messaging,
        async (payload) => {
          console.log(
            "FCM foreground message:",
            payload
          )

          const title =
            payload?.notification?.title ||
            payload?.data?.title ||
            "مراعينا"

          const body =
            payload?.notification?.body ||
            payload?.data?.body ||
            payload?.data?.message ||
            ""

          if (Notification.permission !== "granted") {
            console.log(
              "Notification permission is not granted"
            )
            return
          }

          const registration =
            await navigator.serviceWorker.getRegistration(
              "/firebase-cloud-messaging-push-scope"
            )

          if (registration) {
            await registration.showNotification(
              title,
              {
                body,
                icon: "/icon-512.png",
                badge: "/icon-512.png",
              }
            )

            console.log(
              "Foreground notification displayed"
            )
          } else {
            new Notification(
              title,
              {
                body,
                icon: "/icon-512.png",
              }
            )

            console.log(
              "Foreground notification displayed using Notification API"
            )
          }
        }
      )

      console.log(
        "FCM foreground listener started"
      )
    } catch (error) {
      console.error(
        "FCM foreground listener error:",
        error
      )
    }

    return () => {
      unsubscribe()
    }
  }, [])

  const enableNotifications = async () => {
    try {
      console.log(
        "🔔 STEP 1: enableNotifications started"
      )

      if (!("Notification" in window)) {
        console.log(
          "❌ STEP 2: Notification API not supported"
        )

        alert(
          "هذا المتصفح لا يدعم الإشعارات"
        )

        return
      }

      if (!("serviceWorker" in navigator)) {
        console.log(
          "❌ STEP 3: Service Worker not supported"
        )

        alert(
          "هذا المتصفح لا يدعم Service Worker"
        )

        return
      }

      console.log(
        "🔔 STEP 2: Notification permission =",
        Notification.permission
      )

      const permission =
        await Notification.requestPermission()

      console.log(
        "🔔 STEP 3: requestPermission result =",
        permission
      )

      if (permission !== "granted") {
        alert(
          "لم يتم السماح بالإشعارات"
        )

        return
      }

      console.log(
        "🔔 STEP 4: registering Firebase Service Worker"
      )

      const registration =
        await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          {
            scope:
              "/firebase-cloud-messaging-push-scope",
          }
        )

      console.log(
        "🔔 STEP 5: Service Worker registered",
        registration
      )

      await registration.update()

      console.log(
        "🔔 STEP 6: registration.update completed"
      )

      console.log(
        "🔔 STEP 7: calling getToken..."
      )

      const token = await getToken(
        messaging,
        {
          vapidKey,
          serviceWorkerRegistration:
            registration,
        }
      )

      console.log(
        "🔔 STEP 8: getToken result =",
        token
      )

      if (!token) {
        alert(
          "لم يتم الحصول على رمز الإشعارات"
        )

        return
      }

      await setDoc(
        doc(
          db,
          "notificationTokens",
          token
        ),
        {
          token,
          updatedAt:
            new Date().toISOString(),
        },
        {
          merge: true,
        }
      )

      console.log(
        "🔔 STEP 9: token saved to Firestore"
      )

      console.log(
        "FCM TOKEN:",
        token
      )

      alert(
        "تم تفعيل الإشعارات بنجاح"
      )
    } catch (error) {
      console.error(
        "❌ Enable notifications error:",
        error
      )

      alert(
        "حدث خطأ أثناء تفعيل الإشعارات: " +
          (error?.message ||
            "خطأ غير معروف")
      )
    }
  }

  const sendNotificationToAll = async () => {
    const title =
      notificationTitle.trim()

    const message =
      notificationMessage.trim()

    if (!title || !message) {
      alert(
        "اكتب عنوان الإشعار ونص الإشعار"
      )
      return
    }

    if (tokenCount === 0) {
      alert(
        "لا توجد أجهزة مسجلة لاستقبال الإشعارات"
      )
      return
    }

    try {
      setSendingNotification(true)

      const response = await fetch(
        "https://maraeina-notifications.moodadeel2007.workers.dev/",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title,
            message,
          }),
        }
      )

      let result = null

      try {
        result = await response.json()
      } catch {
        result = null
      }

      if (
        !response.ok ||
        !result?.success
      ) {
        throw new Error(
          result?.error ||
            "فشل إرسال الإشعار (" +
              response.status +
              ")"
        )
      }

      alert(
        "تم إرسال الإشعار بنجاح إلى " +
          (result.sent ?? 0) +
          " جهاز"
      )

      setNotificationTitle("")
      setNotificationMessage("")
    } catch (error) {
      console.error(
        "Notification send error:",
        error
      )

      alert(
        "تعذر إرسال الإشعار: " +
          (error?.message ||
            "خطأ غير معروف")
      )
    } finally {
      setSendingNotification(false)
    }
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),

      (snapshot) => {
        const firestoreProducts =
          snapshot.docs.map(
            (item) => {
              const data = item.data()

              const numericId =
                Number(item.id)

              const productId =
                Number.isFinite(numericId)
                  ? numericId
                  : item.id

              return {
                ...data,

                id: productId,

                image:
                  localImages[productId] ||
                  data.image ||
                  null,
              }
            }
          )

        const deletedIds = new Set(
          firestoreProducts
            .filter(
              (product) =>
                product.deleted === true
            )
            .map(
              (product) =>
                product.id
            )
        )

        const mergedProducts =
          defaultProducts
            .filter(
              (product) =>
                !deletedIds.has(
                  product.id
                )
            )
            .map(
              (product) => {
                const firestoreProduct =
                  firestoreProducts.find(
                    (item) =>
                      item.id ===
                      product.id
                  )

                if (!firestoreProduct) {
                  return product
                }

                return {
                  ...product,
                  ...firestoreProduct,

                  image:
                    localImages[
                      product.id
                    ] ||
                    firestoreProduct.image ||
                    product.image ||
                    null,
                }
              }
            )

        firestoreProducts.forEach(
          (firestoreProduct) => {
            if (
              firestoreProduct.deleted ===
              true
            ) {
              return
            }

            const exists =
              mergedProducts.some(
                (product) =>
                  product.id ===
                  firestoreProduct.id
              )

            if (!exists) {
              mergedProducts.push(
                firestoreProduct
              )
            }
          }
        )

        setProducts(
          mergedProducts
        )
      },

      (error) => {
        console.error(
          "Error reading products:",
          error
        )

        setProducts(
          defaultProducts
        )
      }
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (
      !isAdmin ||
      !adminLoggedIn
    ) {
      return
    }

    const unsubscribeTokens =
      onSnapshot(
        collection(
          db,
          "notificationTokens"
        ),

        (snapshot) => {
          setTokenCount(
            snapshot.size
          )
        },

        (error) => {
          console.error(
            "Error reading notification tokens:",
            error
          )
        }
      )

    const unsubscribeOrders =
      onSnapshot(
        collection(
          db,
          "orders"
        ),

        (snapshot) => {
          const ordersData =
            snapshot.docs
              .map(
                (item) => ({
                  id: item.id,
                  ...item.data(),
                })
              )
              .sort(
                (a, b) =>
                  String(
                    b.createdAt || ""
                  ).localeCompare(
                    String(
                      a.createdAt || ""
                    )
                  )
              )

          setOrders(
            ordersData
          )
        },

        (error) => {
          console.error(
            "Error reading orders:",
            error
          )
        }
      )

    return () => {
      unsubscribeTokens()
      unsubscribeOrders()
    }
  }, [adminLoggedIn])

  const adminLogin = async () => {
    if (
      !adminEmail.trim() ||
      !adminPassword
    ) {
      alert(
        "اكتب الإيميل والباسورد"
      )
      return
    }

    try {
      await signInWithEmailAndPassword(
        auth,
        adminEmail.trim(),
        adminPassword
      )

      alert(
        "تم تسجيل الدخول بنجاح"
      )
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      )

      alert(
        "الإيميل أو الباسورد غير صحيح"
      )
    }
  }

  const adminLogout = async () => {
    try {
      await signOut(auth)

      setAdminEmail("")
      setAdminPassword("")
    } catch (error) {
      console.error(
        "Logout error:",
        error
      )
    }
  }

  const addToCart = (product) => {
    setCart(
      (current) => ({
        ...current,

        [product.id]:
          Number(
            current[
              product.id
            ] || 0
          ) + 1,
      })
    )
  }

  const decrease = (product) => {
    setCart(
      (current) => {
        const newCart = {
          ...current,
        }

        const currentQuantity =
          Number(
            newCart[
              product.id
            ] || 0
          )

        if (
          currentQuantity > 1
        ) {
          newCart[
            product.id
          ] =
            currentQuantity - 1
        } else {
          delete newCart[
            product.id
          ]
        }

        return newCart
      }
    )
  }

  const totalItems =
    Object.values(cart).reduce(
      (sum, quantity) =>
        sum +
        Number(
          quantity || 0
        ),
      0
    )

  const filteredProducts =
    products.filter(
      (product) => {
        const productName =
          String(
            product.name || ""
          )

        const matchesSearch =
          productName
            .toLowerCase()
            .includes(
              search
                .toLowerCase()
                .trim()
            )

        const matchesCategory =
          selectedCategory ===
            "الكل" ||
          product.category ===
            selectedCategory

        return (
          matchesSearch &&
          matchesCategory
        )
      }
    )

  const totalPrice =
    products.reduce(
      (sum, product) => {
        const price =
          Number(
            product.price
          )

        const quantity =
          Number(
            cart[
              product.id
            ] || 0
          )

        if (
          !Number.isFinite(
            price
          ) ||
          !Number.isFinite(
            quantity
          )
        ) {
          return sum
        }

        return (
          sum +
          price *
            quantity
        )
      },
      0
    )

  const saveOrder = async () => {
    const orderItems =
      products
        .filter(
          (product) =>
            Number(
              cart[
                product.id
              ] || 0
            ) > 0
        )
        .map(
          (product) => {
            const price =
              Number(
                product.price
              )

            const quantity =
              Number(
                cart[
                  product.id
                ]
              )

            return {
              id:
                product.id,

              name:
                product.name,

              price,

              quantity,

              total:
                price *
                quantity,
            }
          }
        )

    if (
      orderItems.length ===
      0
    ) {
      throw new Error(
        "السلة فارغة"
      )
    }

    const order = {
      customerName:
        customerName.trim(),

      customerPhone:
        customerPhone.trim(),

      area:
        "برية لاصيفر",

      address:
        customerAddress.trim(),

      notes:
        customerNotes.trim(),

      items:
        orderItems,

      total:
        totalPrice,

      status:
        "جديد",

      createdAt:
        new Date().toISOString(),
    }

    await addDoc(
      collection(
        db,
        "orders"
      ),
      order
    )
  }

  const sendWhatsApp = async () => {
    if (totalItems === 0) {
      alert(
        "السلة فاضية"
      )
      return
    }

    const name =
      customerName.trim()

    const phone =
      customerPhone.trim()

    const address =
      customerAddress.trim()

    const notes =
      customerNotes.trim()

    if (
      !name ||
      !phone ||
      !address
    ) {
      alert(
        "من فضلك اكتب الاسم ورقم الموبايل والعنوان"
      )
      return
    }

    try {
      await saveOrder()
    } catch (error) {
      console.error(
        "Order save error:",
        error
      )

      alert(
        "تعذر حفظ الطلب. حاول مرة أخرى."
      )

      return
    }

    let message =
      "🛒 *طلب جديد من السوبر ماركت*\n\n"

    message +=
      "👤 الاسم: " +
      name +
      "\n"

    message +=
      "📱 الموبايل: " +
      phone +
      "\n"

    message +=
      "📍 المنطقة: برية لاصيفر\n"

    message +=
      "🏠 العنوان: " +
      address +
      "\n"

    if (notes) {
      message +=
        "📝 ملاحظات: " +
        notes +
        "\n"
    }

    message +=
      "\n🛍️ *المنتجات:*\n"

    products.forEach(
      (product) => {
        const quantity =
          Number(
            cart[
              product.id
            ] || 0
          )

        if (quantity > 0) {
          const price =
            Number(
              product.price
            )

          const itemTotal =
            price *
            quantity

          message +=
            product.name +
            " × " +
            quantity +
            " = " +
            itemTotal +
            " جنيه\n"
        }
      }
    )

    message +=
      "\n💰 *الإجمالي: " +
      totalPrice +
      " جنيه*"

    const phoneNumber =
      "201090069294"

    const url =
      "https://wa.me/" +
      phoneNumber +
      "?text=" +
      encodeURIComponent(
        message
      )

    window.location.href =
      url

    setCart({})
    setShowCart(false)
  }

  const addProduct = async () => {
    const name =
      newProductName.trim()

    const price =
      Number(
        newProductPrice
      )

    if (
      !name ||
      !newProductPrice
    ) {
      alert(
        "اكتب اسم المنتج والسعر"
      )
      return
    }

    if (
      !Number.isFinite(
        price
      ) ||
      price <= 0
    ) {
      alert(
        "اكتب سعرًا صحيحًا"
      )
      return
    }

    const maxId =
      products.reduce(
        (max, product) => {
          const id =
            Number(
              product.id
            )

          return Number.isFinite(
            id
          )
            ? Math.max(
                max,
                id
              )
            : max
        },
        0
      )

    const newId =
      maxId + 1

    try {
      await setDoc(
        doc(
          db,
          "products",
          String(
            newId
          )
        ),
        {
          id:
            newId,

          name,

          price,

          category:
            newProductCategory,

          emoji:
            newProductEmoji ||
            "🛒",

          createdAt:
            new Date().toISOString(),
        }
      )

      setNewProductName("")
      setNewProductPrice("")
      setNewProductCategory(
        "بقالة"
      )
      setNewProductEmoji(
        "🛒"
      )

      alert(
        "تمت إضافة المنتج"
      )
    } catch (error) {
      console.error(
        "Add product error:",
        error
      )

      alert(
        "حدث خطأ أثناء إضافة المنتج"
      )
    }
  }

  const startEditing =
    (product) => {
      setEditingProductId(
        product.id
      )

      setEditingName(
        product.name || ""
      )

      setEditingPrice(
        String(
          product.price ?? ""
        )
      )

      setEditingCategory(
        product.category ||
          "بقالة"
      )

      setEditingEmoji(
        product.emoji ||
          "🛒"
      )
    }

  const cancelEditing =
    () => {
      setEditingProductId(
        null
      )

      setEditingName("")
      setEditingPrice("")
      setEditingCategory("")
      setEditingEmoji("")
    }

  const saveProductEdit =
    async () => {
      const name =
        editingName.trim()

      const price =
        Number(
          editingPrice
        )

      if (
        !name ||
        !editingPrice ||
        editingProductId ===
          null
      ) {
        alert(
          "اكتب اسم المنتج والسعر"
        )
        return
      }

      if (
        !Number.isFinite(
          price
        ) ||
        price <= 0
      ) {
        alert(
          "اكتب سعرًا صحيحًا"
        )
        return
      }

      try {
        await setDoc(
          doc(
            db,
            "products",
            String(
              editingProductId
            )
          ),
          {
            id:
              editingProductId,

            name,

            price,

            category:
              editingCategory,

            emoji:
              editingEmoji ||
              "🛒",

            deleted:
              false,
          },
          {
            merge: true,
          }
        )

        cancelEditing()

        alert(
          "تم تعديل المنتج"
        )
      } catch (error) {
        console.error(
          "Edit product error:",
          error
        )

        alert(
          "حدث خطأ أثناء تعديل المنتج"
        )
      }
    }

  const deleteProduct =
    async (product) => {
      const confirmed =
        window.confirm(
          "هل تريد حذف \"" +
            product.name +
            "\"؟"
        )

      if (!confirmed) {
        return
      }

      try {
        const isDefaultProduct =
          defaultProducts.some(
            (item) =>
              item.id ===
              product.id
          )

        if (
          isDefaultProduct
        ) {
          await setDoc(
            doc(
              db,
              "products",
              String(
                product.id
              )
            ),
            {
              id:
                product.id,

              deleted:
                true,

              updatedAt:
                new Date().toISOString(),
            },
            {
              merge: true,
            }
          )
        } else {
          await deleteDoc(
            doc(
              db,
              "products",
              String(
                product.id
              )
            )
          )
        }

        setCart(
          (current) => {
            const newCart = {
              ...current,
            }

            delete newCart[
              product.id
            ]

            return newCart
          }
        )

        alert(
          "تم حذف المنتج"
        )
      } catch (error) {
        console.error(
          "Delete product error:",
          error
        )

        alert(
          "حدث خطأ أثناء حذف المنتج"
        )
      }
    }

  if (isAdmin) {
    if (!adminLoggedIn) {
      return (
        <div
          dir="rtl"
          style={{
            padding: "30px",
            maxWidth: "400px",
            margin: "50px auto",
          }}
        >
          <h1>
            🔐 لوحة تحكم مراعينا
          </h1>

          <input
            type="email"
            placeholder="الإيميل"
            value={
              adminEmail
            }
            onChange={(e) =>
              setAdminEmail(
                e.target.value
              )
            }
            style={{
              display:
                "block",
              width:
                "100%",
              marginBottom:
                "10px",
              padding:
                "10px",
              boxSizing:
                "border-box",
            }}
          />

          <input
            type="password"
            placeholder="الباسورد"
            value={
              adminPassword
            }
            onChange={(e) =>
              setAdminPassword(
                e.target.value
              )
            }
            style={{
              display:
                "block",
              width:
                "100%",
              marginBottom:
                "10px",
              padding:
                "10px",
              boxSizing:
                "border-box",
            }}
          />

          <button
            onClick={
              adminLogin
            }
          >
            تسجيل الدخول
          </button>
        </div>
      )
    }

    return (
      <div
        dir="rtl"
        style={{
          padding: "30px",
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        <h1>
          🔐 لوحة تحكم مراعينا
        </h1>

        <div
          style={{
            padding: "20px",
            margin:
              "20px 0",
            border:
              "1px solid #ddd",
            borderRadius:
              "10px",
          }}
        >
          <h2>
            🔔 الإشعارات
          </h2>

          <p>
            الأجهزة المسجلة لاستقبال
            الإشعارات:
          </p>

          <strong
            style={{
              fontSize:
                "40px",
              display:
                "block",
              margin:
                "10px 0",
            }}
          >
            {tokenCount}
          </strong>

          <input
            type="text"
            placeholder="عنوان الإشعار"
            value={
              notificationTitle
            }
            onChange={(e) =>
              setNotificationTitle(
                e.target.value
              )
            }
            style={{
              width:
                "100%",
              padding:
                "10px",
              marginBottom:
                "10px",
              boxSizing:
                "border-box",
            }}
          />

          <textarea
            placeholder="نص الإشعار"
            value={
              notificationMessage
            }
            onChange={(e) =>
              setNotificationMessage(
                e.target.value
              )
            }
            rows="4"
            style={{
              width:
                "100%",
              padding:
                "10px",
              marginBottom:
                "10px",
              boxSizing:
                "border-box",
              resize:
                "vertical",
            }}
          />

          <button
            onClick={
              sendNotificationToAll
            }
            disabled={
              sendingNotification
            }
            style={{
              padding:
                "12px 20px",
              cursor:
                sendingNotification
                  ? "not-allowed"
                  : "pointer",
              opacity:
                sendingNotification
                  ? 0.7
                  : 1,
            }}
          >
            {sendingNotification
              ? "⏳ جاري الإرسال..."
              : "🔔 إرسال الإشعار لكل المستخدمين"}
          </button>

          <p>
            سيتم إرسال الإشعار تلقائيًا
            إلى جميع الأجهزة المسجلة.
          </p>
        </div>

        <div
          style={{
            padding:
              "20px",
            margin:
              "20px 0",
            border:
              "1px solid #ddd",
            borderRadius:
              "10px",
          }}
        >
          <h2>
            🛍️ إدارة المنتجات
          </h2>

          <input
            type="text"
            placeholder="اسم المنتج"
            value={
              newProductName
            }
            onChange={(e) =>
              setNewProductName(
                e.target.value
              )
            }
            style={{
              width:
                "100%",
              padding:
                "10px",
              marginBottom:
                "10px",
              boxSizing:
                "border-box",
            }}
          />

          <input
            type="number"
            placeholder="السعر"
            value={
              newProductPrice
            }
            onChange={(e) =>
              setNewProductPrice(
                e.target.value
              )
            }
            style={{
              width:
                "100%",
              padding:
                "10px",
              marginBottom:
                "10px",
              boxSizing:
                "border-box",
            }}
          />

          <select
            value={
              newProductCategory
            }
            onChange={(e) =>
              setNewProductCategory(
                e.target.value
              )
            }
            style={{
              width:
                "100%",
              padding:
                "10px",
              marginBottom:
                "10px",
            }}
          >
            <option value="ألبان">
              ألبان
            </option>
            <option value="بقالة">
              بقالة
            </option>
            <option value="مشروبات">
              مشروبات
            </option>
            <option value="حلويات">
              حلويات
            </option>
          </select>

          <input
            type="text"
            placeholder="الإيموجي"
            value={
              newProductEmoji
            }
            onChange={(e) =>
              setNewProductEmoji(
                e.target.value
              )
            }
            style={{
              width:
                "100%",
              padding:
                "10px",
              marginBottom:
                "10px",
              boxSizing:
                "border-box",
            }}
          />

          <button
            onClick={
              addProduct
            }
          >
            ➕ إضافة المنتج
          </button>

          <hr
            style={{
              margin:
                "25px 0",
            }}
          />

          {products.map(
            (product) => (
              <div
                key={
                  product.id
                }
                style={{
                  padding:
                    "15px 0",
                  borderBottom:
                    "1px solid #eee",
                }}
              >
                {editingProductId ===
                product.id ? (
                  <>
                    <input
                      value={
                        editingName
                      }
                      onChange={(e) =>
                        setEditingName(
                          e.target.value
                        )
                      }
                      style={{
                        width:
                          "100%",
                        padding:
                          "8px",
                        marginBottom:
                          "5px",
                        boxSizing:
                          "border-box",
                      }}
                    />

                    <input
                      type="number"
                      value={
                        editingPrice
                      }
                      onChange={(e) =>
                        setEditingPrice(
                          e.target.value
                        )
                      }
                      style={{
                        width:
                          "100%",
                        padding:
                          "8px",
                        marginBottom:
                          "5px",
                        boxSizing:
                          "border-box",
                      }}
                    />

                    <select
                      value={
                        editingCategory
                      }
                      onChange={(e) =>
                        setEditingCategory(
                          e.target.value
                        )
                      }
                      style={{
                        width:
                          "100%",
                        padding:
                          "8px",
                        marginBottom:
                          "5px",
                      }}
                    >
                      <option value="ألبان">
                        ألبان
                      </option>
                      <option value="بقالة">
                        بقالة
                      </option>
                      <option value="مشروبات">
                        مشروبات
                      </option>
                      <option value="حلويات">
                        حلويات
                      </option>
                    </select>

                    <input
                      value={
                        editingEmoji
                      }
                      onChange={(e) =>
                        setEditingEmoji(
                          e.target.value
                        )
                      }
                      style={{
                        width:
                          "100%",
                        padding:
                          "8px",
                        marginBottom:
                          "8px",
                        boxSizing:
                          "border-box",
                      }}
                    />

                    <button
                      onClick={
                        saveProductEdit
                      }
                    >
                      💾 حفظ
                    </button>

                    <button
                      onClick={
                        cancelEditing
                      }
                      style={{
                        marginRight:
                          "8px",
                      }}
                    >
                      إلغاء
                    </button>
                  </>
                ) : (
                  <>
                    <strong>
                      {
                        product.emoji
                      }{" "}
                      {
                        product.name
                      }
                    </strong>

                    <div>
                      {
                        product.price
                      }{" "}
                      جنيه —{" "}
                      {
                        product.category
                      }
                    </div>

                    <button
                      onClick={() =>
                        startEditing(
                          product
                        )
                      }
                      style={{
                        marginTop:
                          "8px",
                      }}
                    >
                      ✏️ تعديل
                    </button>

                    <button
                      onClick={() =>
                        deleteProduct(
                          product
                        )
                      }
                      style={{
                        marginRight:
                          "8px",
                      }}
                    >
                      🗑️ حذف
                    </button>
                  </>
                )}
              </div>
            )
          )}
        </div>

        <div
          style={{
            padding:
              "20px",
            margin:
              "20px 0",
            border:
              "1px solid #ddd",
            borderRadius:
              "10px",
          }}
        >
          <h2>
            📦 الطلبات
          </h2>

          {orders.length ===
          0 ? (
            <p>
              لا توجد طلبات حتى الآن.
            </p>
          ) : (
            orders.map(
              (order) => (
                <div
                  key={
                    order.id
                  }
                  style={{
                    padding:
                      "15px",
                    marginBottom:
                      "12px",
                    border:
                      "1px solid #eee",
                    borderRadius:
                      "8px",
                  }}
                >
                  <strong>
                    👤{" "}
                    {
                      order.customerName
                    }
                  </strong>

                  <p>
                    📱{" "}
                    {
                      order.customerPhone
                    }
                  </p>

                  <p>
                    🏠{" "}
                    {
                      order.address
                    }
                  </p>

                  <p>
                    📍{" "}
                    {
                      order.area
                    }
                  </p>

                  {order.notes && (
                    <p>
                      📝{" "}
                      {
                        order.notes
                      }
                    </p>
                  )}

                  <strong>
                    💰 الإجمالي:{" "}
                    {
                      order.total
                    }{" "}
                    جنيه
                  </strong>

                  <div
                    style={{
                      marginTop:
                        "10px",
                    }}
                  >
                    {order.items?.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={
                            String(
                              item.id
                            ) +
                            "-" +
                            index
                          }
                        >
                          {
                            item.name
                          }{" "}
                          ×{" "}
                          {
                            item.quantity
                          }{" "}
                          ={" "}
                          {
                            item.total
                          }{" "}
                          جنيه
                        </div>
                      )
                    )}
                  </div>

                  <small>
                    {
                      order.createdAt
                    }
                  </small>
                </div>
              )
            )
          )}
        </div>

        <button
          onClick={
            adminLogout
          }
        >
          🚪 تسجيل الخروج
        </button>
      </div>
    )
  }

  return (
    <div
      dir="rtl"
      className="app"
    >
      <header className="header">
        <div>
          <h1>
            🛒مراعينا
          </h1>

          <button
            onClick={() => {
              console.log(
                "🔔 BUTTON CLICKED"
              )
              enableNotifications()
            }}
          >
            🔔 تفعيل الإشعارات
          </button>

          <p>
            كل احتياجات بيتك في مكان واحد
          </p>
        </div>

        <button
          className="cart"
          onClick={() =>
            setShowCart(
              !showCart
            )
          }
        >
          🛍️ السلة (
          {
            totalItems
          })
        </button>
      </header>

      <main className="container">
        <input
          className="search"
          type="text"
          placeholder="ابحث عن منتج..."
          value={
            search
          }
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <h2>
          الأقسام
        </h2>

        <div className="categories">
          <button
            className={
              selectedCategory ===
              "الكل"
                ? "active-category"
                : ""
            }
            onClick={() =>
              setSelectedCategory(
                "الكل"
              )
            }
          >
            🛒 الكل
          </button>

          <button
            className={
              selectedCategory ===
              "ألبان"
                ? "active-category"
                : ""
            }
            onClick={() =>
              setSelectedCategory(
                "ألبان"
              )
            }
          >
            🥛 ألبان
          </button>

          <button
            className={
              selectedCategory ===
              "بقالة"
                ? "active-category"
                : ""
            }
            onClick={() =>
              setSelectedCategory(
                "بقالة"
              )
            }
          >
            🥫 بقالة
          </button>

          <button
            className={
              selectedCategory ===
              "مشروبات"
                ? "active-category"
                : ""
            }
            onClick={() =>
              setSelectedCategory(
                "مشروبات"
              )
            }
          >
            🥤 مشروبات
          </button>

          <button
            className={
              selectedCategory ===
              "حلويات"
                ? "active-category"
                : ""
            }
            onClick={() =>
              setSelectedCategory(
                "حلويات"
              )
            }
          >
            🍫 حلويات
          </button>
        </div>

        {showCart && (
          <div className="cart-box">
            <h2>
              🛍️ سلة المشتريات
            </h2>

            {totalItems ===
            0 ? (
              <p>
                السلة فاضية
              </p>
            ) : (
              <>
                {products.map(
                  (product) => {
                    const quantity =
                      Number(
                        cart[
                          product.id
                        ] || 0
                      )

                    if (
                      quantity <= 0
                    ) {
                      return null
                    }

                    return (
                      <div
                        key={
                          product.id
                        }
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          padding:
                            "12px 0",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        <div>
                          <strong>
                            {
                              product.emoji
                            }{" "}
                            {
                              product.name
                            }
                          </strong>

                          <div>
                            {
                              quantity
                            }{" "}
                            ×{" "}
                            {
                              product.price
                            }{" "}
                            جنيه
                          </div>
                        </div>

                        <div>
                          <button
                            onClick={() =>
                              decrease(
                                product
                              )
                            }
                          >
                            −
                          </button>

                          <span
                            style={{
                              margin:
                                "0 12px",
                            }}
                          >
                            {
                              quantity
                            }
                          </span>

                          <button
                            onClick={() =>
                              addToCart(
                                product
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )
                  }
                )}

                <h2>
                  الإجمالي:{" "}
                  {
                    totalPrice
                  }{" "}
                  جنيه
                </h2>

                <div className="customer-form">
                  <h3>
                    📦 بيانات التوصيل
                  </h3>

                  <input
                    type="text"
                    placeholder="الاسم"
                    value={
                      customerName
                    }
                    onChange={(e) =>
                      setCustomerName(
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="tel"
                    placeholder="رقم الموبايل"
                    value={
                      customerPhone
                    }
                    onChange={(e) =>
                      setCustomerPhone(
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="text"
                    value="برية لاصيفر"
                    readOnly
                  />

                  <input
                    type="text"
                    placeholder="العنوان بالتفصيل"
                    value={
                      customerAddress
                    }
                    onChange={(e) =>
                      setCustomerAddress(
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    placeholder="ملاحظات للطلب (اختياري)"
                    value={
                      customerNotes
                    }
                    onChange={(e) =>
                      setCustomerNotes(
                        e.target.value
                      )
                    }
                  />
                </div>

                <button
                  className="add"
                  onClick={
                    sendWhatsApp
                  }
                >
                  📱 إرسال الطلب على واتساب
                </button>
              </>
            )}
          </div>
        )}

        <h2>
          المنتجات
        </h2>

        <div className="products">
          {filteredProducts.map(
            (product) => (
              <div
                className="product"
                key={
                  product.id
                }
              >
                <div className="product-image">
                  {product.image ? (
                    <img
                      src={
                        product.image
                      }
                      alt={
                        product.name
                      }
                    />
                  ) : (
                    product.emoji
                  )}
                </div>

                <h3>
                  {
                    product.name
                  }
                </h3>

                <small>
                  {
                    product.category
                  }
                </small>

                <p>
                  {
                    product.price
                  }{" "}
                  جنيه
                </p>

                <button
                  className="add"
                  onClick={() =>
                    addToCart(
                      product
                    )
                  }
                >
                  أضف للسلة
                </button>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  )
}

export default App
