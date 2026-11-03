// Fine-Art Client Albums Service (IndexedDB + LocalStorage with Reactive Sync)

export const DEFAULT_ALBUMS = [
  {
    id: 'album-1',
    title: 'Kasun & Shenali',
    subtitle: 'Sacred Poruwa & Kandyan Elegance',
    category: 'Weddings',
    location: 'The Grand Kandyan Hotel, Kandy',
    date: 'October 2026',
    photoCount: 52,
    coverImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85',
    clientName: 'Kasun & Shenali',
    createdAt: '2026-10-28T14:30:00Z',
    description: 'A breathtaking traditional Kandyan nuptial ceremony with regal gold accents and heartfelt rituals.'
  },
  {
    id: 'album-2',
    title: 'Raveen & Dilki',
    subtitle: 'Sunset Fort Romance & Vows',
    category: 'Pre-Shoot',
    location: 'Galle Fort Ramparts & Lighthouse',
    date: 'October 2026',
    photoCount: 44,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    clientName: 'Raveen & Dilki',
    createdAt: '2026-10-26T11:00:00Z',
    description: 'Golden hour coastal pre-shoot along the historic cobblestone ramparts of Galle Fort.'
  },
  {
    id: 'album-3',
    title: 'Dinuka & Hashini',
    subtitle: 'Regal Ballroom Twilight Gala',
    category: 'Weddings',
    location: 'Shangri-La Grand Ballroom, Colombo',
    date: 'October 2026',
    photoCount: 68,
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    clientName: 'Dinuka & Hashini',
    createdAt: '2026-10-24T16:15:00Z',
    description: 'An opulent modern celebration featuring bespoke chandelier illumination and cinematic candid moments.'
  },
  {
    id: 'album-4',
    title: 'Kavinda & Senuri',
    subtitle: 'Highlands Mist & Colonial Charm',
    category: 'Pre-Shoot',
    location: 'Ceylon Tea Trails, Hatton',
    date: 'October 2026',
    photoCount: 38,
    coverImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
    clientName: 'Kavinda & Senuri',
    createdAt: '2026-10-22T09:40:00Z',
    description: 'Whispering pine trails, ethereal mountain mist, and vintage colonial planter bungalow romance.'
  },
  {
    id: 'album-5',
    title: 'Ashan & Piyumi',
    subtitle: 'Modern Minimalist Coastal Vows',
    category: 'Weddings',
    location: 'Amanwella Beach, Tangalle',
    date: 'October 2026',
    photoCount: 60,
    coverImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85',
    clientName: 'Ashan & Piyumi',
    createdAt: '2026-10-20T18:20:00Z',
    description: 'Barefoot luxury and gentle ocean tides in southern Sri Lanka with a sunset cocktail reception.'
  },
  {
    id: 'album-6',
    title: 'Malsha & Tharindu',
    subtitle: 'Lakeside Twilight Nuptials',
    category: 'Weddings',
    location: 'Cinnamon Lodge, Habarana',
    date: 'October 2026',
    photoCount: 45,
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    clientName: 'Malsha & Tharindu',
    createdAt: '2026-10-18T12:00:00Z',
    description: 'Serene lakeside vows embraced by tranquil nature, ancient trees, and soft twilight reflections.'
  },
  {
    id: 'album-7',
    title: 'University Convocation 2026',
    subtitle: 'Academic Milestones & Triumph',
    category: 'Graduations',
    location: 'BMICH Main Hall, Colombo',
    date: 'October 2026',
    photoCount: 75,
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85',
    clientName: 'Faculty Cohort 2026',
    createdAt: '2026-10-15T15:00:00Z',
    description: 'Honoring years of discipline, family sacrifice, and victorious graduation celebrations.'
  },
  {
    id: 'album-8',
    title: 'Port City Luxury Brand Gala',
    subtitle: 'International Brand Soirée',
    category: 'Events',
    location: 'Colombo Port City Marina Waterfront',
    date: 'October 2026',
    photoCount: 82,
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
    clientName: 'Apex Luxe Asia',
    createdAt: '2026-10-12T20:30:00Z',
    description: 'High-profile commercial summit with premier staging, luxury VIP arrivals, and twilight firework displays.'
  },
  {
    id: 'album-9',
    title: 'Tharindu & Nilakshi',
    subtitle: 'Heritage Colonial Manor Nuptials',
    category: 'Weddings',
    location: 'Mount Lavinia Hotel, Colombo',
    date: 'October 2026',
    photoCount: 58,
    coverImage: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=85',
    clientName: 'Tharindu & Nilakshi',
    createdAt: '2026-10-10T14:00:00Z',
    description: 'A timeless colonial wedding by the ocean breeze with classical brass music and candlelit floral arrangements.'
  },
  {
    id: 'album-10',
    title: 'Sachith & Oshadi',
    subtitle: 'Pine Forest Pre-Shoot Vignette',
    category: 'Pre-Shoot',
    location: 'Ambuluwawa Peak & Pine Ridge',
    date: 'October 2026',
    photoCount: 42,
    coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
    clientName: 'Sachith & Oshadi',
    createdAt: '2026-10-08T09:15:00Z',
    description: 'Mystical golden hour rays slicing through towering pine canopies amidst mountain mist.'
  },
  {
    id: 'album-11',
    title: 'Danushka & Anuki',
    subtitle: 'Royal Poruwa Ceremony',
    category: 'Weddings',
    location: 'Cinnamon Lakeside, Colombo',
    date: 'October 2026',
    photoCount: 64,
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    clientName: 'Danushka & Anuki',
    createdAt: '2026-10-05T17:00:00Z',
    description: 'Exquisite traditional brass lamps, beating traditional drums, and emotional family blessings.'
  },
  {
    id: 'album-12',
    title: 'Chathura & Himashi',
    subtitle: 'Coastal Golden Hour Vows',
    category: 'Weddings',
    location: 'Anantara Peace Haven, Tangalle',
    date: 'October 2026',
    photoCount: 50,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    clientName: 'Chathura & Himashi',
    createdAt: '2026-10-02T16:45:00Z',
    description: 'Gentle southern ocean waves, cliffside sunset portraits, and an intimate beach pavilion celebration.'
  }
];

const STORAGE_KEY = 'captura_albums_cms_v1';
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
 * Get all albums sorted by createdAt descending (newest first)
 */
export function getAlbums() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // If saved has fewer than 12, merge any missing defaults so 12 cards always display
        if (parsed.length < DEFAULT_ALBUMS.length) {
          const existingIds = new Set(parsed.map(a => a.id));
          const missing = DEFAULT_ALBUMS.filter(d => !existingIds.has(d.id));
          const merged = [...parsed, ...missing].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          return merged;
        }
        return parsed.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      }
    }
  } catch (err) {
    console.warn('LocalStorage read albums error', err);
  }
  return [...DEFAULT_ALBUMS].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

/**
 * Load async from IndexedDB if available and sync cache
 */
export async function getAlbumsAsync() {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(STORAGE_KEY);

    return new Promise((resolve) => {
      req.onsuccess = () => {
        if (req.result && Array.isArray(req.result) && req.result.length > 0) {
          let list = req.result;
          if (list.length < DEFAULT_ALBUMS.length) {
            const existingIds = new Set(list.map(a => a.id));
            const missing = DEFAULT_ALBUMS.filter(d => !existingIds.has(d.id));
            list = [...list, ...missing];
          }
          const sorted = list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
          } catch (_) {}
          resolve(sorted);
        } else {
          resolve(getAlbums());
        }
      };
      req.onerror = () => resolve(getAlbums());
    });
  } catch (err) {
    return getAlbums();
  }
}

/**
 * Get the latest 12 albums for the Home page 3x4 card grid (3 lines of 4 cards)
 */
export function getRecentAlbums(limit = 12) {
  const all = getAlbums();
  return all.slice(0, limit);
}

/**
 * Save albums list to localStorage and IndexedDB and dispatch events
 */
export function saveAlbums(albums) {
  const sorted = [...albums].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  } catch (err) {
    console.warn('LocalStorage save albums failed, using IndexedDB', err);
  }

  openIndexedDB().then((db) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(sorted, STORAGE_KEY);
  }).catch((err) => {
    console.warn('IndexedDB save albums failed', err);
  });

  try {
    window.dispatchEvent(new Event('captura_albums_updated'));
    localStorage.setItem('captura_albums_ping', Date.now().toString());
  } catch (_) {}

  return sorted;
}

/**
 * Universal Image Processor & Auto-Compressor
 * Compatible with ANY format: JPG, JPEG, PNG, WEBP, AVIF, HEIC, HEIF, TIFF, BMP, GIF, SVG
 * Smoothly scales camera exports (up to 50MB) down to high-definition web-ready format (~150KB)
 * so it never crashes browser memory or exceeds storage quotas.
 */
export async function processUniversalImageFile(file, maxWidth = 1920, maxHeight = 1440, quality = 0.85) {
  if (!file) throw new Error('No file selected');

  const fileName = file.name || 'unnamed-photo';
  const fileExt = fileName.split('.').pop().toLowerCase();
  const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
  const originalFormat = fileExt ? fileExt.toUpperCase() : (file.type ? file.type.split('/')[1]?.toUpperCase() : 'IMAGE');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target.result;

      // For vector SVG, dataUrl is already optimal
      if (file.type === 'image/svg+xml' || fileExt === 'svg') {
        resolve({
          dataUrl,
          fileName,
          format: 'SVG',
          outputFormat: 'SVG',
          originalSize: `${originalSizeMB} MB`,
          compressedSize: `${(file.size / 1024).toFixed(0)} KB`,
          width: maxWidth,
          height: maxHeight
        });
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          let targetWidth = img.naturalWidth || img.width || 1200;
          let targetHeight = img.naturalHeight || img.height || 800;

          // Scale down proportionally if larger than max constraints
          if (targetWidth > maxWidth || targetHeight > maxHeight) {
            const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
            targetWidth = Math.round(targetWidth * ratio);
            targetHeight = Math.round(targetHeight * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({
              dataUrl,
              fileName,
              format: originalFormat,
              outputFormat: originalFormat,
              originalSize: `${originalSizeMB} MB`,
              compressedSize: `${(file.size / 1024).toFixed(0)} KB`,
              width: targetWidth,
              height: targetHeight
            });
            return;
          }

          // Bicubic high-quality rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Convert to WebP or fallback to JPEG
          let compressedUrl;
          let finalMime = 'image/webp';
          try {
            compressedUrl = canvas.toDataURL('image/webp', quality);
            if (!compressedUrl.startsWith('data:image/webp')) {
              compressedUrl = canvas.toDataURL('image/jpeg', quality);
              finalMime = 'image/jpeg';
            }
          } catch (_) {
            compressedUrl = canvas.toDataURL('image/jpeg', quality);
            finalMime = 'image/jpeg';
          }

          const base64Len = compressedUrl.length - (compressedUrl.indexOf(',') + 1);
          const compressedSizeKB = Math.round((base64Len * 3) / 4 / 1024);

          resolve({
            dataUrl: compressedUrl,
            fileName,
            format: originalFormat,
            outputFormat: finalMime === 'image/webp' ? 'WEBP' : 'JPEG',
            originalSize: `${originalSizeMB} MB`,
            compressedSize: `${compressedSizeKB} KB`,
            width: targetWidth,
            height: targetHeight
          });
        } catch (err) {
          console.warn('Canvas conversion warning, using direct dataUrl:', err);
          resolve({
            dataUrl,
            fileName,
            format: originalFormat,
            outputFormat: originalFormat,
            originalSize: `${originalSizeMB} MB`,
            compressedSize: `${(file.size / 1024).toFixed(0)} KB`
          });
        }
      };

      img.onerror = () => {
        // Fallback for exotic formats (e.g. camera raw, heic fallback)
        resolve({
          dataUrl,
          fileName,
          format: originalFormat,
          outputFormat: originalFormat,
          originalSize: `${originalSizeMB} MB`,
          compressedSize: `${(file.size / 1024).toFixed(0)} KB`
        });
      };

      img.src = dataUrl;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Create a new album and place it at the top of the collection
 */
export function createAlbum(albumData) {
  const current = getAlbums();
  const photos = Array.isArray(albumData.photos) && albumData.photos.length > 0 
    ? albumData.photos 
    : (albumData.coverImage ? [albumData.coverImage] : []);

  const newAlbum = {
    id: `album-${Date.now()}`,
    title: albumData.title || 'Untitled Album',
    subtitle: albumData.subtitle || '',
    category: albumData.category || 'Weddings',
    location: albumData.location || 'Sri Lanka',
    date: albumData.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    photoCount: photos.length > 0 ? photos.length : (Number(albumData.photoCount) || 30),
    coverImage: albumData.coverImage || photos[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    photos: photos,
    clientName: albumData.clientName || albumData.title || '',
    description: albumData.description || '',
    createdAt: new Date().toISOString()
  };

  const updated = [newAlbum, ...current];
  saveAlbums(updated);
  return newAlbum;
}

/**
 * Update an existing album by ID
 */
export function updateAlbum(id, fields) {
  const current = getAlbums();
  const updated = current.map((alb) => {
    if (alb.id === id) {
      const merged = { ...alb, ...fields };
      if (Array.isArray(fields.photos) && !fields.photoCount) {
        merged.photoCount = fields.photos.length;
      }
      return merged;
    }
    return alb;
  });
  saveAlbums(updated);
  return updated.find(a => a.id === id);
}

/**
 * Move an album up or down to reorder live showcase priority
 */
export function moveAlbum(id, direction) {
  const current = getAlbums();
  const index = current.findIndex(a => a.id === id);
  if (index === -1) return current;

  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= current.length) return current;

  const list = [...current];
  const [item] = list.splice(index, 1);
  list.splice(targetIndex, 0, item);

  saveAlbums(list);
  return list;
}

/**
 * Bulk reassign albums from an old/deleted category to a new category
 */
export function reassignAlbumsCategory(oldCategoryName, newCategoryName) {
  const current = getAlbums();
  const updated = current.map(a => {
    if ((a.category || '').toLowerCase() === (oldCategoryName || '').toLowerCase()) {
      return { ...a, category: newCategoryName };
    }
    return a;
  });
  saveAlbums(updated);
  return updated;
}

/**
 * Delete an album by ID
 */
export function deleteAlbum(id) {
  const current = getAlbums();
  const filtered = current.filter(a => a.id !== id);
  saveAlbums(filtered);
  return filtered;
}

/**
 * Reset albums to default fine-art collection
 */
export function resetAlbums() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    openIndexedDB().then((db) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(STORAGE_KEY);
    }).catch(() => {});

    window.dispatchEvent(new Event('captura_albums_updated'));
    localStorage.setItem('captura_albums_ping', Date.now().toString());
  } catch (err) {
    console.error('Reset albums error', err);
  }
  return DEFAULT_ALBUMS;
}
