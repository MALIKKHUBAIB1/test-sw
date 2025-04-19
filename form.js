import { saveFormToIndexDb } from "./Indexdb";
console.log("connetced ");
const btn = document.getElementById("btn");

btn.addEventListener("click", async (e) => {
  e.preventDefault();

  let userName = document.getElementById("name")?.value;
  const email = document.getElementById("email")?.value;
  const message = document.getElementById("message")?.value;
  console.log(userName, email, message);

  if (!navigator.onLine) {
    await saveFormToIndexDb({ id: Date.now(), name: userName, email, message });
    await registerBackgroundSync();
    alert("you are offline ");
    return;
  }

  try {
    const res = await fetch(
      "https://pwa-service-workder-default-rtdb.firebaseio.com/formData.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: userName, email, message }),
      }
    );

    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    const responseData = await res.json();
    alert("Form submitted successfully!");
    console.log("Response:", responseData);
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
});

async function registerBackgroundSync() {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.sync.register("sync-from");
      console.log("Background Sync registered ✅");
    } catch (err) {
      console.error("Background sync registration failed ❌", err);
    }
  } else {
    console.warn("Background Sync not supported on this browser");
  }
}
