import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, 
  User, 
  LogOut, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  AlertCircle,
  Eye,
  EyeOff,
  Calendar,
  Camera,
  HardDrive,
  TrendingUp,
  Search,
  Bell,
  Plus,
  Star,
  Clock,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Image as ImageIcon,
  Home,
  Info,
  Mail,
  Save,
  Check,
  Trash2,
  Upload,
  RotateCcw,
  Sliders,
  Layers,
  Palette,
  Video,
  Film,
  Crop,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  GripVertical,
  X
} from 'lucide-react';
import Logo from '../components/Logo';
import HeroImageEditorModal from '../components/HeroImageEditorModal';
import RichTextEditor from '../components/RichTextEditor';
import { 
  getHomeContent, 
  getHomeContentAsync, 
  saveHomeContent, 
  resetHomeContent, 
  compressImageFile, 
  DEFAULT_HOME_CONTENT,
  DEFAULT_CATEGORY_ITEMS
} from '../utils/homeContentService';
import { 
  getAboutContent, 
  getAboutContentAsync, 
  saveAboutContent, 
  DEFAULT_ABOUT_CONTENT 
} from '../utils/aboutContentService';




export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Active Navigation: default to customize-home as requested!
  const [activeSection, setActiveSection] = useState('customize-home');
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // HOME PAGE CMS STATE (Synchronized with localStorage & real-time updates)
  const [homeCms, setHomeCms] = useState(getHomeContent());
  const [activeCatPillar, setActiveCatPillar] = useState('wedding'); // 'wedding' | 'graduation' | 'preshoot' | 'commercial' | 'video360'

  // Hero Image Framing & Preview Editor Modal State
  const [heroEditorOpen, setHeroEditorOpen] = useState(false);
  const [heroEditorImage, setHeroEditorImage] = useState('');
  const [heroEditorTitle, setHeroEditorTitle] = useState('');
  const [heroEditorCallback, setHeroEditorCallback] = useState(null);

  const openHeroEditor = (imageUrl, title, onApply) => {
    if (!imageUrl) {
      alert('Please select or upload an image first.');
      return;
    }
    setHeroEditorImage(imageUrl);
    setHeroEditorTitle(title);
    setHeroEditorCallback(() => onApply);
    setHeroEditorOpen(true);
  };

  // Immediate Real-Time Auto-Save & Publish for Hero Image changes
  const saveAndPublishHeroUpdate = (updatedHeroData) => {
    const updatedHome = {
      ...homeCms,
      hero: {
        ...homeCms.hero,
        ...updatedHeroData
      }
    };
    setHomeCms(updatedHome);
    saveHomeContent(updatedHome);
    setSaveSuccessMsg('✓ Hero image updated, saved & published live to the homepage!');
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  const saveAndPublishCategoriesBgUpdate = (bgData) => {
    const updatedHome = {
      ...homeCms,
      categories: {
        ...homeCms.categories,
        ...bgData
      }
    };
    setHomeCms(updatedHome);
    saveHomeContent(updatedHome);
    setSaveSuccessMsg('✓ Category background updated and published live!');
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  const saveAndPublishStoryUpdate = (storyData) => {
    const updatedHome = {
      ...homeCms,
      story: {
        ...homeCms.story,
        ...storyData
      }
    };
    setHomeCms(updatedHome);
    saveHomeContent(updatedHome);
    setSaveSuccessMsg('✓ Story section updated and published live!');
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  const saveAndPublishReviewsUpdate = (reviewsData) => {
    const updatedHome = {
      ...homeCms,
      reviews: {
        ...homeCms.reviews,
        ...reviewsData
      }
    };
    setHomeCms(updatedHome);
    saveHomeContent(updatedHome);
    setSaveSuccessMsg('✓ Reviews section updated and published live!');
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  const saveAndPublishCalloutUpdate = (calloutData) => {
    const updatedHome = {
      ...homeCms,
      callout: {
        ...homeCms.callout,
        ...calloutData
      }
    };
    setHomeCms(updatedHome);
    saveHomeContent(updatedHome);
    setSaveSuccessMsg('✓ Callout banner background updated and published live!');
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  // Dynamic Categories Management State
  const categoryItems = homeCms.categories?.items || DEFAULT_CATEGORY_ITEMS;
  const [activeCatId, setActiveCatId] = useState(categoryItems[0]?.id || 'weddings');
  const [draggedCatIndex, setDraggedCatIndex] = useState(null);
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatForm, setNewCatForm] = useState({
    title: '',
    subtitle: '',
    mediaType: 'images' // 'images' | 'videos' | 'both'
  });

  // Ensure activeCatId points to a valid category
  useEffect(() => {
    const items = homeCms.categories?.items || DEFAULT_CATEGORY_ITEMS;
    if (!items.some(c => c.id === activeCatId) && items.length > 0) {
      setActiveCatId(items[0].id);
    }
  }, [homeCms.categories?.items, activeCatId]);

  const saveAndPublishCategories = (newItems) => {
    const cleanItems = newItems.map((it, idx) => ({
      id: it.id || `cat-${Date.now()}-${idx}`,
      title: it.title || `Category ${idx + 1}`,
      subtitle: it.subtitle || '',
      mediaType: it.mediaType || 'images',
      isHidden: Boolean(it.isHidden),
      slides: Array.isArray(it.slides) ? it.slides : [],
      videoUrl: it.videoUrl || '',
      videoPoster: it.videoPoster || '',
      videoTitle: it.videoTitle || ''
    }));

    const weddingCategory = cleanItems.find(c => c.id === 'weddings');
    const graduationCategory = cleanItems.find(c => c.id === 'graduations');
    const preshootCategory = cleanItems.find(c => c.id === 'preshoots');
    const commercialCategory = cleanItems.find(c => c.id === 'commercial');
    const video360Category = cleanItems.find(c => c.id === 'video360' || c.mediaType === 'videos');

    const updatedCategories = {
      ...homeCms.categories,
      items: cleanItems,
      weddingSlides: weddingCategory?.slides || homeCms.categories.weddingSlides,
      graduationSlides: graduationCategory?.slides || homeCms.categories.graduationSlides,
      preshootSlides: preshootCategory?.slides || homeCms.categories.preshootSlides,
      commercialSlides: commercialCategory?.slides || homeCms.categories.commercialSlides,
      video360: {
        url: video360Category?.videoUrl || homeCms.categories.video360?.url,
        poster: video360Category?.videoPoster || homeCms.categories.video360?.poster,
        title: video360Category?.videoTitle || homeCms.categories.video360?.title
      }
    };

    const updatedHome = {
      ...homeCms,
      categories: updatedCategories
    };

    setHomeCms(updatedHome);
    saveHomeContent(updatedHome);
    setSaveSuccessMsg('✓ Categories updated and published live!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleAddCategory = () => {
    if (!newCatForm.title.trim()) {
      alert('Please enter a category title.');
      return;
    }
    const newId = newCatForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
    const newCat = {
      id: newId,
      title: newCatForm.title.trim(),
      subtitle: newCatForm.subtitle.trim() || 'Fine Art Photography & Film',
      mediaType: newCatForm.mediaType || 'images',
      isHidden: false,
      slides: newCatForm.mediaType === 'videos' ? [] : [
        {
          id: 1,
          title: `${newCatForm.title.trim()} Masterpiece`,
          location: 'Signature Venue / Studio',
          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85'
        }
      ],
      videoUrl: newCatForm.mediaType !== 'images' ? 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-posing-in-a-field-at-sunset-42998-large.mp4' : '',
      videoPoster: newCatForm.mediaType !== 'images' ? 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80' : '',
      videoTitle: `${newCatForm.title.trim()} Cinematic Experience`
    };

    const items = [...categoryItems, newCat];
    saveAndPublishCategories(items);
    setActiveCatId(newId);
    setNewCatForm({ title: '', subtitle: '', mediaType: 'images' });
    setShowAddCatModal(false);
  };

  const handleDeleteCategory = (catId, catTitle) => {
    if (categoryItems.length <= 1) {
      alert('You must have at least one category in the showcase.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${catTitle}"? This will remove it from Section 2.`)) {
      return;
    }
    const updated = categoryItems.filter(c => c.id !== catId);
    saveAndPublishCategories(updated);
    if (activeCatId === catId) {
      setActiveCatId(updated[0]?.id || '');
    }
  };

  const handleToggleHideCategory = (catId) => {
    const updated = categoryItems.map(c => {
      if (c.id === catId) {
        return { ...c, isHidden: !c.isHidden };
      }
      return c;
    });
    saveAndPublishCategories(updated);
  };

  const handleMoveCategory = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= categoryItems.length) return;
    const updated = [...categoryItems];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    saveAndPublishCategories(updated);
  };

  const handleUpdateActiveCat = (updates) => {
    const updated = categoryItems.map(c => {
      if (c.id === activeCatId) {
        return { ...c, ...updates };
      }
      return c;
    });
    saveAndPublishCategories(updated);
  };

  const handleAddSlideToActiveCat = () => {
    const currentCat = categoryItems.find(c => c.id === activeCatId);
    if (!currentCat) return;
    const slides = currentCat.slides || [];
    const newSlide = {
      id: Date.now(),
      title: `${currentCat.title} Slide ${slides.length + 1}`,
      location: 'Venue / Location',
      url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85'
    };
    handleUpdateActiveCat({ slides: [...slides, newSlide] });
  };

  const handleRemoveSlideFromActiveCat = (slideIdx) => {
    const currentCat = categoryItems.find(c => c.id === activeCatId);
    if (!currentCat) return;
    const slides = currentCat.slides || [];
    if (slides.length <= 1) {
      alert('Photo categories must have at least one slide.');
      return;
    }
    const updated = slides.filter((_, idx) => idx !== slideIdx);
    handleUpdateActiveCat({ slides: updated });
  };

  // About Us Page CMS State
  const [aboutCms, setAboutCms] = useState(getAboutContent());
  const [expandedAboutSection, setExpandedAboutSection] = useState(0);

  useEffect(() => {
    getAboutContentAsync().then((loaded) => {
      if (loaded) setAboutCms(loaded);
    });
  }, []);

  const saveAndPublishAboutUpdate = (updatedAboutData) => {
    const merged = {
      ...aboutCms,
      ...updatedAboutData
    };
    setAboutCms(merged);
    saveAboutContent(merged);
    setSaveSuccessMsg('✓ About Us page updated, saved & published live!');
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  const handleAddAboutSection = () => {
    const newIdx = (aboutCms.sections || []).length;
    const newSection = {
      id: `section-${Date.now()}`,
      title: `Curated Chapter ${newIdx + 1}`,
      tagline: 'SACRED HERITAGE & ARTISTRY',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=90',
      imagePosition: newIdx % 2 === 0 ? 'left' : 'right', // alternating layout!
      bgType: 'default',
      customBgImage: '',
      bgOpacity: 0.40,
      quote: '“True beauty lies in the quiet sincerity of unscripted moments.”',
      richContent: '<p>Documenting life with heartfelt intention, editorial elegance, and deep respect for Sri Lankan wedding traditions.</p>',
      stats: [
        { label: 'Moments Captured', value: '100+' },
        { label: 'Excellence Rating', value: '5.0 ★' }
      ]
    };
    const updated = {
      ...aboutCms,
      sections: [...(aboutCms.sections || []), newSection]
    };
    saveAndPublishAboutUpdate(updated);
    setExpandedAboutSection(updated.sections.length - 1);
  };

  const handleDeleteAboutSection = (idx) => {
    if ((aboutCms.sections || []).length <= 1) {
      alert('The About Us page must have at least one story section.');
      return;
    }
    if (window.confirm(`Are you sure you want to remove Section ${idx + 1}: "${aboutCms.sections[idx]?.title || 'Untitled'}"?`)) {
      const updatedSections = aboutCms.sections.filter((_, i) => i !== idx);
      const updated = { ...aboutCms, sections: updatedSections };
      saveAndPublishAboutUpdate(updated);
      setExpandedAboutSection(Math.max(0, idx - 1));
    }
  };

  const handleMoveAboutSection = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= aboutCms.sections.length) return;
    const updatedSections = [...aboutCms.sections];
    const temp = updatedSections[idx];
    updatedSections[idx] = updatedSections[targetIdx];
    updatedSections[targetIdx] = temp;
    const updated = { ...aboutCms, sections: updatedSections };
    saveAndPublishAboutUpdate(updated);
    setExpandedAboutSection(targetIdx);
  };

  const [portfolioData, setPortfolioData] = useState({
    galleryTitle: 'Fine Art Wedding Archive',
    categories: ['Royal Kandyan', 'Coastal Sunset', 'Intimate Elopements', 'Pre-Shoot Portraits', 'Commercial Events'],
    featuredAlbumCount: '24 Curated Collections',
    displayMode: '5-Panel Vertical Cinematic Split'
  });

  const [galleryData, setGalleryData] = useState({
    galleryHeading: 'Private Client Deliverables Vault',
    pinProtection: true,
    highResDownload: true,
    watermarkPublic: false,
    storageQuota: '1.42 TB used of 2.0 TB',
    activeClientVaults: '36 Active Couple Galleries'
  });

  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      names: 'Kasun & Shenali',
      venue: 'The Grand Kandyan',
      rating: 5,
      quote: 'Captura LK transformed our Kandyan wedding into a cinematic masterpiece. The team was so discrete yet captured raw emotional moments we didn\'t even notice happening.',
      isPublic: true
    },
    {
      id: 2,
      names: 'Dilan & Amanda',
      venue: 'Galle Fort Heritage',
      rating: 5,
      quote: 'From the golden-hour portraits at Galle Fort to the reception fireworks, every single photograph belongs in an international bridal magazine.',
      isPublic: true
    },
    {
      id: 3,
      names: 'Ravindu & Nilusha',
      venue: 'Shangri-La Ballroom, Colombo',
      rating: 5,
      quote: 'Unmatched professionalism, discreet elegance, and the photos took our breath away. Truly the pinnacle of wedding photography in Sri Lanka.',
      isPublic: true
    }
  ]);

  const [contactData, setContactData] = useState({
    studioAddress: 'No. 42, Ward Place, Colombo 07, Sri Lanka',
    hotline1: '+94 77 123 4567',
    hotline2: '+94 11 234 5678',
    inquiryEmail: 'studio@capturalk.com',
    businessHours: 'Tuesday - Sunday: 9:00 AM - 6:30 PM (Mondays by appointment only)',
    whatsappNumber: '+94771234567'
  });

  // Check existing session
  useEffect(() => {
    const session = localStorage.getItem('captura_admin_session');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
    // Hydrate latest CMS content including IndexedDB store
    getHomeContentAsync().then((loaded) => {
      if (loaded) {
        setHomeCms(loaded);
      }
    });
  }, []);

  // Update Colombo LK Live Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (username.trim().toLowerCase() === 'admin' && password === 'admin123') {
        localStorage.setItem('captura_admin_session', 'true');
        localStorage.setItem('captura_admin_user', 'admin');
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Invalid studio credentials. Please check your username and password.');
      }
      setIsLoading(false);
    }, 350);
  };

  const handleLogout = () => {
    localStorage.removeItem('captura_admin_session');
    localStorage.removeItem('captura_admin_user');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setError('');
  };

  const fillQuickCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  // File Upload Helper (compresses to web-optimized high-res base64 data URL)
  const handleImageFileChange = async (e, onComplete) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Compress to high-res web quality (1920px max, ~150KB) so browser storage is never exceeded
      const compressedDataUrl = await compressImageFile(file);
      onComplete(compressedDataUrl);
      setSaveSuccessMsg('Image ready! Click "Save & Publish" above to apply it live.');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      console.warn('Compression error, falling back to FileReader', err);
      const reader = new FileReader();
      reader.onload = () => onComplete(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Video File Upload Helper (accepts MP4/WebM with size check for smooth offline storage)
  const handleVideoFileChange = (e, onComplete) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert('Video file is larger than 25MB. For fast web playback, please use a video under 25MB or paste a direct video URL.');
      return;
    }

    setSaveSuccessMsg('Reading video file... Please wait a moment.');
    const reader = new FileReader();
    reader.onload = () => {
      onComplete(reader.result);
      setSaveSuccessMsg('Video ready! Click "Save & Publish" above to apply it live.');
      setTimeout(() => setSaveSuccessMsg(''), 4500);
    };
    reader.readAsDataURL(file);
  };

  // Save Home Page Changes
  const handleSaveHome = () => {
    const success = saveHomeContent(homeCms);
    if (success) {
      setSaveSuccessMsg('✓ Home Page images and section backgrounds saved & published live! Check the Home page to see changes.');
      setTimeout(() => setSaveSuccessMsg(''), 5500);
    }
  };


  // Reset Home Page to Default
  const handleResetHome = () => {
    if (window.confirm('Reset all Home page images and backgrounds to original fine-art defaults?')) {
      const resetData = resetHomeContent();
      setHomeCms(resetData);
      setSaveSuccessMsg('✓ Home Page reverted to original fine-art defaults.');
      setTimeout(() => setSaveSuccessMsg(''), 4500);
    }
  };

  const triggerGenericSave = (pageName) => {
    setSaveSuccessMsg(`✓ ${pageName} modifications saved and published to live website.`);
    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 4000);
  };

  // Define Pages list for "Customize Pages"
  const pagesList = [
    { id: 'customize-home', name: 'Home Page', path: '/', icon: Home, badge: 'Main' },
    { id: 'customize-about', name: 'About Us', path: '/about', icon: Info, badge: 'Story' },
    { id: 'customize-portfolio', name: 'Portfolio', path: '/portfolio', icon: Camera, badge: 'Showcase' },
    { id: 'customize-gallery', name: 'Client Gallery', path: '/client-gallery', icon: ImageIcon, badge: 'Vault' },
    { id: 'customize-reviews', name: 'Reviews Page', path: '/reviews', icon: Star, badge: `${reviewsList.length}` },
    { id: 'customize-contact', name: 'Contact Us', path: '/contact', icon: Mail, badge: 'Inquiry' }
  ];

  // =========================================================================
  // 1. ADMIN DASHBOARD VIEW (WHEN LOGGED IN - SIDEBAR + CUSTOMIZER SUITE)
  // =========================================================================
  if (isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#07070a', color: '#f3f3f3', display: 'flex', fontFamily: 'sans-serif' }}>
        
        {/* ================================================================= */}
        {/* SIDE PANEL (SIDEBAR) */}
        {/* ================================================================= */}
        <aside style={{
          width: '270px',
          minWidth: '270px',
          backgroundColor: '#0c0c12',
          borderRight: '1px solid #1c1c28',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40
        }}>
          
          {/* Top Brand Area */}
          <div>
            <div style={{ padding: '20px', borderBottom: '1px solid #181824' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Logo />
                </Link>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#ff6a13', backgroundColor: 'rgba(255,106,19,0.12)', border: '1px solid rgba(255,106,19,0.3)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  ADMIN
                </span>
              </div>
            </div>

            {/* Navigation Menus */}
            <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', maxHeight: 'calc(100vh - 170px)' }}>
              
              {/* ------------------------------------------------------------- */}
              {/* 1. CUSTOMIZE PAGES (FIRST SECTION AS REQUESTED BY USER) */}
              {/* ------------------------------------------------------------- */}
              <div style={{ marginBottom: '14px' }}>
                <div 
                  onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sliders style={{ width: '14px', height: '14px', color: '#ff6a13' }} />
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#ff6a13', fontWeight: 700 }}>
                      Customize Pages
                    </span>
                  </div>
                  {isCustomizeOpen ? (
                    <ChevronDown style={{ width: '14px', height: '14px', color: '#888899' }} />
                  ) : (
                    <ChevronRight style={{ width: '14px', height: '14px', color: '#888899' }} />
                  )}
                </div>

                {/* Sub-menu: Pages List */}
                {isCustomizeOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px', paddingLeft: '6px' }}>
                    {pagesList.map((page) => {
                      const Icon = page.icon;
                      const isActive = activeSection === page.id;
                      return (
                        <button
                          key={page.id}
                          onClick={() => setActiveSection(page.id)}
                          className={`admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                            <Icon style={{ width: '14px', height: '14px', color: isActive ? '#ff6a13' : '#777788' }} />
                            <span>{page.name}</span>
                          </div>
                          <span className="admin-nav-badge">{page.badge}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 2. STUDIO SUITE OPERATIONS */}
              {/* ------------------------------------------------------------- */}
              <div style={{ borderTop: '1px solid #181824', paddingTop: '14px', marginBottom: '8px' }}>
                <p style={{ margin: '0 0 6px 10px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#666677', fontWeight: 700 }}>
                  Studio Operations
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <button
                    onClick={() => setActiveSection('overview')}
                    className={`admin-nav-item ${activeSection === 'overview' ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <TrendingUp style={{ width: '14px', height: '14px', color: activeSection === 'overview' ? '#ff6a13' : '#777788' }} />
                      <span>Overview & KPIs</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveSection('bookings')}
                    className={`admin-nav-item ${activeSection === 'bookings' ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <Calendar style={{ width: '14px', height: '14px', color: activeSection === 'bookings' ? '#ff6a13' : '#777788' }} />
                      <span>Bookings Queue</span>
                    </div>
                    <span className="admin-nav-badge" style={{ backgroundColor: 'rgba(255,106,19,0.18)', color: '#ff6a13' }}>4</span>
                  </button>

                  <button
                    onClick={() => setActiveSection('settings')}
                    className={`admin-nav-item ${activeSection === 'settings' ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <SlidersHorizontal style={{ width: '14px', height: '14px', color: activeSection === 'settings' ? '#ff6a13' : '#777788' }} />
                      <span>Studio Settings</span>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Sidebar User Area */}
          <div style={{ padding: '16px', borderTop: '1px solid #181824', backgroundColor: '#09090e' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#191926', border: '1px solid #ff6a13', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#fff' }}>
                  LK
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#fff' }}>Super Admin</p>
                  <p style={{ margin: 0, fontSize: '10px', color: '#10b981', fontFamily: 'monospace' }}>● Live Studio OS</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Link 
                to="/" 
                target="_blank"
                style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#aaa', textDecoration: 'none', padding: '7px', borderRadius: '4px', backgroundColor: '#12121b', border: '1px solid #202030' }}
              >
                <span>Live Site</span>
                <ExternalLink style={{ width: '12px', height: '12px' }} />
              </Link>
              <button
                onClick={handleLogout}
                style={{ padding: '7px 10px', fontSize: '11px', color: '#f87171', backgroundColor: '#181215', border: '1px solid #3c1c22', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Logout"
              >
                <LogOut style={{ width: '12px', height: '12px' }} />
                <span>Exit</span>
              </button>
            </div>
          </div>

        </aside>

        {/* ================================================================= */}
        {/* MAIN CONTENT AREA */}
        {/* ================================================================= */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto', height: '100vh' }}>
          
          {/* Top Command Bar */}
          <header style={{ backgroundColor: '#0a0a0f', borderBottom: '1px solid #1a1a26', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888899', fontFamily: 'monospace' }}>
                ADMIN CONSOLE
              </span>
              <span style={{ color: '#444455' }}>/</span>
              <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>
                {pagesList.find(p => p.id === activeSection)?.name || 'Studio Overview'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '11px', color: '#777788', fontFamily: 'monospace' }}>
                Colombo LK • {currentTime}
              </span>
              <div style={{ width: '1px', height: '18px', backgroundColor: '#222232' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span style={{ fontSize: '11px', color: '#10b981', fontFamily: 'monospace', fontWeight: 600 }}>LIVE CMS READY</span>
              </div>
            </div>
          </header>

          {/* Success Save Banner */}
          {saveSuccessMsg && (
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', borderBottom: '1px solid rgba(16, 185, 129, 0.35)', color: '#34d399', padding: '12px 28px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check style={{ width: '16px', height: '16px' }} />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Body Canvas */}
          <div style={{ padding: '32px 36px', maxWidth: '1120px', width: '100%', boxSizing: 'border-box' }}>
            
            {/* ============================================================= */}
            {/* PAGE CUSTOMIZER: 1. HOME PAGE (FULL IMAGE UPLOAD & BG SUITE) */}
            {/* ============================================================= */}
            {activeSection === 'customize-home' && (
              <div>
                
                {/* Header Action Bar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Home style={{ width: '20px', height: '20px', color: '#ff6a13' }} />
                      <h1 style={{ margin: 0, fontSize: '24px', color: '#fff', fontWeight: 400 }}>
                        Customize Home Page
                      </h1>
                    </div>
                    <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#888899' }}>
                      Upload custom images across all sections and customize individual section background images or default black themes.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleResetHome}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 14px', backgroundColor: '#13131c', border: '1px solid #222233', color: '#bbb', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                      title="Reset all Home Page images and backgrounds to default fine-art style"
                    >
                      <RotateCcw style={{ width: '13px', height: '13px' }} />
                      <span>Reset Defaults</span>
                    </button>
                    <Link
                      to="/"
                      target="_blank"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 14px', backgroundColor: '#13131c', border: '1px solid #222233', color: '#bbb', textDecoration: 'none', borderRadius: '4px', fontSize: '12px' }}
                    >
                      <ExternalLink style={{ width: '13px', height: '13px' }} />
                      <span>Preview Live</span>
                    </Link>
                    <button
                      onClick={handleSaveHome}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 22px', backgroundColor: '#ff6a13', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,106,19,0.3)' }}
                    >
                      <Save style={{ width: '14px', height: '14px' }} />
                      <span>Save & Publish</span>
                    </button>
                  </div>
                </div>

                {/* Home Sections Customizer Stack */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                  {/* --------------------------------------------------------- */}
                  {/* SECTION 1: HERO SECTION */}
                  {/* --------------------------------------------------------- */}
                  <div className="admin-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                      <div>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6a13', fontWeight: 700 }}>
                          SECTION 1
                        </span>
                        <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', color: '#fff' }}>
                          Fullscreen Hero Section
                        </h3>
                      </div>
                      <span style={{ fontSize: '11px', color: '#888899', fontFamily: 'monospace' }}>Top Landing View</span>
                    </div>

                    {/* Section Background Controller */}
                    <div style={{ padding: '16px', backgroundColor: '#12121b', border: '1px solid #1f1f2e', borderRadius: '6px', marginBottom: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Palette style={{ width: '15px', height: '15px', color: '#ff6a13' }} />
                        <strong style={{ fontSize: '13px', color: '#fff' }}>Hero Section Background</strong>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ddd', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="heroBgType"
                            checked={homeCms.hero.bgType === 'default'}
                            onChange={() => setHomeCms({
                              ...homeCms,
                              hero: { ...homeCms.hero, bgType: 'default' }
                            })}
                            style={{ accentColor: '#ff6a13' }}
                          />
                          <span>Default (Slideshow / Dark Cinematic)</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ddd', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="heroBgType"
                            checked={homeCms.hero.bgType === 'custom'}
                            onChange={() => setHomeCms({
                              ...homeCms,
                              hero: { ...homeCms.hero, bgType: 'custom' }
                            })}
                            style={{ accentColor: '#ff6a13' }}
                          />
                          <span style={{ color: '#ff6a13', fontWeight: 600 }}>Custom Background Image</span>
                        </label>
                      </div>

                      {homeCms.hero.bgType === 'custom' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '10px', borderTop: '1px solid #1e1e2d' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                            {homeCms.hero.customBgImage && (
                              <img
                                src={homeCms.hero.customBgImage}
                                alt="Hero Bg Preview"
                                style={{ width: '90px', height: '54px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ff6a13', cursor: 'pointer' }}
                                onClick={() => openHeroEditor(homeCms.hero.customBgImage, 'Adjust Hero Custom Background', (croppedUrl) => {
                                  saveAndPublishHeroUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                })}
                                title="Click to adjust framing in Preview Editor"
                              />
                            )}
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#ff6a13', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                              <Upload style={{ width: '13px', height: '13px' }} />
                              <span>Upload Background Image File</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageFileChange(e, (dataUrl) => {
                                  openHeroEditor(dataUrl, 'Adjust Hero Custom Background', (croppedUrl) => {
                                    saveAndPublishHeroUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                  });
                                })}
                              />
                            </label>

                            {homeCms.hero.customBgImage && (
                              <button
                                type="button"
                                onClick={() => openHeroEditor(homeCms.hero.customBgImage, 'Adjust Hero Custom Background', (croppedUrl) => {
                                  saveAndPublishHeroUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                })}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#181824', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                              >
                                <Crop style={{ width: '13px', height: '13px' }} />
                                <span>Adjust & Frame (Preview Editor)</span>
                              </button>
                            )}

                            <input
                              type="text"
                              placeholder="Or paste background image URL..."
                              value={homeCms.hero.customBgImage}
                              onChange={(e) => saveAndPublishHeroUpdate({ bgType: 'custom', customBgImage: e.target.value })}
                              className="admin-input"
                              style={{ flex: 1, minWidth: '220px', padding: '8px 12px', borderRadius: '4px', fontSize: '12px' }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Universal Image Clarity & Darkness Overlay Slider */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #1a1a28', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'monospace' }}>Image Darkness Overlay (Layer):</span>
                        <input
                          type="range"
                          min="0"
                          max="0.80"
                          step="0.05"
                          value={homeCms.hero.bgOpacity !== undefined ? homeCms.hero.bgOpacity : 0.10}
                          onChange={(e) => saveAndPublishHeroUpdate({ bgOpacity: parseFloat(e.target.value) })}
                          style={{ width: '160px', accentColor: '#ff6a13' }}
                        />
                        <span style={{ fontSize: '11px', color: '#ff6a13', fontFamily: 'monospace', fontWeight: 600 }}>
                          {Math.round((homeCms.hero.bgOpacity !== undefined ? homeCms.hero.bgOpacity : 0.10) * 100)}% Darkness
                          {(homeCms.hero.bgOpacity ?? 0.10) <= 0.15 ? ' (Ultra-Clear & Vibrant Photo)' : ''}
                        </span>
                        <span style={{ fontSize: '11px', color: '#777788' }}>
                          (Lower value = more clear & bright photo)
                        </span>
                      </div>
                    </div>

                    {/* Active Hero Preview Indicator */}
                    <div style={{ padding: '12px 16px', backgroundColor: '#13131d', border: '1px solid #ff6a13', borderRadius: '6px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={homeCms.hero.bgType === 'custom' && homeCms.hero.customBgImage ? homeCms.hero.customBgImage : homeCms.hero.slides[0]?.url}
                          alt="Active Hero Preview"
                          style={{ width: '64px', height: '42px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ff6a13', cursor: 'pointer' }}
                          onClick={() => {
                            const activeUrl = homeCms.hero.bgType === 'custom' && homeCms.hero.customBgImage 
                              ? homeCms.hero.customBgImage 
                              : (homeCms.hero.slides[0]?.url || '');
                            const isCustom = homeCms.hero.bgType === 'custom' && homeCms.hero.customBgImage;
                            openHeroEditor(activeUrl, 'Adjust Active Hero Display Image', (croppedUrl) => {
                              if (isCustom) {
                                saveAndPublishHeroUpdate({ customBgImage: croppedUrl });
                              } else {
                                const updatedSlides = [...homeCms.hero.slides];
                                updatedSlides[0] = { ...updatedSlides[0], url: croppedUrl };
                                saveAndPublishHeroUpdate({ slides: updatedSlides });
                              }
                            });
                          }}
                          title="Click to adjust framing in Preview Editor"
                        />
                        <div>
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#ff6a13', fontFamily: 'monospace', fontWeight: 700 }}>
                            ● ACTIVE HERO DISPLAY IMAGE
                          </span>
                          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#fff' }}>
                            {homeCms.hero.bgType === 'custom' && homeCms.hero.customBgImage ? 'Custom Background Image Active' : `Rotating Slideshow Active (Slide 1: ${homeCms.hero.slides[0]?.title})`}
                          </p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const activeUrl = homeCms.hero.bgType === 'custom' && homeCms.hero.customBgImage 
                              ? homeCms.hero.customBgImage 
                              : (homeCms.hero.slides[0]?.url || '');
                            const isCustom = homeCms.hero.bgType === 'custom' && homeCms.hero.customBgImage;
                            openHeroEditor(activeUrl, 'Adjust Active Hero Display Image', (croppedUrl) => {
                              if (isCustom) {
                                saveAndPublishHeroUpdate({ customBgImage: croppedUrl });
                              } else {
                                const updatedSlides = [...homeCms.hero.slides];
                                updatedSlides[0] = { ...updatedSlides[0], url: croppedUrl };
                                saveAndPublishHeroUpdate({ slides: updatedSlides });
                              }
                            });
                          }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: '#ff6a13', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                        >
                          <Crop style={{ width: '12px', height: '12px' }} />
                          <span>Adjust & Frame Hero Image</span>
                        </button>
                        <span style={{ fontSize: '11px', color: '#34d399', fontFamily: 'monospace' }}>
                          Live on Home Page
                        </span>
                      </div>
                    </div>

                    {/* Hero In-Content Background Slides */}
                    <div style={{ marginBottom: '20px' }}>
                      <strong style={{ display: 'block', fontSize: '13px', color: '#fff', marginBottom: '8px' }}>
                        Hero Slideshow Images (3 Rotating Atmospheric Slides)
                      </strong>
                      <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#777788' }}>
                        Upload or replace any of the 3 main background slides that rotate on the Hero arrival screen. Use "Adjust & Frame" to preview how the image looks on the live hero section and crop the exact portion you want.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {homeCms.hero.slides.map((slide, idx) => (
                          <div key={slide.id || idx} style={{ padding: '14px 16px', backgroundColor: '#101018', border: '1px solid #1c1c28', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <img
                              src={slide.url}
                              alt={slide.title}
                              style={{ width: '80px', height: '52px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #2b2b3d', cursor: 'pointer' }}
                              onClick={() => openHeroEditor(slide.url, `Adjust Hero Slide ${idx + 1}: ${slide.title}`, (croppedUrl) => {
                                const updatedSlides = [...homeCms.hero.slides];
                                updatedSlides[idx] = { ...updatedSlides[idx], url: croppedUrl };
                                saveAndPublishHeroUpdate({ bgType: 'default', slides: updatedSlides });
                              })}
                              title="Click to open Preview Editor"
                            />
                            
                            <div style={{ flex: 1, minWidth: '220px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', display: 'block', marginBottom: '4px' }}>
                                Slide {idx + 1}: {slide.title}
                              </span>
                              <input
                                type="text"
                                value={slide.url}
                                onChange={(e) => {
                                  const updatedSlides = [...homeCms.hero.slides];
                                  updatedSlides[idx] = { ...updatedSlides[idx], url: e.target.value };
                                  saveAndPublishHeroUpdate({ bgType: 'default', slides: updatedSlides });
                                }}
                                className="admin-input"
                                style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }}
                              />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => openHeroEditor(slide.url, `Adjust Hero Slide ${idx + 1}: ${slide.title}`, (croppedUrl) => {
                                  const updatedSlides = [...homeCms.hero.slides];
                                  updatedSlides[idx] = { ...updatedSlides[idx], url: croppedUrl };
                                  saveAndPublishHeroUpdate({ bgType: 'default', slides: updatedSlides });
                                })}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', backgroundColor: '#181824', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                                title="Open live hero simulation & framing editor"
                              >
                                <Crop style={{ width: '12px', height: '12px' }} />
                                <span>Adjust & Frame</span>
                              </button>

                              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', backgroundColor: '#191926', border: '1px solid #2c2c3d', color: '#ddd', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
                                <Upload style={{ width: '12px', height: '12px', color: '#ff6a13' }} />
                                <span>Upload Image</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleImageFileChange(e, (dataUrl) => {
                                    openHeroEditor(dataUrl, `Adjust Hero Slide ${idx + 1}: ${slide.title}`, (croppedUrl) => {
                                      const updatedSlides = [...homeCms.hero.slides];
                                      updatedSlides[idx] = { ...updatedSlides[idx], url: croppedUrl };
                                      saveAndPublishHeroUpdate({ 
                                        bgType: 'default', // Auto activate slideshow!
                                        slides: updatedSlides 
                                      });
                                    });
                                  })}
                                />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>


                    {/* Hero Text Customization */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: '#888899', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>Hero Headline</label>
                        <input
                          type="text"
                          value={homeCms.hero.title}
                          onChange={(e) => setHomeCms({ ...homeCms, hero: { ...homeCms.hero, title: e.target.value } })}
                          className="admin-input"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: '#888899', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>Hero Tagline</label>
                        <input
                          type="text"
                          value={homeCms.hero.tagline}
                          onChange={(e) => setHomeCms({ ...homeCms, hero: { ...homeCms.hero, tagline: e.target.value } })}
                          className="admin-input"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* --------------------------------------------------------- */}
                  {/* SECTION 2: DYNAMIC CATEGORY SHOWCASE & MANAGEMENT         */}
                  {/* --------------------------------------------------------- */}
                  <div className="admin-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6a13', fontWeight: 700 }}>
                          SECTION 2
                        </span>
                        <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', color: '#fff' }}>
                          Dynamic Category Management & Showcase
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888899' }}>
                          Add, reorder, hide or delete categories. Choose media type (Images / Videos / Both) for each. Automatically updates Section 2 on the live website.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAddCatModal(true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '9px 16px',
                          backgroundColor: '#ff6a13',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(255, 106, 19, 0.35)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Plus style={{ width: '15px', height: '15px' }} />
                        <span>Add New Category</span>
                      </button>
                    </div>

                    {/* Section Background Controller */}
                    <div style={{ padding: '16px', backgroundColor: '#12121b', border: '1px solid #1f1f2e', borderRadius: '6px', marginBottom: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Palette style={{ width: '15px', height: '15px', color: '#ff6a13' }} />
                        <strong style={{ fontSize: '13px', color: '#fff' }}>Category Showcase Background</strong>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ddd', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="catBgType"
                            checked={homeCms.categories.bgType === 'default'}
                            onChange={() => setHomeCms({
                              ...homeCms,
                              categories: { ...homeCms.categories, bgType: 'default' }
                            })}
                            style={{ accentColor: '#ff6a13' }}
                          />
                          <span>Default Solid Black Theme (#060608)</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ddd', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="catBgType"
                            checked={homeCms.categories.bgType === 'custom'}
                            onChange={() => saveAndPublishCategoriesBgUpdate({ bgType: 'custom' })}
                            style={{ accentColor: '#ff6a13' }}
                          />
                          <span style={{ color: '#ff6a13', fontWeight: 600 }}>Custom Background Image</span>
                        </label>
                      </div>

                      {homeCms.categories.bgType === 'custom' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '10px', borderTop: '1px solid #1e1e2d' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            {homeCms.categories.customBgImage && (
                              <img
                                src={homeCms.categories.customBgImage}
                                alt="Category Bg Preview"
                                style={{ width: '90px', height: '54px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ff6a13', cursor: 'pointer' }}
                                onClick={() => openHeroEditor(homeCms.categories.customBgImage, 'Adjust Category Showcase Background', (croppedUrl) => {
                                  saveAndPublishCategoriesBgUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                })}
                                title="Click to adjust position in Preview Editor"
                              />
                            )}
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#ff6a13', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                              <Upload style={{ width: '13px', height: '13px' }} />
                              <span>Upload Background Image File</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageFileChange(e, (dataUrl) => {
                                  openHeroEditor(dataUrl, 'Adjust Category Showcase Background', (croppedUrl) => {
                                    saveAndPublishCategoriesBgUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                  });
                                })}
                              />
                            </label>

                            {homeCms.categories.customBgImage && (
                              <button
                                type="button"
                                onClick={() => openHeroEditor(homeCms.categories.customBgImage, 'Adjust Category Showcase Background', (croppedUrl) => {
                                  saveAndPublishCategoriesBgUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                })}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#181824', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                title="Adjust framing, zoom, and position"
                              >
                                <Crop style={{ width: '13px', height: '13px' }} />
                                <span>Adjust & Frame Position</span>
                              </button>
                            )}

                            <input
                              type="text"
                              placeholder="Or paste background image URL..."
                              value={homeCms.categories.customBgImage || ''}
                              onChange={(e) => saveAndPublishCategoriesBgUpdate({ bgType: 'custom', customBgImage: e.target.value })}
                              className="admin-input"
                              style={{ flex: 1, minWidth: '220px', padding: '8px 12px', borderRadius: '4px', fontSize: '12px' }}
                            />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', color: '#888899', fontFamily: 'monospace' }}>Darkness Overlay:</span>
                            <input
                              type="range"
                              min="0"
                              max="0.80"
                              step="0.05"
                              value={homeCms.categories.bgOpacity !== undefined ? homeCms.categories.bgOpacity : 0.40}
                              onChange={(e) => saveAndPublishCategoriesBgUpdate({ bgOpacity: parseFloat(e.target.value) })}
                              style={{ width: '160px', accentColor: '#ff6a13' }}
                            />
                            <span style={{ fontSize: '11px', color: '#ff6a13', fontFamily: 'monospace', fontWeight: 600 }}>
                              {Math.round((homeCms.categories.bgOpacity !== undefined ? homeCms.categories.bgOpacity : 0.40) * 100)}% Darkness
                              {(homeCms.categories.bgOpacity ?? 0.40) <= 0.40 ? ' (Clear & Vibrant)' : ''}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Category Reorder, Visibility & Selection List */}
                    <div style={{ marginBottom: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#ff6a13', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Active Showcase Sequence (Drag to Reorder)
                        </span>
                        <span style={{ fontSize: '11px', color: '#888899' }}>
                          {categoryItems.filter(c => !c.isHidden).length} Active on Live Site / {categoryItems.length} Total
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {categoryItems.map((cat, idx) => {
                          const isSelected = activeCatId === cat.id;
                          const slideCount = (cat.slides || []).length;

                          return (
                            <div
                              key={cat.id}
                              draggable
                              onDragStart={() => setDraggedCatIndex(idx)}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => {
                                if (draggedCatIndex !== null && draggedCatIndex !== idx) {
                                  handleMoveCategory(draggedCatIndex, idx);
                                  setDraggedCatIndex(null);
                                }
                              }}
                              onClick={() => setActiveCatId(cat.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                                padding: '10px 14px',
                                backgroundColor: isSelected ? 'rgba(255, 106, 19, 0.08)' : (cat.isHidden ? '#0a0a0f' : '#101018'),
                                border: isSelected ? '1.5px solid #ff6a13' : (cat.isHidden ? '1px dashed #232333' : '1px solid #1c1c28'),
                                borderRadius: '6px',
                                cursor: 'pointer',
                                opacity: cat.isHidden ? 0.6 : 1,
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {/* Left: Drag Handle & Order Arrows & Category Title */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '180px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', color: '#555566', cursor: 'grab' }} title="Drag to reorder">
                                  <GripVertical style={{ width: '16px', height: '16px' }} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveCategory(idx, idx - 1);
                                    }}
                                    style={{
                                      padding: '1px 3px',
                                      backgroundColor: 'transparent',
                                      border: 'none',
                                      color: idx === 0 ? '#333344' : '#aaa',
                                      cursor: idx === 0 ? 'default' : 'pointer'
                                    }}
                                    title="Move Up"
                                  >
                                    <ChevronUp style={{ width: '13px', height: '13px' }} />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === categoryItems.length - 1}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveCategory(idx, idx + 1);
                                    }}
                                    style={{
                                      padding: '1px 3px',
                                      backgroundColor: 'transparent',
                                      border: 'none',
                                      color: idx === categoryItems.length - 1 ? '#333344' : '#aaa',
                                      cursor: idx === categoryItems.length - 1 ? 'default' : 'pointer'
                                    }}
                                    title="Move Down"
                                  >
                                    <ChevronDown style={{ width: '13px', height: '13px' }} />
                                  </button>
                                </div>

                                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#ff6a13', minWidth: '24px' }}>
                                  {String(idx + 1).padStart(2, '0')}.
                                </span>

                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: isSelected ? 700 : 600, color: isSelected ? '#fff' : '#ddd' }}>
                                      {cat.title}
                                    </span>
                                    {cat.isHidden && (
                                      <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '3px', backgroundColor: '#2b2b3d', color: '#ff4444', fontWeight: 600 }}>
                                        HIDDEN
                                      </span>
                                    )}
                                  </div>
                                  <span style={{ fontSize: '11px', color: '#777788' }}>
                                    {cat.subtitle || 'Fine Art Photography & Film'}
                                  </span>
                                </div>
                              </div>

                              {/* Center: Media Type Badge */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {cat.mediaType === 'images' && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#131f13', color: '#4ade80', border: '1px solid #165b26', fontWeight: 600 }}>
                                    <Camera style={{ width: '11px', height: '11px' }} />
                                    <span>Images Only ({slideCount})</span>
                                  </span>
                                )}
                                {cat.mediaType === 'videos' && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#1c172a', color: '#a78bfa', border: '1px solid #432b7a', fontWeight: 600 }}>
                                    <Video style={{ width: '11px', height: '11px' }} />
                                    <span>Videos Only</span>
                                  </span>
                                )}
                                {cat.mediaType === 'both' && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#261b12', color: '#fb923c', border: '1px solid #7c3f15', fontWeight: 600 }}>
                                    <Layers style={{ width: '11px', height: '11px' }} />
                                    <span>Both ({slideCount} Slides + Video)</span>
                                  </span>
                                )}
                              </div>

                              {/* Right: Actions (Hide/Show & Delete) */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => handleToggleHideCategory(cat.id)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '5px 8px',
                                    backgroundColor: cat.isHidden ? '#1e1e2d' : '#142017',
                                    border: cat.isHidden ? '1px solid #33334a' : '1px solid #23522c',
                                    borderRadius: '4px',
                                    color: cat.isHidden ? '#888899' : '#4ade80',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                  title={cat.isHidden ? 'Click to Show on Live Website' : 'Click to Hide from Live Website'}
                                >
                                  {cat.isHidden ? <EyeOff style={{ width: '13px', height: '13px' }} /> : <Eye style={{ width: '13px', height: '13px' }} />}
                                  <span>{cat.isHidden ? 'Hidden' : 'Visible'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(cat.id, cat.title)}
                                  style={{
                                    padding: '6px',
                                    backgroundColor: '#1b1214',
                                    border: '1px solid #3d1b22',
                                    borderRadius: '4px',
                                    color: '#ff4444',
                                    cursor: 'pointer'
                                  }}
                                  title="Delete Category"
                                >
                                  <Trash2 style={{ width: '13px', height: '13px' }} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Category Editor Section */}
                    {(() => {
                      const activeCat = categoryItems.find(c => c.id === activeCatId) || categoryItems[0];
                      if (!activeCat) return null;

                      const isImages = activeCat.mediaType === 'images' || activeCat.mediaType === 'both';
                      const isVideos = activeCat.mediaType === 'videos' || activeCat.mediaType === 'both';
                      const slides = activeCat.slides || [];

                      return (
                        <div style={{ backgroundColor: '#0d0d14', border: '1px solid #222232', borderRadius: '8px', padding: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #1c1c28', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '10px', textTransform: 'uppercase', padding: '2px 6px', backgroundColor: '#ff6a13', color: '#fff', fontWeight: 700, borderRadius: '3px' }}>
                                  Editing Category
                                </span>
                                <h4 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: 600 }}>
                                  {activeCat.title}
                                </h4>
                              </div>
                              <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#888899' }}>
                                Configure title, subtitle, media type, and upload images/videos for this column.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleHideCategory(activeCat.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                backgroundColor: activeCat.isHidden ? '#201818' : '#142017',
                                border: activeCat.isHidden ? '1px solid #4a2323' : '1px solid #23522c',
                                borderRadius: '4px',
                                color: activeCat.isHidden ? '#ff6666' : '#4ade80',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              {activeCat.isHidden ? <EyeOff style={{ width: '13px', height: '13px' }} /> : <Eye style={{ width: '13px', height: '13px' }} />}
                              <span>{activeCat.isHidden ? 'Category is Hidden' : 'Category is Visible'}</span>
                            </button>
                          </div>

                          {/* Meta Settings: Title, Subtitle & Media Type */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#ccc', marginBottom: '6px' }}>
                                Category Title (Section 2 Column Header)
                              </label>
                              <input
                                type="text"
                                value={activeCat.title}
                                onChange={(e) => handleUpdateActiveCat({ title: e.target.value })}
                                placeholder="e.g. Fine Art Nuptials"
                                className="admin-input"
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#ccc', marginBottom: '6px' }}>
                                Subtitle / Venue Label
                              </label>
                              <input
                                type="text"
                                value={activeCat.subtitle || ''}
                                onChange={(e) => handleUpdateActiveCat({ subtitle: e.target.value })}
                                placeholder="e.g. Sacred Traditions & Ceremonies"
                                className="admin-input"
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                              />
                            </div>
                          </div>

                          {/* Media Type Selector (Images, Videos, Both) */}
                          <div style={{ marginBottom: '22px' }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#ff6a13', marginBottom: '8px', letterSpacing: '0.05em' }}>
                              Select Media Type for This Category
                            </label>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                              {[
                                {
                                  type: 'images',
                                  label: 'Images Only',
                                  desc: 'Upload rotating photo slides (uncropped responsive preview)',
                                  icon: Camera,
                                  accent: '#4ade80'
                                },
                                {
                                  type: 'videos',
                                  label: 'Videos Only',
                                  desc: 'Cinematic video or 360 interactive motion player',
                                  icon: Video,
                                  accent: '#a78bfa'
                                },
                                {
                                  type: 'both',
                                  label: 'Both (Images & Videos)',
                                  desc: 'Allows photo slides and cinematic video with switcher',
                                  icon: Layers,
                                  accent: '#fb923c'
                                }
                              ].map((opt) => {
                                const isSelected = activeCat.mediaType === opt.type;
                                const OptIcon = opt.icon;

                                return (
                                  <div
                                    key={opt.type}
                                    onClick={() => handleUpdateActiveCat({ mediaType: opt.type })}
                                    style={{
                                      padding: '12px',
                                      borderRadius: '6px',
                                      backgroundColor: isSelected ? 'rgba(255, 106, 19, 0.12)' : '#12121b',
                                      border: isSelected ? '1.5px solid #ff6a13' : '1px solid #1f1f2c',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                      <OptIcon style={{ width: '15px', height: '15px', color: isSelected ? '#ff6a13' : opt.accent }} />
                                      <span style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? '#fff' : '#ddd' }}>
                                        {opt.label}
                                      </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '11px', color: '#888899', lineHeight: 1.35 }}>
                                      {opt.desc}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* -------------------------------------------------- */}
                          {/* 1. PHOTO SLIDES MANAGER (IF images or both)        */}
                          {/* -------------------------------------------------- */}
                          {isImages && (
                            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#101018', border: '1px solid #1f1f2e', borderRadius: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Camera style={{ width: '15px', height: '15px', color: '#ff6a13' }} />
                                  <strong style={{ fontSize: '13px', color: '#fff' }}>
                                    Rotating Photo Slides ({slides.length} Photos)
                                  </strong>
                                </div>

                                <button
                                  type="button"
                                  onClick={handleAddSlideToActiveCat}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 12px',
                                    backgroundColor: '#1c1c28',
                                    border: '1px solid #333346',
                                    color: '#eee',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Plus style={{ width: '12px', height: '12px', color: '#ff6a13' }} />
                                  <span>Add Another Slide</span>
                                </button>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {slides.map((slide, sIdx) => (
                                  <div
                                    key={slide.id || sIdx}
                                    style={{
                                      padding: '12px 14px',
                                      backgroundColor: '#14141e',
                                      border: '1px solid #232334',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px',
                                      flexWrap: 'wrap'
                                    }}
                                  >
                                    {/* Thumbnail */}
                                    <div style={{ position: 'relative' }}>
                                      <img
                                        src={slide.url}
                                        alt={`Slide ${sIdx + 1}`}
                                        style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ff6a13' }}
                                      />
                                      <span
                                        style={{
                                          position: 'absolute',
                                          top: '2px',
                                          left: '2px',
                                          fontSize: '9px',
                                          fontWeight: 700,
                                          padding: '1px 4px',
                                          backgroundColor: 'rgba(0,0,0,0.85)',
                                          color: '#ff6a13',
                                          borderRadius: '2px'
                                        }}
                                      >
                                        #{sIdx + 1}
                                      </span>
                                    </div>

                                    {/* Inputs */}
                                    <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                          type="text"
                                          value={slide.title || ''}
                                          placeholder="Slide Title / Caption"
                                          onChange={(e) => {
                                            const updatedSlides = [...slides];
                                            updatedSlides[sIdx] = { ...updatedSlides[sIdx], title: e.target.value };
                                            handleUpdateActiveCat({ slides: updatedSlides });
                                          }}
                                          className="admin-input"
                                          style={{ flex: 1, padding: '5px 8px', borderRadius: '4px', fontSize: '11px' }}
                                        />
                                        <input
                                          type="text"
                                          value={slide.location || ''}
                                          placeholder="Venue / Location"
                                          onChange={(e) => {
                                            const updatedSlides = [...slides];
                                            updatedSlides[sIdx] = { ...updatedSlides[sIdx], location: e.target.value };
                                            handleUpdateActiveCat({ slides: updatedSlides });
                                          }}
                                          className="admin-input"
                                          style={{ flex: 1, padding: '5px 8px', borderRadius: '4px', fontSize: '11px' }}
                                        />
                                      </div>

                                      <input
                                        type="text"
                                        value={slide.url || ''}
                                        placeholder="Image URL or upload file"
                                        onChange={(e) => {
                                          const updatedSlides = [...slides];
                                          updatedSlides[sIdx] = { ...updatedSlides[sIdx], url: e.target.value };
                                          handleUpdateActiveCat({ slides: updatedSlides });
                                        }}
                                        className="admin-input"
                                        style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }}
                                      />
                                    </div>

                                    {/* Buttons: Upload, Frame Editor, Delete */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 10px', backgroundColor: '#1c1c28', border: '1px solid #333346', color: '#eee', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                        <Upload style={{ width: '12px', height: '12px', color: '#ff6a13' }} />
                                        <span>Upload</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          style={{ display: 'none' }}
                                          onChange={(e) => handleImageFileChange(e, (dataUrl) => {
                                            openHeroEditor(dataUrl, `${activeCat.title} - Slide ${sIdx + 1}`, (framedUrl) => {
                                              const updatedSlides = [...slides];
                                              updatedSlides[sIdx] = { ...updatedSlides[sIdx], url: framedUrl };
                                              handleUpdateActiveCat({ slides: updatedSlides });
                                            });
                                          })}
                                        />
                                      </label>

                                      <button
                                        type="button"
                                        onClick={() => openHeroEditor(slide.url, `${activeCat.title} - Slide ${sIdx + 1}`, (framedUrl) => {
                                          const updatedSlides = [...slides];
                                          updatedSlides[sIdx] = { ...updatedSlides[sIdx], url: framedUrl };
                                          handleUpdateActiveCat({ slides: updatedSlides });
                                        })}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '5px',
                                          padding: '6px 10px',
                                          backgroundColor: '#1c1c28',
                                          border: '1px solid #333346',
                                          color: '#ff6a13',
                                          borderRadius: '4px',
                                          fontSize: '11px',
                                          fontWeight: 600,
                                          cursor: 'pointer',
                                          whiteSpace: 'nowrap'
                                        }}
                                        title="Adjust framing, zoom, crop without distortion"
                                      >
                                        <Crop style={{ width: '12px', height: '12px' }} />
                                        <span>Frame</span>
                                      </button>

                                      {slides.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveSlideFromActiveCat(sIdx)}
                                          style={{
                                            padding: '6px 8px',
                                            backgroundColor: '#201215',
                                            border: '1px solid #4a2128',
                                            color: '#ff4444',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                          }}
                                          title="Delete Slide"
                                        >
                                          <Trash2 style={{ width: '12px', height: '12px' }} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* -------------------------------------------------- */}
                          {/* 2. VIDEO MANAGER (IF videos or both)               */}
                          {/* -------------------------------------------------- */}
                          {isVideos && (
                            <div style={{ padding: '16px', backgroundColor: '#101018', border: '1px solid #1f1f2e', borderRadius: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                                <Video style={{ width: '15px', height: '15px', color: '#ff6a13' }} />
                                <strong style={{ fontSize: '13px', color: '#fff' }}>
                                  Cinematic Video & 360 Reel
                                </strong>
                              </div>

                              {/* Interactive Live Video Preview */}
                              {activeCat.videoUrl && (
                                <div style={{ marginBottom: '14px', backgroundColor: '#07070a', border: '1px solid #20202e', borderRadius: '6px', overflow: 'hidden', padding: '10px' }}>
                                  <span style={{ fontSize: '11px', color: '#888899', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                                    Interactive Video Preview:
                                  </span>
                                  <video
                                    key={activeCat.videoUrl}
                                    src={activeCat.videoUrl}
                                    poster={activeCat.videoPoster}
                                    controls
                                    muted
                                    playsInline
                                    style={{ width: '100%', maxHeight: '200px', borderRadius: '4px', backgroundColor: '#000', objectFit: 'contain' }}
                                  />
                                </div>
                              )}

                              {/* Video Source Controls */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#ddd', marginBottom: '6px' }}>
                                    Video Source (.mp4 / .webm File Upload or Direct URL)
                                  </label>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#ff6a13', color: '#fff', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                                      <Upload style={{ width: '13px', height: '13px' }} />
                                      <span>Upload Video File (MP4/WebM)</span>
                                      <input
                                        type="file"
                                        accept="video/mp4,video/webm"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleVideoFileChange(e, (videoDataUrl) => {
                                          handleUpdateActiveCat({ videoUrl: videoDataUrl });
                                        })}
                                      />
                                    </label>
                                    <span style={{ fontSize: '11px', color: '#777788' }}>
                                      Direct file upload (up to 25MB) or enter URL below:
                                    </span>
                                  </div>

                                  <input
                                    type="text"
                                    value={activeCat.videoUrl || ''}
                                    placeholder="https://.../video.mp4"
                                    onChange={(e) => handleUpdateActiveCat({ videoUrl: e.target.value })}
                                    className="admin-input"
                                    style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }}
                                  />
                                </div>

                                {/* Poster Thumbnail */}
                                <div>
                                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#ddd', marginBottom: '6px' }}>
                                    Video Poster Image (Thumbnail before play)
                                  </label>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    {activeCat.videoPoster && (
                                      <img
                                        src={activeCat.videoPoster}
                                        alt="Poster"
                                        style={{ width: '60px', height: '42px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ff6a13', cursor: 'pointer' }}
                                        onClick={() => openHeroEditor(activeCat.videoPoster, `${activeCat.title} - Video Poster`, (framedUrl) => {
                                          handleUpdateActiveCat({ videoPoster: framedUrl });
                                        })}
                                        title="Click to adjust position in Preview Editor"
                                      />
                                    )}
                                    <input
                                      type="text"
                                      value={activeCat.videoPoster || ''}
                                      placeholder="Poster Image URL"
                                      onChange={(e) => handleUpdateActiveCat({ videoPoster: e.target.value })}
                                      className="admin-input"
                                      style={{ flex: 1, minWidth: '200px', padding: '7px 10px', borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }}
                                    />
                                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', backgroundColor: '#181824', border: '1px solid #2e2e42', color: '#eee', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                                      <Upload style={{ width: '12px', height: '12px', color: '#ff6a13' }} />
                                      <span>Upload Poster</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleImageFileChange(e, (dataUrl) => {
                                          openHeroEditor(dataUrl, `${activeCat.title} - Video Poster`, (framedUrl) => {
                                            handleUpdateActiveCat({ videoPoster: framedUrl });
                                          });
                                        })}
                                      />
                                    </label>
                                    {activeCat.videoPoster && (
                                      <button
                                        type="button"
                                        onClick={() => openHeroEditor(activeCat.videoPoster, `${activeCat.title} - Video Poster`, (framedUrl) => {
                                          handleUpdateActiveCat({ videoPoster: framedUrl });
                                        })}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 12px', backgroundColor: '#181824', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                                        title="Adjust framing, zoom, and position"
                                      >
                                        <Crop style={{ width: '12px', height: '12px' }} />
                                        <span>Adjust & Frame</span>
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Video Caption */}
                                <div>
                                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#ddd', marginBottom: '6px' }}>
                                    Video Overlay Caption / Title
                                  </label>
                                  <input
                                    type="text"
                                    value={activeCat.videoTitle || ''}
                                    placeholder="e.g. 360° Cinematic Reel"
                                    onChange={(e) => handleUpdateActiveCat({ videoTitle: e.target.value })}
                                    className="admin-input"
                                    style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Modal: Add New Category Dialog */}
                    {showAddCatModal && (
                      <div 
                        style={{
                          position: 'fixed',
                          inset: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.85)',
                          backdropFilter: 'blur(8px)',
                          zIndex: 9999,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '16px'
                        }}
                      >
                        <div 
                          style={{
                            width: '100%',
                            maxWidth: '520px',
                            backgroundColor: '#0d0d14',
                            border: '1px solid #2e2e42',
                            borderRadius: '10px',
                            padding: '24px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.9)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Plus style={{ width: '18px', height: '18px', color: '#ff6a13' }} />
                              <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: 700 }}>
                                Create New Category
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowAddCatModal(false)}
                              style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}
                            >
                              <X style={{ width: '18px', height: '18px' }} />
                            </button>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#ddd', marginBottom: '6px' }}>
                                Category Name / Title *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Fine Art Portraits, Drone Cinematography, Maternity"
                                value={newCatForm.title}
                                onChange={(e) => setNewCatForm({ ...newCatForm, title: e.target.value })}
                                className="admin-input"
                                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
                                autoFocus
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#ddd', marginBottom: '6px' }}>
                                Subtitle / Venue Tagline
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Studio & Natural Light Heirloom Portraits"
                                value={newCatForm.subtitle}
                                onChange={(e) => setNewCatForm({ ...newCatForm, subtitle: e.target.value })}
                                className="admin-input"
                                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#ff6a13', marginBottom: '6px' }}>
                                Media Format Type
                              </label>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                {[
                                  { type: 'images', label: 'Images', icon: Camera },
                                  { type: 'videos', label: 'Videos', icon: Video },
                                  { type: 'both', label: 'Both', icon: Layers }
                                ].map((m) => {
                                  const isSel = newCatForm.mediaType === m.type;
                                  const MIcon = m.icon;
                                  return (
                                    <button
                                      key={m.type}
                                      type="button"
                                      onClick={() => setNewCatForm({ ...newCatForm, mediaType: m.type })}
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '12px 8px',
                                        borderRadius: '6px',
                                        backgroundColor: isSel ? 'rgba(255, 106, 19, 0.15)' : '#14141e',
                                        border: isSel ? '1.5px solid #ff6a13' : '1px solid #232334',
                                        color: isSel ? '#ff6a13' : '#aaa',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <MIcon style={{ width: '16px', height: '16px' }} />
                                      <span style={{ fontSize: '11px', fontWeight: 600 }}>{m.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                              type="button"
                              onClick={() => setShowAddCatModal(false)}
                              style={{
                                padding: '9px 16px',
                                backgroundColor: '#1a1a26',
                                border: '1px solid #333346',
                                color: '#ccc',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddCategory}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '9px 20px',
                                backgroundColor: '#ff6a13',
                                border: 'none',
                                color: '#fff',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(255, 106, 19, 0.4)'
                              }}
                            >
                              <Plus style={{ width: '14px', height: '14px' }} />
                              <span>Create Category</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* --------------------------------------------------------- */}
                  {/* SECTION 3: STORY & PHILOSOPHY */}
                  {/* --------------------------------------------------------- */}
                  <div className="admin-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                      <div>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6a13', fontWeight: 700 }}>
                          SECTION 3
                        </span>
                        <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', color: '#fff' }}>
                          Philosophy & Story Section
                        </h3>
                      </div>
                      <span style={{ fontSize: '11px', color: '#888899', fontFamily: 'monospace' }}>Editorial Narrative</span>
                    </div>

                    {/* Section Background Controller */}
                    <div style={{ padding: '16px', backgroundColor: '#12121b', border: '1px solid #1f1f2e', borderRadius: '6px', marginBottom: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Palette style={{ width: '15px', height: '15px', color: '#ff6a13' }} />
                        <strong style={{ fontSize: '13px', color: '#fff' }}>Story Section Background</strong>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ddd', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="storyBgType"
                            checked={homeCms.story.bgType === 'default'}
                            onChange={() => setHomeCms({
                              ...homeCms,
                              story: { ...homeCms.story, bgType: 'default' }
                            })}
                            style={{ accentColor: '#ff6a13' }}
                          />
                          <span>Default Dark Gradient (#060608 via #08080c)</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ddd', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="storyBgType"
                            checked={homeCms.story.bgType === 'custom'}
                            onChange={() => saveAndPublishStoryUpdate({ bgType: 'custom' })}
                            style={{ accentColor: '#ff6a13' }}
                          />
                          <span style={{ color: '#ff6a13', fontWeight: 600 }}>Custom Background Image</span>
                        </label>
                      </div>

                      {homeCms.story.bgType === 'custom' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '10px', borderTop: '1px solid #1e1e2d' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            {homeCms.story.customBgImage && (
                              <img
                                src={homeCms.story.customBgImage}
                                alt="Story Bg Preview"
                                style={{ width: '90px', height: '54px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ff6a13', cursor: 'pointer' }}
                                onClick={() => openHeroEditor(homeCms.story.customBgImage, 'Adjust Story Section Background', (croppedUrl) => {
                                  saveAndPublishStoryUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                })}
                                title="Click to adjust position in Preview Editor"
                              />
                            )}
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#ff6a13', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                              <Upload style={{ width: '13px', height: '13px' }} />
                              <span>Upload Background Image File</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageFileChange(e, (dataUrl) => {
                                  openHeroEditor(dataUrl, 'Adjust Story Section Background', (croppedUrl) => {
                                    saveAndPublishStoryUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                  });
                                })}
                              />
                            </label>

                            {homeCms.story.customBgImage && (
                              <button
                                type="button"
                                onClick={() => openHeroEditor(homeCms.story.customBgImage, 'Adjust Story Section Background', (croppedUrl) => {
                                  saveAndPublishStoryUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                })}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#181824', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                title="Adjust framing, zoom, and position"
                              >
                                <Crop style={{ width: '13px', height: '13px' }} />
                                <span>Adjust & Frame Position</span>
                              </button>
                            )}

                            <input
                              type="text"
                              placeholder="Or paste background image URL..."
                              value={homeCms.story.customBgImage || ''}
                              onChange={(e) => saveAndPublishStoryUpdate({ bgType: 'custom', customBgImage: e.target.value })}
                              className="admin-input"
                              style={{ flex: 1, minWidth: '220px', padding: '8px 12px', borderRadius: '4px', fontSize: '12px' }}
                            />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', color: '#888899', fontFamily: 'monospace' }}>Darkness Overlay:</span>
                            <input
                              type="range"
                              min="0"
                              max="0.80"
                              step="0.05"
                              value={homeCms.story.bgOpacity !== undefined ? homeCms.story.bgOpacity : 0.40}
                              onChange={(e) => saveAndPublishStoryUpdate({ bgOpacity: parseFloat(e.target.value) })}
                              style={{ width: '160px', accentColor: '#ff6a13' }}
                            />
                            <span style={{ fontSize: '11px', color: '#ff6a13', fontFamily: 'monospace', fontWeight: 600 }}>
                              {Math.round((homeCms.story.bgOpacity !== undefined ? homeCms.story.bgOpacity : 0.40) * 100)}% Darkness
                              {(homeCms.story.bgOpacity ?? 0.40) <= 0.40 ? ' (Clear & Vibrant)' : ''}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Story Featured In-Content Image Upload (Auto Portrait & Landscape) */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <strong style={{ fontSize: '13px', color: '#fff' }}>
                          Featured Story Image (Auto-Adapts to Portrait or Landscape)
                        </strong>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#181824', color: '#ff6a13', border: '1px solid rgba(255, 106, 19, 0.25)', fontFamily: 'monospace', fontWeight: 600 }}>
                          Full Image Visibility • Zero Cropping
                        </span>
                      </div>

                      <div style={{ padding: '16px', backgroundColor: '#101018', border: '1px solid #1c1c28', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', width: '130px', height: '110px', backgroundColor: '#07070a', borderRadius: '4px', border: '1px solid #ff6a13', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img
                            src={homeCms.story.featuredImage}
                            alt="Story Featured Preview"
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', cursor: 'pointer' }}
                            onClick={() => openHeroEditor(homeCms.story.featuredImage, 'Adjust Story Featured Image', (croppedUrl) => {
                              saveAndPublishStoryUpdate({ featuredImage: croppedUrl });
                            })}
                            title="Click to adjust position in Preview Editor"
                          />
                          <span style={{ position: 'absolute', bottom: '2px', right: '2px', fontSize: '9px', padding: '1px 4px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ff6a13', borderRadius: '2px', fontWeight: 700 }}>
                            FULL PREVIEW
                          </span>
                        </div>

                        <div style={{ flex: 1, minWidth: '220px' }}>
                          <span style={{ fontSize: '12px', color: '#888899', display: 'block', marginBottom: '6px' }}>
                            Upload any photo (Portrait vertical or Landscape horizontal). The website section automatically detects the dimensions and renders the full image without cropping!
                          </span>
                          <input
                            type="text"
                            value={homeCms.story.featuredImage}
                            onChange={(e) => saveAndPublishStoryUpdate({ featuredImage: e.target.value })}
                            className="admin-input"
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box', marginBottom: '10px' }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', backgroundColor: '#ff6a13', color: '#fff', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                              <Upload style={{ width: '12px', height: '12px' }} />
                              <span>Upload Image File</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageFileChange(e, (dataUrl) => {
                                  openHeroEditor(dataUrl, 'Adjust Story Featured Image', (croppedUrl) => {
                                    saveAndPublishStoryUpdate({ featuredImage: croppedUrl });
                                  });
                                })}
                              />
                            </label>

                            {homeCms.story.featuredImage && (
                              <button
                                type="button"
                                onClick={() => openHeroEditor(homeCms.story.featuredImage, 'Adjust Story Featured Image', (croppedUrl) => {
                                  saveAndPublishStoryUpdate({ featuredImage: croppedUrl });
                                })}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', backgroundColor: '#181824', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                                title="Adjust framing, zoom, and position"
                              >
                                <Crop style={{ width: '12px', height: '12px' }} />
                                <span>Adjust & Frame Position</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --------------------------------------------------------- */}
                  {/* SECTION 4: REVIEWS SECTION BACKGROUND */}
                  {/* --------------------------------------------------------- */}
                  <div className="admin-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                      <div>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6a13', fontWeight: 700 }}>
                          SECTION 4
                        </span>
                        <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', color: '#fff' }}>
                          Reviews Section Background
                        </h3>
                      </div>
                      <span style={{ fontSize: '11px', color: '#888899', fontFamily: 'monospace' }}>Testimonials Grid</span>
                    </div>

                    <div style={{ padding: '16px', backgroundColor: '#12121b', border: '1px solid #1f1f2e', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ddd', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="reviewsBgType"
                            checked={homeCms.reviews.bgType === 'default'}
                            onChange={() => setHomeCms({
                              ...homeCms,
                              reviews: { ...homeCms.reviews, bgType: 'default' }
                            })}
                            style={{ accentColor: '#ff6a13' }}
                          />
                          <span>Default Dark Tone (#060608 via #09090e)</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ddd', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="reviewsBgType"
                            checked={homeCms.reviews.bgType === 'custom'}
                            onChange={() => saveAndPublishReviewsUpdate({ bgType: 'custom' })}
                            style={{ accentColor: '#ff6a13' }}
                          />
                          <span style={{ color: '#ff6a13', fontWeight: 600 }}>Custom Background Image</span>
                        </label>
                      </div>

                      {homeCms.reviews.bgType === 'custom' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '10px', borderTop: '1px solid #1e1e2d' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            {homeCms.reviews.customBgImage && (
                              <img
                                src={homeCms.reviews.customBgImage}
                                alt="Reviews Bg Preview"
                                style={{ width: '90px', height: '54px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ff6a13', cursor: 'pointer' }}
                                onClick={() => openHeroEditor(homeCms.reviews.customBgImage, 'Adjust Reviews Section Background', (croppedUrl) => {
                                  saveAndPublishReviewsUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                })}
                                title="Click to adjust position in Preview Editor"
                              />
                            )}
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#ff6a13', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                              <Upload style={{ width: '13px', height: '13px' }} />
                              <span>Upload Background Image File</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageFileChange(e, (dataUrl) => {
                                  openHeroEditor(dataUrl, 'Adjust Reviews Section Background', (croppedUrl) => {
                                    saveAndPublishReviewsUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                  });
                                })}
                              />
                            </label>

                            {homeCms.reviews.customBgImage && (
                              <button
                                type="button"
                                onClick={() => openHeroEditor(homeCms.reviews.customBgImage, 'Adjust Reviews Section Background', (croppedUrl) => {
                                  saveAndPublishReviewsUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                })}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#181824', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                title="Adjust framing, zoom, and position"
                              >
                                <Crop style={{ width: '13px', height: '13px' }} />
                                <span>Adjust & Frame Position</span>
                              </button>
                            )}

                            <input
                              type="text"
                              placeholder="Or paste background image URL..."
                              value={homeCms.reviews.customBgImage || ''}
                              onChange={(e) => saveAndPublishReviewsUpdate({ bgType: 'custom', customBgImage: e.target.value })}
                              className="admin-input"
                              style={{ flex: 1, minWidth: '220px', padding: '8px 12px', borderRadius: '4px', fontSize: '12px' }}
                            />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', color: '#888899', fontFamily: 'monospace' }}>Darkness Overlay:</span>
                            <input
                              type="range"
                              min="0"
                              max="0.80"
                              step="0.05"
                              value={homeCms.reviews.bgOpacity !== undefined ? homeCms.reviews.bgOpacity : 0.40}
                              onChange={(e) => saveAndPublishReviewsUpdate({ bgOpacity: parseFloat(e.target.value) })}
                              style={{ width: '160px', accentColor: '#ff6a13' }}
                            />
                            <span style={{ fontSize: '11px', color: '#ff6a13', fontFamily: 'monospace', fontWeight: 600 }}>
                              {Math.round((homeCms.reviews.bgOpacity !== undefined ? homeCms.reviews.bgOpacity : 0.40) * 100)}% Darkness
                              {(homeCms.reviews.bgOpacity ?? 0.40) <= 0.40 ? ' (Clear & Vibrant)' : ''}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* --------------------------------------------------------- */}
                  {/* SECTION 5: CONTACT CALLOUT BANNER BACKGROUND */}
                  {/* --------------------------------------------------------- */}
                  <div className="admin-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                      <div>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6a13', fontWeight: 700 }}>
                          SECTION 5
                        </span>
                        <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', color: '#fff' }}>
                          Studio Callout Banner Background
                        </h3>
                      </div>
                      <span style={{ fontSize: '11px', color: '#888899', fontFamily: 'monospace' }}>Bottom CTA Banner</span>
                    </div>

                    <div style={{ padding: '16px', backgroundColor: '#12121b', border: '1px solid #1f1f2e', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ddd', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="calloutBgType"
                            checked={homeCms.callout.bgType === 'default'}
                            onChange={() => setHomeCms({
                              ...homeCms,
                              callout: { ...homeCms.callout, bgType: 'default' }
                            })}
                            style={{ accentColor: '#ff6a13' }}
                          />
                          <span>Default Dark Tone (#07070a to #050507)</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ddd', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="calloutBgType"
                            checked={homeCms.callout.bgType === 'custom'}
                            onChange={() => saveAndPublishCalloutUpdate({ bgType: 'custom' })}
                            style={{ accentColor: '#ff6a13' }}
                          />
                          <span style={{ color: '#ff6a13', fontWeight: 600 }}>Custom Background Image</span>
                        </label>
                      </div>

                      {homeCms.callout.bgType === 'custom' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '10px', borderTop: '1px solid #1e1e2d' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            {homeCms.callout.customBgImage && (
                              <img
                                src={homeCms.callout.customBgImage}
                                alt="Callout Bg Preview"
                                style={{ width: '90px', height: '54px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ff6a13', cursor: 'pointer' }}
                                onClick={() => openHeroEditor(homeCms.callout.customBgImage, 'Adjust Callout Banner Background', (croppedUrl) => {
                                  saveAndPublishCalloutUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                })}
                                title="Click to adjust position in Preview Editor"
                              />
                            )}
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#ff6a13', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                              <Upload style={{ width: '13px', height: '13px' }} />
                              <span>Upload Background Image File</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageFileChange(e, (dataUrl) => {
                                  openHeroEditor(dataUrl, 'Adjust Callout Banner Background', (croppedUrl) => {
                                    saveAndPublishCalloutUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                  });
                                })}
                              />
                            </label>

                            {homeCms.callout.customBgImage && (
                              <button
                                type="button"
                                onClick={() => openHeroEditor(homeCms.callout.customBgImage, 'Adjust Callout Banner Background', (croppedUrl) => {
                                  saveAndPublishCalloutUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                })}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#181824', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                title="Adjust framing, zoom, and position"
                              >
                                <Crop style={{ width: '13px', height: '13px' }} />
                                <span>Adjust & Frame Position</span>
                              </button>
                            )}

                            <input
                              type="text"
                              placeholder="Or paste background image URL..."
                              value={homeCms.callout.customBgImage || ''}
                              onChange={(e) => saveAndPublishCalloutUpdate({ bgType: 'custom', customBgImage: e.target.value })}
                              className="admin-input"
                              style={{ flex: 1, minWidth: '220px', padding: '8px 12px', borderRadius: '4px', fontSize: '12px' }}
                            />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', color: '#888899', fontFamily: 'monospace' }}>Darkness Overlay:</span>
                            <input
                              type="range"
                              min="0"
                              max="0.80"
                              step="0.05"
                              value={homeCms.callout.bgOpacity !== undefined ? homeCms.callout.bgOpacity : 0.40}
                              onChange={(e) => saveAndPublishCalloutUpdate({ bgOpacity: parseFloat(e.target.value) })}
                              style={{ width: '160px', accentColor: '#ff6a13' }}
                            />
                            <span style={{ fontSize: '11px', color: '#ff6a13', fontFamily: 'monospace', fontWeight: 600 }}>
                              {Math.round((homeCms.callout.bgOpacity !== undefined ? homeCms.callout.bgOpacity : 0.40) * 100)}% Darkness
                              {(homeCms.callout.bgOpacity ?? 0.40) <= 0.40 ? ' (Clear & Vibrant)' : ''}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Bottom Floating Save Action */}
                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    onClick={handleResetHome}
                    style={{ padding: '11px 18px', backgroundColor: '#13131c', border: '1px solid #222233', color: '#bbb', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Reset Defaults
                  </button>
                  <button
                    onClick={handleSaveHome}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 28px', backgroundColor: '#ff6a13', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', boxShadow: '0 4px 18px rgba(255,106,19,0.35)' }}
                  >
                    <Save style={{ width: '15px', height: '15px' }} />
                    <span>SAVE ALL HOME CHANGES</span>
                  </button>
                </div>

              </div>
            )}

            {/* ============================================================= */}
            {/* ABOUT US PAGE CUSTOMIZER & DYNAMIC SECTION BUILDER */}
            {/* ============================================================= */}
            {activeSection === 'customize-about' && (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#ff6a13', fontFamily: 'monospace', fontWeight: 700 }}>
                        ● PAGE STUDIO & BUILDER
                      </span>
                      <Link to="/about" target="_blank" style={{ fontSize: '11px', color: '#ff6a13', display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}>
                        <span>View Live About Page</span>
                        <ExternalLink style={{ width: '11px', height: '11px' }} />
                      </Link>
                    </div>
                    <h1 style={{ margin: 0, fontSize: '24px', color: '#fff', fontWeight: 400 }}>Customize About Us Page</h1>
                    <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#888899' }}>
                      Build rich editorial chapters. Photos automatically adapt to Portrait or Landscape with zero crop. Sections descend with alternating layout.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={handleAddAboutSection}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', backgroundColor: '#181824', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      <Plus style={{ width: '14px', height: '14px' }} />
                      <span>Add New Section</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => {
                        saveAboutContent(aboutCms);
                        setSaveSuccessMsg('✓ About Us page saved and published live!');
                        setTimeout(() => setSaveSuccessMsg(''), 5000);
                      }} 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 22px', backgroundColor: '#ff6a13', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,106,19,0.35)' }}
                    >
                      <Save style={{ width: '14px', height: '14px' }} />
                      <span>Save All Changes</span>
                    </button>
                  </div>
                </div>

                {/* 1. Page Header Card */}
                <div className="admin-card" style={{ padding: '20px', marginBottom: '24px', backgroundColor: '#101018', border: '1px solid #222232', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Sparkles style={{ width: '15px', height: '15px', color: '#ff6a13' }} />
                    <strong style={{ fontSize: '13px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>About Us Page Header & Hero Banner</strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>Header Badge</label>
                      <input 
                        type="text" 
                        value={aboutCms.header?.badge || ''} 
                        onChange={(e) => saveAndPublishAboutUpdate({ header: { ...aboutCms.header, badge: e.target.value } })} 
                        className="admin-input" 
                        placeholder="e.g. OUR HERITAGE & ARTISTRY"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} 
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>Page Main Heading</label>
                      <input 
                        type="text" 
                        value={aboutCms.header?.title || ''} 
                        onChange={(e) => saveAndPublishAboutUpdate({ header: { ...aboutCms.header, title: e.target.value } })} 
                        className="admin-input" 
                        placeholder="e.g. The Artisans Behind Captura LK"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} 
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>Header Narrative Subtitle</label>
                    <textarea 
                      rows={2} 
                      value={aboutCms.header?.subtitle || ''} 
                      onChange={(e) => saveAndPublishAboutUpdate({ header: { ...aboutCms.header, subtitle: e.target.value } })} 
                      className="admin-input" 
                      placeholder="Preserving Sri Lanka’s most distinguished nuptials..."
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box', resize: 'vertical' }} 
                    />
                  </div>
                </div>

                {/* 2. Dynamic Sections List */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#fff', display: 'block' }}>
                        Story Sections ({(aboutCms.sections || []).length} Chapters Active)
                      </strong>
                      <span style={{ fontSize: '12px', color: '#888899' }}>
                        Each section alternates position: Left Image & Right Narrative, descending downward.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddAboutSection}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', backgroundColor: '#ff6a13', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                    >
                      <Plus style={{ width: '13px', height: '13px' }} />
                      <span>Add Section Below</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {(aboutCms.sections || []).map((section, idx) => {
                      const isExpanded = expandedAboutSection === idx;
                      const isImageLeft = section.imagePosition ? section.imagePosition === 'left' : (idx % 2 === 0);

                      return (
                        <div 
                          key={section.id || idx}
                          style={{
                            backgroundColor: '#101018',
                            border: isExpanded ? '1px solid #ff6a13' : '1px solid #1e1e2c',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            transition: 'border-color 0.2s ease'
                          }}
                        >
                          {/* Card Summary Header Bar */}
                          <div 
                            style={{
                              padding: '12px 16px',
                              backgroundColor: isExpanded ? '#141420' : '#0d0d14',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '12px',
                              cursor: 'pointer',
                              borderBottom: isExpanded ? '1px solid #232334' : 'none'
                            }}
                            onClick={() => setExpandedAboutSection(isExpanded ? null : idx)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              {/* Reorder Buttons */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }} onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveAboutSection(idx, -1)}
                                  title="Move Section Up"
                                  style={{ padding: '2px', background: 'transparent', border: 'none', color: idx === 0 ? '#444' : '#ff6a13', cursor: idx === 0 ? 'default' : 'pointer' }}
                                >
                                  <ArrowUp style={{ width: '13px', height: '13px' }} />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (aboutCms.sections || []).length - 1}
                                  onClick={() => handleMoveAboutSection(idx, 1)}
                                  title="Move Section Down"
                                  style={{ padding: '2px', background: 'transparent', border: 'none', color: idx === (aboutCms.sections || []).length - 1 ? '#444' : '#ff6a13', cursor: idx === (aboutCms.sections || []).length - 1 ? 'default' : 'pointer' }}
                                >
                                  <ArrowDown style={{ width: '13px', height: '13px' }} />
                                </button>
                              </div>

                              {/* Thumbnail */}
                              <img
                                src={section.image || DEFAULT_ABOUT_CONTENT.sections[0].image}
                                alt={section.title}
                                style={{ width: '60px', height: '42px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #2b2b3d' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openHeroEditor(section.image, `Adjust Section ${idx + 1}: ${section.title}`, (croppedUrl) => {
                                    const newSections = [...aboutCms.sections];
                                    newSections[idx] = { ...newSections[idx], image: croppedUrl };
                                    saveAndPublishAboutUpdate({ sections: newSections });
                                  });
                                }}
                                title="Click to open Preview Editor"
                              />

                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', backgroundColor: '#1a1a2b', padding: '2px 6px', borderRadius: '3px', color: '#ff6a13', fontWeight: 600 }}>
                                    Chapter {idx + 1}
                                  </span>
                                  <span style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', backgroundColor: '#14141d', padding: '2px 6px', borderRadius: '3px', color: '#8888aa' }}>
                                    {isImageLeft ? '◧ Image Left' : '◨ Image Right'}
                                  </span>
                                </div>
                                <h3 style={{ margin: '3px 0 0 0', fontSize: '14px', color: '#fff', fontWeight: 600 }}>
                                  {section.title || `Section ${idx + 1}`}
                                </h3>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => openHeroEditor(section.image, `Adjust Section ${idx + 1}: ${section.title}`, (croppedUrl) => {
                                  const newSections = [...aboutCms.sections];
                                  newSections[idx] = { ...newSections[idx], image: croppedUrl };
                                  saveAndPublishAboutUpdate({ sections: newSections });
                                })}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 10px', backgroundColor: '#161622', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                              >
                                <Crop style={{ width: '12px', height: '12px' }} />
                                <span>Adjust Photo</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteAboutSection(idx)}
                                title="Delete Section"
                                style={{ padding: '6px', backgroundColor: '#201214', border: '1px solid #4a181d', color: '#f87171', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                <Trash2 style={{ width: '13px', height: '13px' }} />
                              </button>

                              <button
                                type="button"
                                onClick={() => setExpandedAboutSection(isExpanded ? null : idx)}
                                style={{ padding: '6px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
                              >
                                <ChevronDown style={{ width: '16px', height: '16px', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Section Editor */}
                          {isExpanded && (
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#0c0c12' }}>
                              
                              {/* Heading & Tagline Grid */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>
                                    Section Title
                                  </label>
                                  <input
                                    type="text"
                                    value={section.title || ''}
                                    onChange={(e) => {
                                      const newSections = [...aboutCms.sections];
                                      newSections[idx] = { ...newSections[idx], title: e.target.value };
                                      saveAndPublishAboutUpdate({ sections: newSections });
                                    }}
                                    className="admin-input"
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                                  />
                                </div>

                                <div>
                                  <label style={{ display: 'block', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>
                                    Section Tagline / Badge
                                  </label>
                                  <input
                                    type="text"
                                    value={section.tagline || ''}
                                    onChange={(e) => {
                                      const newSections = [...aboutCms.sections];
                                      newSections[idx] = { ...newSections[idx], tagline: e.target.value };
                                      saveAndPublishAboutUpdate({ sections: newSections });
                                    }}
                                    className="admin-input"
                                    placeholder="e.g. CAPTURING SOULS, CRAFTING HEIRLOOMS"
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                                  />
                                </div>
                              </div>

                              {/* 1. Layout Alignment Selector (Photo Left vs Photo Right) */}
                              <div style={{ padding: '16px', backgroundColor: '#11111b', border: '1px solid #1f1f2e', borderRadius: '6px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#ff6a13', marginBottom: '8px', letterSpacing: '0.05em' }}>
                                  Section Column Alignment (Choose Photo Side)
                                </label>
                                <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#888899' }}>
                                  Select whether the photo appears on the Left or Right side. The narrative content will automatically sit on the opposite side.
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                                  {/* Left Card: Photo on Left */}
                                  <div
                                    onClick={() => {
                                      const newSections = [...aboutCms.sections];
                                      newSections[idx] = { ...newSections[idx], imagePosition: 'left' };
                                      saveAndPublishAboutUpdate({ sections: newSections });
                                    }}
                                    style={{
                                      padding: '12px 14px',
                                      borderRadius: '6px',
                                      backgroundColor: isImageLeft ? 'rgba(255, 106, 19, 0.12)' : '#141420',
                                      border: isImageLeft ? '1.5px solid #ff6a13' : '1px solid #232334',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '14px', color: '#ff6a13' }}>◧</span>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: isImageLeft ? '#fff' : '#ccc' }}>
                                          Photo on Left Side
                                        </span>
                                      </div>
                                      <input
                                        type="radio"
                                        name={`pos-${idx}`}
                                        checked={isImageLeft}
                                        onChange={() => {}}
                                        style={{ accentColor: '#ff6a13' }}
                                      />
                                    </div>
                                    <span style={{ fontSize: '11px', color: '#888899', display: 'block' }}>
                                      Left: <strong>Photo (50%)</strong> • Right: <strong>Story Text (50%)</strong>
                                    </span>
                                  </div>

                                  {/* Right Card: Photo on Right */}
                                  <div
                                    onClick={() => {
                                      const newSections = [...aboutCms.sections];
                                      newSections[idx] = { ...newSections[idx], imagePosition: 'right' };
                                      saveAndPublishAboutUpdate({ sections: newSections });
                                    }}
                                    style={{
                                      padding: '12px 14px',
                                      borderRadius: '6px',
                                      backgroundColor: !isImageLeft ? 'rgba(255, 106, 19, 0.12)' : '#141420',
                                      border: !isImageLeft ? '1.5px solid #ff6a13' : '1px solid #232334',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '14px', color: '#ff6a13' }}>◨</span>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: !isImageLeft ? '#fff' : '#ccc' }}>
                                          Photo on Right Side
                                        </span>
                                      </div>
                                      <input
                                        type="radio"
                                        name={`pos-${idx}`}
                                        checked={!isImageLeft}
                                        onChange={() => {}}
                                        style={{ accentColor: '#ff6a13' }}
                                      />
                                    </div>
                                    <span style={{ fontSize: '11px', color: '#888899', display: 'block' }}>
                                      Left: <strong>Story Text (50%)</strong> • Right: <strong>Photo (50%)</strong>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* 2. Section Photo Uploader & Framing */}
                              <div style={{ padding: '16px', backgroundColor: '#11111b', border: '1px solid #1f1f2e', borderRadius: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                                  <strong style={{ fontSize: '12px', color: '#fff', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                                    Section Featured Story Photo
                                  </strong>
                                  <span style={{ fontSize: '11px', color: '#ff6a13', fontFamily: 'monospace' }}>
                                    Auto-adapts to Portrait or Landscape
                                  </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                  <img
                                    src={section.image}
                                    alt={section.title}
                                    style={{ width: '100px', height: '65px', objectFit: 'contain', backgroundColor: '#07070a', borderRadius: '4px', border: '1px solid #ff6a13', cursor: 'pointer' }}
                                    onClick={() => openHeroEditor(section.image, `Adjust Section ${idx + 1}: ${section.title}`, (croppedUrl) => {
                                      const newSections = [...aboutCms.sections];
                                      newSections[idx] = { ...newSections[idx], image: croppedUrl };
                                      saveAndPublishAboutUpdate({ sections: newSections });
                                    })}
                                    title="Click to adjust framing in Preview Editor"
                                  />

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '240px' }}>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', backgroundColor: '#ff6a13', color: '#fff', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                                        <Upload style={{ width: '12px', height: '12px' }} />
                                        <span>Upload Photo File</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          style={{ display: 'none' }}
                                          onChange={(e) => handleImageFileChange(e, (dataUrl) => {
                                            openHeroEditor(dataUrl, `Adjust Section ${idx + 1}: ${section.title}`, (croppedUrl) => {
                                              const newSections = [...aboutCms.sections];
                                              newSections[idx] = { ...newSections[idx], image: croppedUrl };
                                              saveAndPublishAboutUpdate({ sections: newSections });
                                            });
                                          })}
                                        />
                                      </label>

                                      <button
                                        type="button"
                                        onClick={() => openHeroEditor(section.image, `Adjust Section ${idx + 1}: ${section.title}`, (croppedUrl) => {
                                          const newSections = [...aboutCms.sections];
                                          newSections[idx] = { ...newSections[idx], image: croppedUrl };
                                          saveAndPublishAboutUpdate({ sections: newSections });
                                        })}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', backgroundColor: '#181824', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                                      >
                                        <Crop style={{ width: '12px', height: '12px' }} />
                                        <span>Adjust & Frame Position</span>
                                      </button>
                                    </div>

                                    <input
                                      type="text"
                                      placeholder="Or paste direct image URL..."
                                      value={section.image || ''}
                                      onChange={(e) => {
                                        const newSections = [...aboutCms.sections];
                                        newSections[idx] = { ...newSections[idx], image: e.target.value };
                                        saveAndPublishAboutUpdate({ sections: newSections });
                                      }}
                                      className="admin-input"
                                      style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* 3. Section Background Controller (Default Black vs Custom Background Image) */}
                              <div style={{ padding: '16px', backgroundColor: '#11111b', border: '1px solid #1f1f2e', borderRadius: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                  <Palette style={{ width: '15px', height: '15px', color: '#ff6a13' }} />
                                  <strong style={{ fontSize: '12px', color: '#fff', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                                    Section Background Theme
                                  </strong>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ddd', cursor: 'pointer' }}>
                                    <input
                                      type="radio"
                                      name={`bgType-${idx}`}
                                      checked={!section.bgType || section.bgType === 'default'}
                                      onChange={() => {
                                        const newSections = [...aboutCms.sections];
                                        newSections[idx] = { ...newSections[idx], bgType: 'default' };
                                        saveAndPublishAboutUpdate({ sections: newSections });
                                      }}
                                      style={{ accentColor: '#ff6a13' }}
                                    />
                                    <span>Default Solid Black Theme (#060608)</span>
                                  </label>

                                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ddd', cursor: 'pointer' }}>
                                    <input
                                      type="radio"
                                      name={`bgType-${idx}`}
                                      checked={section.bgType === 'custom'}
                                      onChange={() => {
                                        const newSections = [...aboutCms.sections];
                                        newSections[idx] = { ...newSections[idx], bgType: 'custom' };
                                        saveAndPublishAboutUpdate({ sections: newSections });
                                      }}
                                      style={{ accentColor: '#ff6a13' }}
                                    />
                                    <span style={{ color: '#ff6a13', fontWeight: 600 }}>Custom Background Image</span>
                                  </label>
                                </div>

                                {section.bgType === 'custom' && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '10px', borderTop: '1px solid #1e1e2d' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                      {section.customBgImage && (
                                        <img
                                          src={section.customBgImage}
                                          alt="Section Bg Preview"
                                          style={{ width: '90px', height: '54px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ff6a13', cursor: 'pointer' }}
                                          onClick={() => openHeroEditor(section.customBgImage, `Adjust Background for Section ${idx + 1}: ${section.title}`, (croppedUrl) => {
                                            const newSections = [...aboutCms.sections];
                                            newSections[idx] = { ...newSections[idx], bgType: 'custom', customBgImage: croppedUrl };
                                            saveAndPublishAboutUpdate({ sections: newSections });
                                          })}
                                          title="Click to adjust position in Preview Editor"
                                        />
                                      )}

                                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#ff6a13', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                        <Upload style={{ width: '13px', height: '13px' }} />
                                        <span>Upload Background Image File</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          style={{ display: 'none' }}
                                          onChange={(e) => handleImageFileChange(e, (dataUrl) => {
                                            openHeroEditor(dataUrl, `Adjust Background for Section ${idx + 1}: ${section.title}`, (croppedUrl) => {
                                              const newSections = [...aboutCms.sections];
                                              newSections[idx] = { ...newSections[idx], bgType: 'custom', customBgImage: croppedUrl };
                                              saveAndPublishAboutUpdate({ sections: newSections });
                                            });
                                          })}
                                        />
                                      </label>

                                      {section.customBgImage && (
                                        <button
                                          type="button"
                                          onClick={() => openHeroEditor(section.customBgImage, `Adjust Background for Section ${idx + 1}: ${section.title}`, (croppedUrl) => {
                                            const newSections = [...aboutCms.sections];
                                            newSections[idx] = { ...newSections[idx], bgType: 'custom', customBgImage: croppedUrl };
                                            saveAndPublishAboutUpdate({ sections: newSections });
                                          })}
                                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#181824', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                          title="Adjust framing, zoom, and position"
                                        >
                                          <Crop style={{ width: '13px', height: '13px' }} />
                                          <span>Adjust & Frame Position</span>
                                        </button>
                                      )}

                                      <input
                                        type="text"
                                        placeholder="Or paste background image URL..."
                                        value={section.customBgImage || ''}
                                        onChange={(e) => {
                                          const newSections = [...aboutCms.sections];
                                          newSections[idx] = { ...newSections[idx], bgType: 'custom', customBgImage: e.target.value };
                                          saveAndPublishAboutUpdate({ sections: newSections });
                                        }}
                                        className="admin-input"
                                        style={{ flex: 1, minWidth: '220px', padding: '8px 12px', borderRadius: '4px', fontSize: '12px' }}
                                      />
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', flexWrap: 'wrap' }}>
                                      <span style={{ fontSize: '11px', color: '#888899', fontFamily: 'monospace' }}>Darkness Overlay:</span>
                                      <input
                                        type="range"
                                        min="0"
                                        max="0.80"
                                        step="0.05"
                                        value={section.bgOpacity !== undefined ? section.bgOpacity : 0.40}
                                        onChange={(e) => {
                                          const newSections = [...aboutCms.sections];
                                          newSections[idx] = { ...newSections[idx], bgOpacity: parseFloat(e.target.value) };
                                          saveAndPublishAboutUpdate({ sections: newSections });
                                        }}
                                        style={{ width: '160px', accentColor: '#ff6a13' }}
                                      />
                                      <span style={{ fontSize: '11px', color: '#ff6a13', fontFamily: 'monospace', fontWeight: 600 }}>
                                        {Math.round((section.bgOpacity !== undefined ? section.bgOpacity : 0.40) * 100)}% Darkness
                                        {(section.bgOpacity ?? 0.40) <= 0.40 ? ' (Clear & Vibrant)' : ''}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Rich Text Editor for Narrative Story */}
                              <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>
                                  Section Narrative Story (Rich Text Editor)
                                </label>
                                <RichTextEditor
                                  value={section.richContent || ''}
                                  onChange={(newHtml) => {
                                    const newSections = [...aboutCms.sections];
                                    newSections[idx] = { ...newSections[idx], richContent: newHtml };
                                    saveAndPublishAboutUpdate({ sections: newSections });
                                  }}
                                  placeholder="Write the editorial narrative for this section..."
                                />
                              </div>

                              {/* Callout Quote */}
                              <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>
                                  Featured Callout Quote (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={section.quote || ''}
                                  onChange={(e) => {
                                    const newSections = [...aboutCms.sections];
                                    newSections[idx] = { ...newSections[idx], quote: e.target.value };
                                    saveAndPublishAboutUpdate({ sections: newSections });
                                  }}
                                  className="admin-input"
                                  placeholder='e.g. “In every glance, there exists a sacred stillness that deserves to be immortalized as fine art.”'
                                  style={{ width: '100%', padding: '9px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                                />
                              </div>

                              {/* Section Stats / Badges */}
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <label style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                                    Key Achievements & Badges (Optional)
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newSections = [...aboutCms.sections];
                                      const currentStats = Array.isArray(newSections[idx].stats) ? newSections[idx].stats : [];
                                      newSections[idx] = {
                                        ...newSections[idx],
                                        stats: [...currentStats, { label: 'New Metric', value: '100+' }]
                                      };
                                      saveAndPublishAboutUpdate({ sections: newSections });
                                    }}
                                    style={{ padding: '3px 8px', fontSize: '10px', backgroundColor: '#1a1a28', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '3px', cursor: 'pointer' }}
                                  >
                                    + Add Stat
                                  </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                                  {(section.stats || []).map((stat, sIdx) => (
                                    <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', backgroundColor: '#13131e', border: '1px solid #232334', borderRadius: '4px' }}>
                                      <input
                                        type="text"
                                        value={stat.value}
                                        placeholder="Value (e.g. 450+)"
                                        onChange={(e) => {
                                          const newSections = [...aboutCms.sections];
                                          const newStats = [...newSections[idx].stats];
                                          newStats[sIdx] = { ...newStats[sIdx], value: e.target.value };
                                          newSections[idx] = { ...newSections[idx], stats: newStats };
                                          saveAndPublishAboutUpdate({ sections: newSections });
                                        }}
                                        className="admin-input"
                                        style={{ width: '70px', padding: '4px 6px', fontSize: '11px', color: '#ff6a13', fontWeight: 600 }}
                                      />
                                      <input
                                        type="text"
                                        value={stat.label}
                                        placeholder="Label (e.g. Nuptials)"
                                        onChange={(e) => {
                                          const newSections = [...aboutCms.sections];
                                          const newStats = [...newSections[idx].stats];
                                          newStats[sIdx] = { ...newStats[sIdx], label: e.target.value };
                                          newSections[idx] = { ...newSections[idx], stats: newStats };
                                          saveAndPublishAboutUpdate({ sections: newSections });
                                        }}
                                        className="admin-input"
                                        style={{ flex: 1, padding: '4px 6px', fontSize: '11px' }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newSections = [...aboutCms.sections];
                                          newSections[idx] = {
                                            ...newSections[idx],
                                            stats: newSections[idx].stats.filter((_, i) => i !== sIdx)
                                          };
                                          saveAndPublishAboutUpdate({ sections: newSections });
                                        }}
                                        style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                                      >
                                        <X style={{ width: '12px', height: '12px' }} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Done Editing this Section Button */}
                              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid #1a1a28' }}>
                                <button
                                  type="button"
                                  onClick={() => setExpandedAboutSection(null)}
                                  style={{ padding: '6px 14px', backgroundColor: '#181824', border: '1px solid #2e2e44', color: '#ddd', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                                >
                                  Collapse Chapter {idx + 1}
                                </button>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Add & Save Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', padding: '16px 20px', backgroundColor: '#111119', border: '1px solid #1f1f2e', borderRadius: '6px', flexWrap: 'wrap', gap: '14px' }}>
                  <button
                    type="button"
                    onClick={handleAddAboutSection}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#181824', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    <Plus style={{ width: '14px', height: '14px' }} />
                    <span>Add New Section</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/about" target="_blank" style={{ fontSize: '12px', color: '#aaa', textDecoration: 'none' }}>
                      Preview Live About Us Page →
                    </Link>

                    <button 
                      type="button"
                      onClick={() => {
                        saveAboutContent(aboutCms);
                        setSaveSuccessMsg('✓ All About Us page sections saved and published live!');
                        setTimeout(() => setSaveSuccessMsg(''), 5000);
                      }} 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 28px', backgroundColor: '#ff6a13', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', boxShadow: '0 4px 18px rgba(255,106,19,0.35)' }}
                    >
                      <Save style={{ width: '15px', height: '15px' }} />
                      <span>Save All Changes</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* PORTFOLIO */}
            {activeSection === 'customize-portfolio' && (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
                  <h1 style={{ margin: 0, fontSize: '24px', color: '#fff', fontWeight: 400 }}>Customize Portfolio Page</h1>
                  <button onClick={() => triggerGenericSave('Portfolio Page')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: '#ff6a13', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    <Save style={{ width: '14px', height: '14px' }} />
                    <span>Save Changes</span>
                  </button>
                </div>
                <div className="admin-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>Portfolio Title</label>
                    <input type="text" value={portfolioData.galleryTitle} onChange={(e) => setPortfolioData({ ...portfolioData, galleryTitle: e.target.value })} className="admin-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>Active Wedding Categories</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {portfolioData.categories.map((cat, idx) => (
                        <div key={idx} style={{ padding: '6px 14px', backgroundColor: '#13131d', border: '1px solid #232336', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#ff6a13' }}>●</span>
                          <span style={{ color: '#fff' }}>{cat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CLIENT GALLERY */}
            {activeSection === 'customize-gallery' && (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
                  <h1 style={{ margin: 0, fontSize: '24px', color: '#fff', fontWeight: 400 }}>Customize Client Gallery</h1>
                  <button onClick={() => triggerGenericSave('Client Gallery Page')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: '#ff6a13', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    <Save style={{ width: '14px', height: '14px' }} />
                    <span>Save Changes</span>
                  </button>
                </div>
                <div className="admin-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>Gallery Portal Headline</label>
                    <input type="text" value={galleryData.galleryHeading} onChange={(e) => setGalleryData({ ...galleryData, galleryHeading: e.target.value })} className="admin-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#12121b', border: '1px solid #202030', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '13px', display: 'block' }}>PIN-Protected Vault Access</strong>
                      <span style={{ color: '#777788', fontSize: '11px' }}>Require 4-digit code for couple access</span>
                    </div>
                    <input type="checkbox" checked={galleryData.pinProtection} onChange={(e) => setGalleryData({ ...galleryData, pinProtection: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: '#ff6a13' }} />
                  </div>
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {activeSection === 'customize-reviews' && (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
                  <h1 style={{ margin: 0, fontSize: '24px', color: '#fff', fontWeight: 400 }}>Customize Reviews Page</h1>
                  <button onClick={() => triggerGenericSave('Reviews Page')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: '#ff6a13', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    <Save style={{ width: '14px', height: '14px' }} />
                    <span>Save Changes</span>
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reviewsList.map((rev, index) => (
                    <div key={rev.id} className="admin-card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <strong style={{ fontSize: '14px', color: '#fff' }}>{rev.names}</strong>
                        <div style={{ display: 'flex', color: '#ff6a13' }}>★★★★★</div>
                      </div>
                      <textarea rows={2} value={rev.quote} onChange={(e) => {
                        const updated = [...reviewsList];
                        updated[index].quote = e.target.value;
                        setReviewsList(updated);
                      }} className="admin-input" style={{ width: '100%', padding: '8px', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', fontStyle: 'italic' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONTACT US */}
            {activeSection === 'customize-contact' && (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
                  <h1 style={{ margin: 0, fontSize: '24px', color: '#fff', fontWeight: 400 }}>Customize Contact Us Page</h1>
                  <button onClick={() => triggerGenericSave('Contact Us Page')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: '#ff6a13', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    <Save style={{ width: '14px', height: '14px' }} />
                    <span>Save Changes</span>
                  </button>
                </div>
                <div className="admin-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>Physical Studio Address</label>
                    <input type="text" value={contactData.studioAddress} onChange={(e) => setContactData({ ...contactData, studioAddress: e.target.value })} className="admin-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>Primary Hotline Phone</label>
                      <input type="text" value={contactData.hotline1} onChange={(e) => setContactData({ ...contactData, hotline1: e.target.value })} className="admin-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>Direct Inquiries Email</label>
                      <input type="email" value={contactData.inquiryEmail} onChange={(e) => setContactData({ ...contactData, inquiryEmail: e.target.value })} className="admin-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* OVERVIEW */}
            {activeSection === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', color: '#fff', fontWeight: 400 }}>Executive Studio Overview</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div className="admin-card" style={{ padding: '20px' }}>
                    <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', color: '#888899', fontWeight: 600 }}>Active Inquiries</p>
                    <h3 style={{ margin: '8px 0 4px 0', fontSize: '28px', color: '#fff' }}>28 Couples</h3>
                    <span style={{ fontSize: '11px', color: '#34d399' }}>+18% this month</span>
                  </div>
                  <div className="admin-card" style={{ padding: '20px' }}>
                    <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', color: '#888899', fontWeight: 600 }}>Upcoming Shoots</p>
                    <h3 style={{ margin: '8px 0 4px 0', fontSize: '28px', color: '#fff' }}>12 Weddings</h3>
                    <span style={{ fontSize: '11px', color: '#ff6a13' }}>Saturday: Kandy</span>
                  </div>
                  <div className="admin-card" style={{ padding: '20px' }}>
                    <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', color: '#888899', fontWeight: 600 }}>Cloud Storage</p>
                    <h3 style={{ margin: '8px 0 4px 0', fontSize: '28px', color: '#fff' }}>1.42 TB / 2.0 TB</h3>
                    <span style={{ fontSize: '11px', color: '#aaa' }}>71% utilized</span>
                  </div>
                  <div className="admin-card" style={{ padding: '20px' }}>
                    <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', color: '#888899', fontWeight: 600 }}>Client Delight</p>
                    <h3 style={{ margin: '8px 0 4px 0', fontSize: '28px', color: '#fff' }}>4.98 / 5.0</h3>
                    <span style={{ fontSize: '11px', color: '#ff6a13' }}>★★★★★ 140+ couples</span>
                  </div>
                </div>
              </div>
            )}

            {/* BOOKINGS */}
            {activeSection === 'bookings' && (
              <div className="admin-card" style={{ padding: '24px' }}>
                <h2 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#fff' }}>Client Bookings & Scheduling</h2>
                <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#888899' }}>Manage verified contracts, wedding shoots, and crew assignments</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { id: 'CAP-2026-081', client: 'Kasun & Shenali', event: 'Kandyan Royal Wedding', venue: 'The Grand Kandyan', date: 'Nov 14, 2026', total: 'LKR 450,000', status: 'Confirmed' },
                    { id: 'CAP-2026-082', client: 'Dilan & Amanda', event: 'Sunset Coastal Ceremony', venue: 'Galle Fort Heritage', date: 'Nov 28, 2026', total: 'LKR 380,000', status: 'Pending Review' },
                    { id: 'CAP-2026-083', client: 'Ravindu & Nilusha', event: 'Grand Ballroom Reception', venue: 'Shangri-La Colombo', date: 'Dec 05, 2026', total: 'LKR 520,000', status: 'Confirmed' },
                    { id: 'CAP-2026-084', client: 'Minoli Perera', event: 'Fine Art Bridal Pre-Shoot', venue: 'Victoria Golf Resort', date: 'Dec 18, 2026', total: 'LKR 180,000', status: 'In Post-Production' }
                  ].map((item) => (
                    <div key={item.id} style={{ padding: '16px 20px', backgroundColor: '#12121b', border: '1px solid #1c1c28', borderRadius: '6px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{item.client}</span>
                          <span style={{ fontSize: '11px', color: '#ff6a13', fontFamily: 'monospace' }}>({item.id})</span>
                          <span className={item.status === 'Confirmed' ? 'admin-badge-confirmed' : item.status === 'Pending Review' ? 'admin-badge-pending' : 'admin-badge-post'}>
                            {item.status}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9999aa' }}>
                          {item.event} • {item.venue} • <span style={{ color: '#fff' }}>{item.date}</span>
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: 600, color: '#fff' }}>{item.total}</span>
                        <button style={{ padding: '6px 14px', backgroundColor: '#191926', border: '1px solid #2b2b3d', color: '#fff', fontSize: '12px', borderRadius: '4px', cursor: 'pointer' }}>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {activeSection === 'settings' && (
              <div className="admin-card" style={{ padding: '24px', maxWidth: '640px' }}>
                <h2 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#fff' }}>Studio Operational Preferences</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#888899', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>Notification Email</label>
                    <input type="email" defaultValue="bookings@capturalk.com" className="admin-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#888899', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>Master Studio Password</label>
                    <input type="password" defaultValue="admin123" className="admin-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'monospace' }} />
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Hero Image Framing & Live Preview Editor Modal */}
        <HeroImageEditorModal
          isOpen={heroEditorOpen}
          onClose={() => setHeroEditorOpen(false)}
          imageSrc={heroEditorImage}
          title={heroEditorTitle}
          onApply={(croppedUrl) => {
            if (heroEditorCallback) {
              heroEditorCallback(croppedUrl);
            }
          }}
          currentOpacity={homeCms.hero.bgOpacity !== undefined ? homeCms.hero.bgOpacity : 0.10}
          heroTitle={homeCms.hero.title}
          heroTagline={homeCms.hero.tagline}
        />

      </div>
    );
  }

  // =========================================================================
  // 2. LOGIN SCREEN (LUXURY ARCHITECTURAL EXECUTIVE PORTAL)
  // =========================================================================
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#07070a',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      fontFamily: 'sans-serif'
    }}>
      
      {/* Background Cinematic Photography Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at center, rgba(14,14,22,0.82) 0%, #07070a 90%), url("https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.65)',
        zIndex: 1
      }} />

      {/* Main Luxury Login Card */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '460px',
        backgroundColor: '#0e0e15',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
        overflow: 'hidden'
      }}>
        
        {/* Top Orange Brand Line */}
        <div style={{ height: '3px', backgroundColor: '#ff6a13', width: '100%' }} />

        <div style={{ padding: '36px 32px' }}>
          
          {/* Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-block', marginBottom: '16px' }}>
              <Logo />
            </div>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: 'rgba(255,106,19,0.1)', border: '1px solid rgba(255,106,19,0.25)', borderRadius: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ff6a13', fontWeight: 600, marginBottom: '10px' }}>
              <ShieldCheck style={{ width: '13px', height: '13px' }} />
              <span>Studio Administration</span>
            </div>

            <h2 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 400, color: '#fff', letterSpacing: '-0.01em' }}>
              Executive Sign In
            </h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#888899' }}>
              Authorized studio management access only
            </p>
          </div>

          {/* Quick Auto-Fill Credential Pill */}
          <div 
            onClick={fillQuickCredentials}
            style={{
              padding: '10px 14px',
              backgroundColor: '#13131c',
              border: '1px solid #222232',
              borderRadius: '6px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Click to automatically fill preset credentials"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ff6a13' }} />
              <span style={{ color: '#aaa' }}>Preset:</span>
              <span style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 600 }}>admin</span>
              <span style={{ color: '#555' }}>/</span>
              <span style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 600 }}>admin123</span>
            </div>
            <span style={{ fontSize: '11px', color: '#ff6a13', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
              Auto Fill ↗
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              color: '#fca5a5',
              fontSize: '12px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Username Input */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', fontWeight: 600, marginBottom: '6px', fontFamily: 'monospace' }}>
                Administrator Username
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{ width: '15px', height: '15px', color: '#666677', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', fontWeight: 600, marginBottom: '6px', fontFamily: 'monospace' }}>
                Access Key / Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ width: '15px', height: '15px', color: '#666677', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  autoComplete="current-password"
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '12px 38px 12px 38px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#666677',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: '15px', height: '15px' }} /> : <Eye style={{ width: '15px', height: '15px' }} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ paddingTop: '8px' }}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#ff6a13',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(255,106,19,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isLoading ? 0.6 : 1,
                  transition: 'background-color 0.2s'
                }}
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <Lock style={{ width: '14px', height: '14px' }} />
                    <span>AUTHENTICATE & ENTER PORTAL</span>
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Return to Public Website */}
          <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #1a1a26', paddingTop: '16px' }}>
            <Link
              to="/"
              style={{ fontSize: '12px', color: '#777788', textDecoration: 'none', transition: 'color 0.2s' }}
            >
              ← Return to Public Captura LK Website
            </Link>
          </div>

        </div>

        {/* Security Footer on Card */}
        <div style={{
          backgroundColor: '#09090f',
          borderTop: '1px solid #171722',
          padding: '10px',
          textAlign: 'center',
          fontSize: '10px',
          fontFamily: 'monospace',
          color: '#555566'
        }}>
          STUDIO ENCRYPTION V3 • AUTH PROTOCOL ACTIVATED
        </div>

      </div>

    </div>
  );
}
