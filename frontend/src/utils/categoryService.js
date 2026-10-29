// Fine-Art Studio Dynamic Categories Service (IndexedDB + LocalStorage with Reactive Sync)

export const DEFAULT_CATEGORIES = [
  { id: 'cat-weddings', name: 'Weddings', slug: 'weddings' },
  { id: 'cat-preshoot', name: 'Pre-Shoot', slug: 'pre-shoot' },
  { id: 'cat-graduations', name: 'Graduations', slug: 'graduations' },
  { id: 'cat-events', name: 'Events', slug: 'events' },
  { id: 'cat-commercial', name: 'Commercial', slug: 'commercial' },
  { id: 'cat-portraits', name: 'Portraits', slug: 'portraits' }
];

const STORAGE_KEY = 'captura_categories_list_v1';
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
 * Load async from IndexedDB if available and sync cache
 */
export async function getCategoriesAsync() {
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
 * Reset categories to default initial set
 */
export function resetCategories() {
  saveCategories(DEFAULT_CATEGORIES);
  return DEFAULT_CATEGORIES;
}
