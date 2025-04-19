// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/sw.js", { type: "module" })
//     .then(() => {
//       console.log("✅ Service Worker registered successfully");
//     })
//     .catch((err) => {
//       console.error("❌ Service Worker registration failed:", err);
//     });
// }

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        type: "classic", // Remove 'module' if not needed
      });
      console.log("SW registered:", registration);
    } catch (error) {
      console.error("SW registration failed:", error);
    }
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
