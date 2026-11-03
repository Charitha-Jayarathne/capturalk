// Captura LK - About Us Page Content Service
// Supports LocalStorage and IndexedDB persistence with live event dispatching.

export const DEFAULT_ABOUT_CONTENT = {
  header: {
    badge: 'OUR HERITAGE & ARTISTRY',
    title: 'The Artisans Behind Captura LK',
    subtitle: 'Preserving Sri Lanka’s most distinguished nuptials, intimate celebrations, and cultural heritage with fine-art cinematic poise.',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=90',
  },
  sections: [
    {
      id: 'section-heritage',
      title: 'Our Heritage & Philosophy',
      tagline: 'CAPTURING SOULS, CRAFTING TIMELESS HEIRLOOMS',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=90',
      imagePosition: 'left', // 'left' or 'right'
      quote: '“In every glance, every folded palm during the Poruwa ritual, there exists a sacred stillness that deserves to be immortalized as fine art.”',
      richContent: '<p>Founded on a reverence for the grandeur and intimacy of Sri Lankan weddings, <strong>Captura LK</strong> is a premier fine-art photography and cinematography atelier. We approach each celebration not merely as documentarians, but as artists commissioned to translate raw emotion into enduring heirlooms.</p><p>From the sacred rhythms of Kandyan traditions to sun-drenched coastal celebrations in Galle, our lens remains unobtrusive, attuned to whispered vows, tear-kissed embraces, and the majestic tapestry of love.</p>',
      stats: [
        { label: 'Curated Nuptials', value: '450+' },
        { label: 'Years of Heritage', value: '8+' },
        { label: 'Master Guild Awards', value: '14' }
      ]
    },
    {
      id: 'section-aesthetic',
      title: 'The Master Eye & Aesthetic',
      tagline: 'LIGHT, SHADOW & EMOTIONAL REVERENCE',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=90',
      imagePosition: 'right', // alternates!
      quote: '“True luxury in imagery is not excessive staging—it is the quiet confidence of natural light and sincere human connection.”',
      richContent: '<p>Our aesthetic draws deep inspiration from classical European portraiture, cinematic color grading, and the natural romance of Ceylon’s tropical light. We reject fleeting trends in favor of deep, rich tonalities that look as breathtaking fifty years from now as they do today.</p><p>Every frame is composed with intentionality—balancing architectural grandeur with the tender vulnerability of fleeting moments that happen between the poses.</p>',
      stats: [
        { label: 'Editorial Publications', value: '25+' },
        { label: 'Global Clients', value: '12 Countries' }
      ]
    },
    {
      id: 'section-cinema',
      title: 'Cinematic Storytelling & Craftsmanship',
      tagline: 'BEYOND STILL FRAMES INTO LIVING MEMORY',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=90',
      imagePosition: 'left', // alternates!
      quote: '“A wedding film should not just recap the day; it should make your heart beat with the same electric wonder every time you press play.”',
      richContent: '<p>Our motion cinema arm employs state-of-the-art cinema cameras, master sound design, and bespoke musical scoring to create wedding films with the emotional gravity of feature films.</p><p>Together with our archival fine-art albums hand-bound in Florence leather and Japanese silk, we deliver physical and digital legacies that your family will treasure for generations.</p>',
      stats: [
        { label: 'Archival Photobooks Delivered', value: '380+' },
        { label: 'Cinematic Teasers', value: '100% 4K HDR' }
      ]
    }
  ]
};

const STORAGE_KEY = 'captura_about_cms';
const DB_NAME = 'CapturaLK_CMS_DB';
const DB_VERSION = 2;
const STORE_NAME = 'about_content_store';

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('home_content_store')) {
        db.createObjectStore('home_content_store');
      }
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function mergeAboutContent(saved = {}) {
  return {
    header: {
      ...DEFAULT_ABOUT_CONTENT.header,
      ...(saved.header || {})
    },
    sections: Array.isArray(saved.sections) && saved.sections.length > 0
      ? saved.sections.map((sec, idx) => ({
          id: sec.id || `section-${idx + 1}`,
          title: sec.title || `Section ${idx + 1}`,
          tagline: sec.tagline || '',
          image: sec.image || DEFAULT_ABOUT_CONTENT.sections[0].image,
          imagePosition: sec.imagePosition || (idx % 2 === 0 ? 'left' : 'right'),
          bgType: sec.bgType || 'default',
          customBgImage: sec.customBgImage || '',
          bgOpacity: sec.bgOpacity !== undefined ? sec.bgOpacity : 0.40,
          quote: sec.quote || '',
          richContent: sec.richContent || '',
          stats: Array.isArray(sec.stats) ? sec.stats : []
        }))
      : DEFAULT_ABOUT_CONTENT.sections
  };
}

/**
 * Synchronous get from localStorage with fallback.
 */
export function getAboutContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return mergeAboutContent(parsed);
    }
  } catch (err) {
    console.warn('LocalStorage read error for about page:', err);
  }
  return DEFAULT_ABOUT_CONTENT;
}

/**
 * Async get from IndexedDB with cache sync.
 */
export async function getAboutContentAsync() {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(STORAGE_KEY);

    return new Promise((resolve) => {
      req.onsuccess = () => {
        if (req.result) {
          const merged = mergeAboutContent(req.result);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch (_) {}
          resolve(merged);
        } else {
          resolve(getAboutContent());
        }
      };
      req.onerror = () => resolve(getAboutContent());
    });
  } catch (err) {
    return getAboutContent();
  }
}

/**
 * Save About Us page content to LocalStorage, IndexedDB, and broadcast live event.
 */
export function saveAboutContent(content) {
  const merged = mergeAboutContent(content);

  // 1. LocalStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (e) {
    console.warn('LocalStorage quota or write error:', e);
  }

  // 2. IndexedDB
  openIndexedDB().then((db) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(merged, STORAGE_KEY);
  }).catch((err) => {
    console.warn('IndexedDB write error:', err);
  });

  // 3. Broadcast Event to all tabs & components
  window.dispatchEvent(new CustomEvent('captura_about_updated', { detail: merged }));
  return merged;
}
