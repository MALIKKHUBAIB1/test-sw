import { openDB } from "idb";
const open = openDB("products", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("products")) {
      db.createObjectStore("products", { keyPath: "id" });
    }
    return db;
  },
});

const openformDb = openDB("formdb", 3, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("fromdb")) {
      db.createObjectStore("formdb", { keyPath: "id" });
    }
    return db;
  },
});

async function saveFormToIndexDb(data) {
  const db = await openformDb;
  const txc = db.transaction("formdb", "readwrite");
  const store = txc.objectStore("formdb");
  store.add(data);
  await txc.done;
}

async function getFormData(dbName, id) {
  const db = await openformDb;
  const txc = await db.transaction(dbName, "readwrite");
  const store = await txc.objectStore("formdb");
  const formData = await store.getAll();
  return formData;
}

async function delteFromDB(id) {
  const db = await openformDb;
  const txc = db.transaction("formdb", "readwrite");
  const store = txc.objectStore("formdb");
  store.delete(id);
  await txc.done;
}

async function clearDataBase(dbName) {
  const db = await open;
  const tc = await db.transaction(dbName, "readwrite");
  const store = await tc.objectStore(dbName);
  await store.clear();
  await tc.done;
}

async function getAllProducts(dbName) {
  const db = await open;
  const txc = db.transaction(dbName, "readonly");
  const store = txc.objectStore(dbName);
  const products = await store.getAll();
  return products;
}

async function insertProduct(dbName, data) {
  try {
    const db = await open; // Open the database
    const tx = db.transaction(dbName, "readwrite"); // Start a transaction
    const store = tx.objectStore(dbName);

    // Insert each item into the object store
    data.forEach((item) => {
      store.put(item); // Store the entire item object
    });

    // Ensure the transaction is completed
    await tx.done; // Wait until the transaction is done
    console.log("Data inserted successfully!");
  } catch (err) {
    console.error("Error inserting data:", err); // Log any error
  }
}

async function getSingleProduct(dbName, id) {
  const db = await open;
  const txc = db.transaction(dbName, "readonly");
  const store = txc.objectStore(dbName);
  return store.get(id);
}
export {
  getAllProducts,
  insertProduct,
  clearDataBase,
  saveFormToIndexDb,
  getFormData,
  delteFromDB
};
