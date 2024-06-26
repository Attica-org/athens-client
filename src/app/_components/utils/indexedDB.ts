const DB_NAME = 'TabDatabase';
const STORE_NAME = 'Tabs';

interface Tab {
  id: string;
  created: Date;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

function transactionComplete(transaction: IDBTransaction): Promise<void> {
  const AssignTransaction = Object.assign(transaction);
  return new Promise((resolve, reject) => {
    AssignTransaction.oncomplete = () => {
      resolve();
    };

    AssignTransaction.onerror = (event: Event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };

    AssignTransaction.onabort = (event: Event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export async function saveTabId(tabId: string): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  const tab = { id: tabId, created: new Date() };

  store.put(tab);

  return transactionComplete(transaction);
}

export async function getTabIds(): Promise<Tab[]> {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function deleteTabId(tabId: string): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  store.delete(tabId);

  return transactionComplete(transaction);
}
