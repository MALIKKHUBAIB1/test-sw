if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/test-sw/sw.js", { type: "module" })
    .then(() => {
      console.log("✅ Service Worker registered successfully");
    })
    .catch((err) => {
      console.error("❌ Service Worker registration failed:", err);
    });
}

if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("✅ Notifications enabled");
    } else {
      console.log("❌ Notifications denied");
    }
  });
}

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches
//       .open(cahcheName)
//       .then((cache) => {
//         return cache.addAll(cacheStaticFiles);
//       })
//       .catch((err) => {
//         console.log(err);
//       })
//   );
// });
