// Fine-Art Studio Dynamic Categories Service (IndexedDB + LocalStorage with Reactive Sync)

export const DEFAULT_CATEGORIES = [
  { id: 'cat-events', name: 'Events', slug: 'events' },
  { id: 'cat-concerts', name: 'Concerts', slug: 'concerts' },
  { id: 'cat-sports', name: 'Sports', slug: 'sports' },
  { id: 'cat-graduations', name: 'Graduations', slug: 'graduations' },
  { id: 'cat-360-cinematic', name: '360 Cinematic', slug: '360-cinematic' }
];

const STORAGE_KEY = 'captura_categories_list_v2';
const DB_NAME = 'captura_cms_db';
const DB_VERSION = 1;
const STORE_NAME = 'cms_data';

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all active categories. Only returns categories defined/kept by user.
 */
export function getCategories() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('LocalStorage read categories error', err);
  }

  // First time initialization
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  } catch (_) {}
  return [...DEFAULT_CATEGORIES];
}

/**
 * Load async from Backend API first, with IndexedDB and localStorage fallback
 */
export async function getCategoriesAsync() {
  const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

  // 1. Try Backend API first with fast 600ms timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600);
    const res = await fetch(`${apiBase}/content/categories`, { cache: 'no-cache', signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const result = await res.json();
      if (result?.success && Array.isArray(result?.data)) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
        } catch (_) {}
        return result.data;
      }
    }
  } catch (err) {}

  // 2. Fallback to IndexedDB / localStorage
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(STORAGE_KEY);

    return new Promise((resolve) => {
      req.onsuccess = () => {
        if (req.result && Array.isArray(req.result)) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(req.result));
          } catch (_) {}
          resolve(req.result);
        } else {
          resolve(getCategories());
        }
      };
      req.onerror = () => resolve(getCategories());
    });
  } catch (err) {
    return getCategories();
  }
}

/**
 * Save categories list and trigger cross-component reactive sync
 */
export function saveCategories(categories) {
  const cleanList = Array.isArray(categories) ? categories : [];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanList));
  } catch (err) {
    console.warn('LocalStorage save categories error', err);
  }

  openIndexedDB().then((db) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(cleanList, STORAGE_KEY);
  }).catch((err) => {
    console.warn('IndexedDB save categories failed', err);
  });

  // Sync to Backend API
  try {
    const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
    fetch(`${apiBase}/content/categories`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanList),
    }).catch((err) => {
      console.warn('Failed to sync categories to backend API:', err);
    });
  } catch (_) {}

  try {
    window.dispatchEvent(new CustomEvent('captura_categories_updated', { detail: cleanList }));
    localStorage.setItem('captura_categories_ping', Date.now().toString());
  } catch (_) {}

  return cleanList;
}

/**
 * Add a new category to the system
 */
export function addCategory(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) throw new Error('Category name cannot be empty');

  const current = getCategories();
  const exists = current.some(c => c.name.toLowerCase() === trimmed.toLowerCase());
  if (exists) {
    throw new Error(`Category "${trimmed}" already exists.`);
  }

  const slug = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newCat = {
    id: `cat-${Date.now()}`,
    name: trimmed,
    slug: slug || `category-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  const updated = [...current, newCat];
  saveCategories(updated);
  return newCat;
}

/**
 * Rename or update an existing category
 */
export function updateCategory(id, newName) {
  const trimmed = (newName || '').trim();
  if (!trimmed) throw new Error('Category name cannot be empty');

  const current = getCategories();
  const exists = current.some(c => c.id !== id && c.name.toLowerCase() === trimmed.toLowerCase());
  if (exists) {
    throw new Error(`Another category named "${trimmed}" already exists.`);
  }

  const slug = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const updated = current.map(c => {
    if (c.id === id) {
      return { ...c, name: trimmed, slug };
    }
    return c;
  });

  saveCategories(updated);
  return updated.find(c => c.id === id);
}

/**
 * Delete a category by ID (User can delete ANY category, including Weddings)
 */
export function deleteCategory(id) {
  const current = getCategories();
  const filtered = current.filter(c => c.id !== id);
  saveCategories(filtered);
  return filtered;
}

/**
 * Reorder categories and persist
 */
export function reorderCategories(newCategories) {
  if (Array.isArray(newCategories)) {
    saveCategories(newCategories);
    return newCategories;
  }
  return getCategories();
}

/**
 * Reset categories to default initial set
 */
export function resetCategories() {
  saveCategories(DEFAULT_CATEGORIES);
  return DEFAULT_CATEGORIES;
}
