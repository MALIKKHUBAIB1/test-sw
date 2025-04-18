import {
  clearDataBase,
  delteFromDB,
  getFormData,
  insertProduct,
} from "./utility/Indexdb";

const STATIC_FILES = [
  "index.html",
  "index.css",
  "index.js",
  "sw.js",
  "offline.html",
];
const STATIC_CACHE_NAME = "static-v5";
const DYNAMIC_CACHE_NAME = "products";

let API_URL = [
  "https://dummyjson.com/products",
  "https://pwa-service-workder-default-rtdb.firebaseio.com/formData.json",
];

self.addEventListener("install", (event) => {
  console.log("service worker installed successfully", event);
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_FILES);
      })
      .catch((err) => {
        console.log("service worker not installed sucessfully ", err);
      })
  );
});

self.addEventListener("activate", (event) => {
  console.log("active event fire ", event);
  event.waitUntil(
    caches.keys().then((cache) => {
      return Promise.all(
        cache.map((key) => {
          if (key !== STATIC_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// not the good ways to handle request first make api call and then cache the data in the
//  cache and then if the user is offline then fetch the data from the cache
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-from") {
    console.log("🔄 Sync-from triggered by browser");

    event.waitUntil(
      getFormData("formdb").then(async (data) => {
        for (let item of data) {
          try {
            const res = await fetch(
              "https://pwa-service-workder-default-rtdb.firebaseio.com/formData.json",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: item?.name,
                  email: item.email,
                  message: item.message,
                }),
              }
            );

            if (res.ok) {
              await delteFromDB(item.id);
              console.log("✔️ Synced and deleted item:", item.id);

              // ✅ Show notification that sync was successful
              self.registration.showNotification("✅ Form Synced", {
                body: `Message from ${item.name} synced successfully!`,
                icon: "https://cdn-icons-png.flaticon.com/512/8766/8766948.png", // You can customize this path
                // badge: "/icons/badge.png", // Optional small icon
              });
            }
          } catch (err) {
            console.error("❌ Failed to sync item:", item.id, err);
          }
        }
      })
    );
  }
});

self.addEventListener("fetch", (event) => {
  if (API_URL.some((url) => event.request.url.startsWith(url))) {
    event.respondWith(
      fetch(event.request)
        .then((networkRes) => {
          const cloneData = networkRes.clone();
          return cloneData.json().then((data) => {
            if (event.request.url.includes("products")) {
              clearDataBase(DYNAMIC_CACHE_NAME).then(() => {
                insertProduct(DYNAMIC_CACHE_NAME, data.products)
                  .then(() => console.log("Products inserted successfully"))
                  .catch((err) => console.log("Insert error:", err));
              });
            }
            return networkRes;
          });
        })
        .catch((err) => {
          console.log("API request failed:", err);
          return caches.match(event.request);
        })
    );
  } else {
    event.respondWith(
      fetch(event.request)
        .then((networkRes) => {
          return caches.open(STATIC_CACHE_NAME).then((cache) => {
            if (event.request.method === "GET") {
              cache.put(event.request, networkRes.clone());
            }
            return networkRes;
          });
        })
        .catch(() => {
          console.log("Returning from cache...");
          return caches.match(event.request);
        })
    );
  }
});
