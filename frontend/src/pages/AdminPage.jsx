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
  MapPin,
  Edit,
  X,
  FolderHeart,
  UploadCloud,
  CheckCircle2,
  Filter,
  Tag,
  Building2
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
  DEFAULT_CATEGORY_ITEMS,
  DEFAULT_PARTNERS
} from '../utils/homeContentService';
import { 
  getAboutContent, 
  getAboutContentAsync, 
  saveAboutContent, 
  DEFAULT_ABOUT_CONTENT 
} from '../utils/aboutContentService';
import {
  getAlbums,
  getAlbumsAsync,
  saveAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  moveAlbum,
  resetAlbums,
  processUniversalImageFile,
  reassignAlbumsCategory,
  DEFAULT_ALBUMS
} from '../utils/albumService';
import {
  getCategories,
  getCategoriesAsync,
  saveCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  resetCategories,
  DEFAULT_CATEGORIES
} from '../utils/categoryService';

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

  const saveAndPublishAlbumsUpdate = (albumsData) => {
    const updatedHome = {
      ...homeCms,
      albums: {
        ...homeCms.albums,
        ...albumsData
      }
    };
    setHomeCms(updatedHome);
    saveHomeContent(updatedHome);
    setSaveSuccessMsg('✓ Recent Albums section updated and published live!');
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  const saveAndPublishPartnersUpdate = (partnersData) => {
    const updatedHome = {
      ...homeCms,
      partners: {
        ...homeCms.partners,
        ...partnersData
      }
    };
    setHomeCms(updatedHome);
    saveHomeContent(updatedHome);
    setSaveSuccessMsg('✓ Trusted Partners section updated and published live!');
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  // Trusted Partners Form & Edit State
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerLogo, setNewPartnerLogo] = useState('');
  const [isProcessingPartnerLogo, setIsProcessingPartnerLogo] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [editingPartnerName, setEditingPartnerName] = useState('');
  const [editingPartnerLogo, setEditingPartnerLogo] = useState('');

  const handleAddNewPartner = () => {
    const trimmed = newPartnerName.trim();
    if (!trimmed) {
      alert('Please enter a partner / client name.');
      return;
    }
    const currentPartners = homeCms.partners?.items || DEFAULT_PARTNERS;
    const newPartner = {
      id: `partner-${Date.now()}`,
      name: trimmed,
      logo: newPartnerLogo.trim() || '',
      order: currentPartners.length + 1
    };
    const updatedList = [...currentPartners, newPartner];
    saveAndPublishPartnersUpdate({ items: updatedList });
    setNewPartnerName('');
    setNewPartnerLogo('');
  };

  const handleDeletePartner = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from Trusted Partners?`)) {
      const currentPartners = homeCms.partners?.items || DEFAULT_PARTNERS;
      const updatedList = currentPartners.filter(p => p.id !== id);
      saveAndPublishPartnersUpdate({ items: updatedList });
    }
  };

  const handleStartEditPartner = (partner) => {
    setEditingPartnerId(partner.id);
    setEditingPartnerName(partner.name || '');
    setEditingPartnerLogo(partner.logo || '');
  };

  const handleSaveEditPartner = (id) => {
    const trimmedName = editingPartnerName.trim();
    if (!trimmedName) {
      alert('Partner name cannot be empty.');
      return;
    }
    const currentPartners = homeCms.partners?.items || DEFAULT_PARTNERS;
    const updatedList = currentPartners.map(p => {
      if (p.id === id) {
        return {
          ...p,
          name: trimmedName,
          logo: editingPartnerLogo.trim()
        };
      }
      return p;
    });
    saveAndPublishPartnersUpdate({ items: updatedList });
    setEditingPartnerId(null);
    setEditingPartnerName('');
    setEditingPartnerLogo('');
  };

  const handleMovePartner = (index, direction) => {
    const currentPartners = [...(homeCms.partners?.items || DEFAULT_PARTNERS)];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentPartners.length) return;
    const temp = currentPartners[index];
    currentPartners[index] = currentPartners[targetIndex];
    currentPartners[targetIndex] = temp;
    saveAndPublishPartnersUpdate({ items: currentPartners });
  };

  const handlePartnerLogoUpload = async (e, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingPartnerLogo(true);
    try {
      const optimizedUrl = await compressImageFile(file, 400, 0.85);
      if (isEditing) {
        setEditingPartnerLogo(optimizedUrl);
      } else {
        setNewPartnerLogo(optimizedUrl);
      }
    } catch (err) {
      alert('Failed to process logo image: ' + err.message);
    } finally {
      setIsProcessingPartnerLogo(false);
      e.target.value = '';
    }
  };

  // Toggle Visibility for any Home Page Section (Hero, Categories, Albums, Partners, Story, Reviews, Callout)
  const toggleSectionVisibility = (sectionKey, sectionName) => {
    const isCurrentlyHidden = Boolean(homeCms[sectionKey]?.isHidden);
    const newHidden = !isCurrentlyHidden;
    const updatedHome = {
      ...homeCms,
      [sectionKey]: {
        ...homeCms[sectionKey],
        isHidden: newHidden
      }
    };
    setHomeCms(updatedHome);
    saveHomeContent(updatedHome);
    setSaveSuccessMsg(
      newHidden
        ? `👁️ "${sectionName}" is now HIDDEN from the live website.`
        : `✓ "${sectionName}" is now VISIBLE on the live website.`
    );
    setTimeout(() => setSaveSuccessMsg(''), 4500);
  };

  // Bulk set all sections visible or hidden
  const setAllSectionsVisibility = (hideAll) => {
    const updatedHome = {
      ...homeCms,
      hero: { ...homeCms.hero, isHidden: hideAll },
      categories: { ...homeCms.categories, isHidden: hideAll },
      albums: { ...homeCms.albums, isHidden: hideAll },
      partners: { ...homeCms.partners, isHidden: hideAll },
      story: { ...homeCms.story, isHidden: hideAll },
      reviews: { ...homeCms.reviews, isHidden: hideAll },
      callout: { ...homeCms.callout, isHidden: hideAll }
    };
    setHomeCms(updatedHome);
    saveHomeContent(updatedHome);
    setSaveSuccessMsg(
      hideAll
        ? '👁️ All Home Page sections are now HIDDEN from the live website.'
        : '✓ All Home Page sections are now VISIBLE on the live website.'
    );
    setTimeout(() => setSaveSuccessMsg(''), 4500);
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

  // Dynamic Categories State
  const [categoriesList, setCategoriesList] = useState(getCategories());
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // Albums CMS State (12 Albums 3x4 grid on Home Page, all albums in Masterpiece Gallery)
  const [albumsList, setAlbumsList] = useState(getAlbums());
  const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [albumSearchQuery, setAlbumSearchQuery] = useState('');
  const [albumCategoryFilter, setAlbumCategoryFilter] = useState('ALL');
  const [isProcessingAlbumImage, setIsProcessingAlbumImage] = useState(false);
  const [albumUploadStats, setAlbumUploadStats] = useState(null);
  const [isCoverDragOver, setIsCoverDragOver] = useState(false);
  const [isQuickDragOver, setIsQuickDragOver] = useState(false);

  const [albumForm, setAlbumForm] = useState({
    title: '',
    subtitle: '',
    category: getCategories()[0]?.name || 'General',
    location: '',
    date: '',
    photoCount: 40,
    coverImage: '',
    photos: [],
    description: ''
  });

  useEffect(() => {
    getAlbumsAsync().then(loaded => {
      if (loaded && loaded.length > 0) {
        setAlbumsList(loaded);
      }
    });

    getCategoriesAsync().then(loaded => {
      if (loaded && Array.isArray(loaded)) {
        setCategoriesList(loaded);
      }
    });

    const handleAlbumsUpdate = (e) => {
      if (e?.detail) {
        setAlbumsList(e.detail);
      } else {
        setAlbumsList(getAlbums());
      }
    };

    const handleCategoriesUpdate = (e) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setCategoriesList(e.detail);
      } else {
        setCategoriesList(getCategories());
      }
    };

    window.addEventListener('captura_albums_updated', handleAlbumsUpdate);
    window.addEventListener('captura_categories_updated', handleCategoriesUpdate);
    window.addEventListener('storage', handleAlbumsUpdate);
    window.addEventListener('storage', handleCategoriesUpdate);
    return () => {
      window.removeEventListener('captura_albums_updated', handleAlbumsUpdate);
      window.removeEventListener('captura_categories_updated', handleCategoriesUpdate);
      window.removeEventListener('storage', handleAlbumsUpdate);
      window.removeEventListener('storage', handleCategoriesUpdate);
    };
  }, []);

  const handleAddNewCategory = (nameToUse) => {
    const trimmed = (nameToUse || newCategoryInput).trim();
    if (!trimmed) {
      alert('Please enter a category name.');
      return null;
    }
    try {
      const created = addCategory(trimmed);
      const updatedList = getCategories();
      setCategoriesList(updatedList);
      setNewCategoryInput('');
      setSaveSuccessMsg(`✓ Category "${trimmed}" created & active across system!`);
      setTimeout(() => setSaveSuccessMsg(''), 4500);
      return created;
    } catch (err) {
      alert(err.message);
      return null;
    }
  };

  const handleUpdateCategoryName = (catId) => {
    const trimmed = editingCategoryName.trim();
    if (!trimmed) {
      alert('Category name cannot be empty.');
      return;
    }
    try {
      const oldCat = categoriesList.find(c => c.id === catId);
      updateCategory(catId, trimmed);
      if (oldCat && oldCat.name !== trimmed) {
        reassignAlbumsCategory(oldCat.name, trimmed);
        setAlbumsList(getAlbums());
      }
      setCategoriesList(getCategories());
      setEditingCategoryId(null);
      setEditingCategoryName('');
      setSaveSuccessMsg(`✓ Category renamed to "${trimmed}".`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCategoryPrompt = (catId, catName) => {
    if (categoriesList.length <= 1) {
      alert('You must have at least one category in the system.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete category "${catName}"?\n\nThis will remove it from all upload selectors, admin filters, and website pages.`)) {
      const remaining = categoriesList.filter(c => c.id !== catId);
      const fallbackCat = remaining[0]?.name || 'General';

      deleteCategory(catId);
      reassignAlbumsCategory(catName, fallbackCat);
      setAlbumsList(getAlbums());
      setCategoriesList(getCategories());

      // If home page categories exist, remove matching item
      if (homeCms.categories?.items) {
        const updatedHomeItems = homeCms.categories.items.filter(
          item => (item.title || '').toLowerCase() !== catName.toLowerCase() && (item.id || '').toLowerCase() !== catName.toLowerCase()
        );
        if (updatedHomeItems.length !== homeCms.categories.items.length) {
          saveAndPublishCategories(updatedHomeItems);
        }
      }

      setSaveSuccessMsg(`✓ Category "${catName}" removed. Any associated albums were moved to "${fallbackCat}".`);
      setTimeout(() => setSaveSuccessMsg(''), 4500);
    }
  };

  const handleResetCategoriesToDefault = () => {
    if (window.confirm('Reset categories back to initial defaults?')) {
      resetCategories();
      setCategoriesList(getCategories());
      setSaveSuccessMsg('✓ Categories reset to defaults.');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
  };

  const handleOpenAddAlbumModal = (initialCoverUrl = null) => {
    setEditingAlbum(null);
    setAlbumUploadStats(null);
    const defaultCat = categoriesList[0]?.name || 'General';
    setAlbumForm({
      title: '',
      subtitle: '',
      category: defaultCat,
      location: 'Colombo, Sri Lanka',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      photoCount: initialCoverUrl ? 1 : 40,
      coverImage: initialCoverUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      photos: initialCoverUrl ? [initialCoverUrl] : [],
      description: ''
    });
    setShowAddAlbumModal(true);
  };

  const handleOpenEditAlbumModal = (album) => {
    setEditingAlbum(album);
    setAlbumUploadStats(null);
    const defaultCat = categoriesList[0]?.name || 'General';
    setAlbumForm({
      title: album.title || '',
      subtitle: album.subtitle || '',
      category: album.category || defaultCat,
      location: album.location || '',
      date: album.date || '',
      photoCount: album.photoCount || (album.photos?.length || 40),
      coverImage: album.coverImage || '',
      photos: Array.isArray(album.photos) && album.photos.length > 0 ? album.photos : (album.coverImage ? [album.coverImage] : []),
      description: album.description || ''
    });
    setShowAddAlbumModal(true);
  };

  // Universal Media Processor: handles any format (JPG, PNG, WebP, AVIF, HEIC, TIFF, BMP, GIF, SVG)
  const handleUniversalCoverFileChange = async (file) => {
    if (!file) return;
    setIsProcessingAlbumImage(true);
    setAlbumUploadStats(null);

    try {
      const result = await processUniversalImageFile(file);
      setAlbumForm(prev => {
        const updatedPhotos = prev.photos && prev.photos.length > 0 ? prev.photos : [result.dataUrl];
        return {
          ...prev,
          coverImage: result.dataUrl,
          photos: updatedPhotos,
          photoCount: updatedPhotos.length
        };
      });
      setAlbumUploadStats({
        format: result.format,
        outputFormat: result.outputFormat,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        fileName: result.fileName
      });
      setSaveSuccessMsg(`✓ Processed ${result.format} (${result.originalSize} → ${result.compressedSize} ${result.outputFormat}). High-definition & web-optimized!`);
      setTimeout(() => setSaveSuccessMsg(''), 4500);
    } catch (err) {
      console.warn('Universal image processing fallback', err);
      const reader = new FileReader();
      reader.onload = () => {
        setAlbumForm(prev => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessingAlbumImage(false);
    }
  };

  // Multiple Photos Upload Handler: batch processes multiple files in any format
  const handleUniversalMultiplePhotosUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setIsProcessingAlbumImage(true);
    const files = Array.from(fileList);
    const newPhotos = [];

    for (const f of files) {
      try {
        const result = await processUniversalImageFile(f);
        newPhotos.push(result.dataUrl);
      } catch (err) {
        console.warn('Multiple upload item fallback', err);
      }
    }

    setAlbumForm(prev => {
      const merged = [...(prev.photos || []), ...newPhotos];
      return {
        ...prev,
        photos: merged,
        photoCount: merged.length,
        coverImage: prev.coverImage || merged[0] || ''
      };
    });

    setIsProcessingAlbumImage(false);
    setSaveSuccessMsg(`✓ Added ${newPhotos.length} photos to this album!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleRemovePhotoFromAlbum = (photoIndex) => {
    setAlbumForm(prev => {
      const updatedPhotos = prev.photos.filter((_, idx) => idx !== photoIndex);
      const newCover = (prev.coverImage === prev.photos[photoIndex]) 
        ? (updatedPhotos[0] || '') 
        : prev.coverImage;
      return {
        ...prev,
        photos: updatedPhotos,
        photoCount: updatedPhotos.length,
        coverImage: newCover
      };
    });
  };

  const handleSetPhotoAsCover = (photoUrl) => {
    setAlbumForm(prev => ({
      ...prev,
      coverImage: photoUrl
    }));
    setSaveSuccessMsg('✓ Selected photo set as album cover.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleMoveAlbum = (id, direction) => {
    moveAlbum(id, direction);
    setAlbumsList(getAlbums());
    setSaveSuccessMsg(`✓ Album order updated for live showcase.`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleSaveAlbum = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!albumForm.title.trim()) {
      alert('Please enter an album title.');
      return;
    }
    if (!albumForm.coverImage.trim()) {
      alert('Please provide or upload a cover image for this album.');
      return;
    }

    const photos = Array.isArray(albumForm.photos) && albumForm.photos.length > 0 
      ? albumForm.photos 
      : [albumForm.coverImage];

    const dataToSave = {
      ...albumForm,
      photos,
      photoCount: photos.length > 0 ? photos.length : (Number(albumForm.photoCount) || 30)
    };

    if (editingAlbum) {
      const updated = updateAlbum(editingAlbum.id, dataToSave);
      if (updated) {
        setAlbumsList(getAlbums());
        setSaveSuccessMsg(`✓ Album "${albumForm.title}" updated successfully!`);
      }
    } else {
      const created = createAlbum(dataToSave);
      if (created) {
        setAlbumsList(getAlbums());
        setSaveSuccessMsg(`✓ Album "${albumForm.title}" uploaded & added to live showcase!`);
      }
    }
    setShowAddAlbumModal(false);
    setEditingAlbum(null);
    setAlbumUploadStats(null);
    setTimeout(() => setSaveSuccessMsg(''), 4500);
  };

  const handleDeleteAlbum = (id, title) => {
    if (window.confirm(`Are you sure you want to delete the album "${title}"?`)) {
      deleteAlbum(id);
      setAlbumsList(getAlbums());
      setSaveSuccessMsg(`✓ Album "${title}" removed.`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
  };

  const handleResetAlbumsToDefault = () => {
    if (window.confirm('Reset albums back to original 12 default fine-art albums?')) {
      resetAlbums();
      setAlbumsList(getAlbums());
      setSaveSuccessMsg('✓ Albums reset to factory 12 fine-art collections.');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
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
    { id: 'customize-gallery', name: 'Gallery Page', path: '/gallery', icon: ImageIcon, badge: 'Archives' },
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
              {/* 2. DEDICATED ALBUMS & MASTERPIECES HUB (REQUESTED BY USER) */}
              {/* ------------------------------------------------------------- */}
              <div style={{ borderTop: '1px solid #181824', paddingTop: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px 6px 10px' }}>
                  <p style={{ margin: 0, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#ff6a13', fontWeight: 700 }}>
                    Albums & Masterpieces
                  </p>
                  <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'rgba(255,106,19,0.18)', color: '#ff6a13', fontWeight: 700 }}>
                    {albumsList.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <button
                    onClick={() => setActiveSection('manage-albums')}
                    className={`admin-nav-item ${activeSection === 'manage-albums' ? 'active' : ''}`}
                    style={{
                      borderLeft: activeSection === 'manage-albums' ? '3px solid #ff6a13' : '3px solid transparent',
                      backgroundColor: activeSection === 'manage-albums' ? 'rgba(255,106,19,0.12)' : undefined
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <Layers style={{ width: '15px', height: '15px', color: activeSection === 'manage-albums' ? '#ff6a13' : '#ffaa66' }} />
                      <span style={{ fontWeight: 600 }}>Albums & Gallery</span>
                    </div>
                    <span className="admin-nav-badge" style={{ backgroundColor: '#ff6a13', color: '#fff', fontWeight: 700 }}>
                      Hub
                    </span>
                  </button>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 3. STUDIO SUITE OPERATIONS */}
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
                {activeSection === 'manage-albums' ? 'Albums & Masterpieces Manager' : (pagesList.find(p => p.id === activeSection)?.name || 'Studio Overview')}
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

                {/* Home Page Sections Visibility Overview Manager */}
                <div style={{
                  padding: '20px 24px',
                  backgroundColor: '#0f0f17',
                  border: '1px solid #1f1f2e',
                  borderRadius: '8px',
                  marginBottom: '28px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '6px', backgroundColor: 'rgba(255,106,19,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,106,19,0.25)' }}>
                        <Eye style={{ width: '18px', height: '18px', color: '#ff6a13' }} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: 600 }}>
                          Home Page Sections Visibility (Hide / Show Controls)
                        </h3>
                        <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#888899' }}>
                          Control which sections appear on your live Home page. Any hidden section will instantly disappear from the public website.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setAllSectionsVisibility(false)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 12px',
                          backgroundColor: '#151520',
                          border: '1px solid #28283c',
                          color: '#22c55e',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        title="Make all 5 sections visible on the live site"
                      >
                        <Eye style={{ width: '13px', height: '13px' }} />
                        <span>Show All Sections</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAllSectionsVisibility(true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 12px',
                          backgroundColor: '#151520',
                          border: '1px solid #28283c',
                          color: '#ff6a13',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        title="Hide all sections from the live site"
                      >
                        <EyeOff style={{ width: '13px', height: '13px' }} />
                        <span>Hide All Sections</span>
                      </button>
                    </div>
                  </div>

                  {/* 6 Sections Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px'
                  }}>
                    {[
                      { key: 'hero', num: '1', title: 'Fullscreen Hero', sub: 'Top Landing Slideshow' },
                      { key: 'categories', num: '2', title: 'Category Showcase', sub: 'Expandable Panels & 360' },
                      { key: 'albums', num: '3', title: 'Recent Albums (12)', sub: '3×4 Grid Masterpieces' },
                      { key: 'partners', num: '3.5', title: 'Trusted Partners', sub: 'Single Row Client Slider' },
                      { key: 'story', num: '4', title: 'Philosophy & Story', sub: 'Brand Story Narrative' },
                      { key: 'reviews', num: '5', title: 'Client Reviews', sub: 'Testimonials Grid' },
                      { key: 'callout', num: '6', title: 'Callout Banner', sub: 'Bottom Contact CTA' }
                    ].map((sec) => {
                      const isHidden = Boolean(homeCms[sec.key]?.isHidden);
                      return (
                        <div
                          key={sec.key}
                          style={{
                            padding: '14px',
                            borderRadius: '6px',
                            backgroundColor: isHidden ? '#181216' : '#14141f',
                            border: isHidden ? '1px solid #ff6a13' : '1px solid #252538',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '12px',
                            transition: 'all 0.2s ease',
                            position: 'relative'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ff6a13', fontWeight: 700 }}>
                                SECTION {sec.num}
                              </span>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '10px',
                                fontWeight: 600,
                                color: isHidden ? '#ff8533' : '#22c55e'
                              }}>
                                <span style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: isHidden ? '#ff6a13' : '#22c55e',
                                  boxShadow: isHidden ? '0 0 6px rgba(255,106,19,0.8)' : '0 0 6px rgba(34,197,94,0.8)'
                                }} />
                                {isHidden ? 'Hidden' : 'Visible'}
                              </span>
                            </div>

                            <h4 style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: 600 }}>
                              {sec.title}
                            </h4>
                            <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#888899' }}>
                              {sec.sub}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleSectionVisibility(sec.key, sec.title)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              width: '100%',
                              padding: '7px 10px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              backgroundColor: isHidden ? '#ff6a13' : '#1c1c2b',
                              color: isHidden ? '#fff' : '#ccc',
                              border: isHidden ? '1px solid #ff6a13' : '1px solid #2e2e42',
                              boxShadow: isHidden ? '0 3px 12px rgba(255,106,19,0.35)' : 'none'
                            }}
                          >
                            {isHidden ? (
                              <>
                                <EyeOff style={{ width: '13px', height: '13px' }} />
                                <span>Unhide (Make Visible)</span>
                              </>
                            ) : (
                              <>
                                <Eye style={{ width: '13px', height: '13px', color: '#22c55e' }} />
                                <span>Hide Section</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Home Sections Customizer Stack */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                  {/* --------------------------------------------------------- */}
                  {/* SECTION 1: HERO SECTION */}
                  {/* --------------------------------------------------------- */}
                  <div className="admin-card" style={{
                    padding: '24px',
                    borderColor: homeCms.hero?.isHidden ? '#ff6a13' : undefined,
                    backgroundColor: homeCms.hero?.isHidden ? '#0e0b10' : undefined
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6a13', fontWeight: 700 }}>
                            SECTION 1
                          </span>
                          {homeCms.hero?.isHidden && (
                            <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#331500', color: '#ff944d', border: '1px solid #ff6a13', fontWeight: 700 }}>
                              HIDDEN ON LIVE SITE
                            </span>
                          )}
                        </div>
                        <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', color: '#fff' }}>
                          Fullscreen Hero Section
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility('hero', 'Fullscreen Hero Section')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 13px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            backgroundColor: homeCms.hero?.isHidden ? '#ff6a13' : '#14141f',
                            color: homeCms.hero?.isHidden ? '#fff' : '#ccc',
                            border: homeCms.hero?.isHidden ? '1px solid #ff6a13' : '1px solid #2e2e42',
                            boxShadow: homeCms.hero?.isHidden ? '0 2px 10px rgba(255,106,19,0.35)' : 'none'
                          }}
                          title={homeCms.hero?.isHidden ? "Click to make this section visible on the live site" : "Click to hide this section from the live site"}
                        >
                          {homeCms.hero?.isHidden ? (
                            <>
                              <EyeOff style={{ width: '14px', height: '14px' }} />
                              <span>Section Hidden (Click to Unhide)</span>
                            </>
                          ) : (
                            <>
                              <Eye style={{ width: '14px', height: '14px', color: '#22c55e' }} />
                              <span>Visible on Site (Click to Hide)</span>
                            </>
                          )}
                        </button>
                        <span style={{ fontSize: '11px', color: '#888899', fontFamily: 'monospace' }}>Top Landing View</span>
                      </div>
                    </div>

                    {homeCms.hero?.isHidden && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#261205', border: '1px solid #ff6a13', borderRadius: '6px', marginBottom: '18px', color: '#ffb380', fontSize: '12px' }}>
                        <EyeOff style={{ width: '16px', height: '16px', color: '#ff6a13', flexShrink: 0 }} />
                        <span><strong>This Hero Section is currently HIDDEN from visitors.</strong> It will not show up on the live Home page until you click Unhide.</span>
                      </div>
                    )}

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
                  <div className="admin-card" style={{
                    padding: '24px',
                    borderColor: homeCms.categories?.isHidden ? '#ff6a13' : undefined,
                    backgroundColor: homeCms.categories?.isHidden ? '#0e0b10' : undefined
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6a13', fontWeight: 700 }}>
                            SECTION 2
                          </span>
                          {homeCms.categories?.isHidden && (
                            <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#331500', color: '#ff944d', border: '1px solid #ff6a13', fontWeight: 700 }}>
                              HIDDEN ON LIVE SITE
                            </span>
                          )}
                        </div>
                        <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', color: '#fff' }}>
                          Dynamic Category Management & Showcase
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888899' }}>
                          Add, reorder, hide or delete categories. Choose media type (Images / Videos / Both) for each. Automatically updates Section 2 on the live website.
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility('categories', 'Dynamic Category Showcase')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            backgroundColor: homeCms.categories?.isHidden ? '#ff6a13' : '#14141f',
                            color: homeCms.categories?.isHidden ? '#fff' : '#ccc',
                            border: homeCms.categories?.isHidden ? '1px solid #ff6a13' : '1px solid #2e2e42',
                            boxShadow: homeCms.categories?.isHidden ? '0 2px 10px rgba(255,106,19,0.35)' : 'none'
                          }}
                          title={homeCms.categories?.isHidden ? "Click to make this section visible on the live site" : "Click to hide this section from the live site"}
                        >
                          {homeCms.categories?.isHidden ? (
                            <>
                              <EyeOff style={{ width: '14px', height: '14px' }} />
                              <span>Section Hidden (Click to Unhide)</span>
                            </>
                          ) : (
                            <>
                              <Eye style={{ width: '14px', height: '14px', color: '#22c55e' }} />
                              <span>Visible on Site (Click to Hide)</span>
                            </>
                          )}
                        </button>

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
                    </div>

                    {homeCms.categories?.isHidden && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#261205', border: '1px solid #ff6a13', borderRadius: '6px', marginBottom: '18px', color: '#ffb380', fontSize: '12px' }}>
                        <EyeOff style={{ width: '16px', height: '16px', color: '#ff6a13', flexShrink: 0 }} />
                        <span><strong>This Category Showcase Section is currently HIDDEN from visitors.</strong> It will not show up on the live Home page until you click Unhide.</span>
                      </div>
                    )}

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
                  {/* SECTION 3: RECENT MASTERPIECES & ALBUMS SHOWCASE (8 CARDS) */}
                  {/* --------------------------------------------------------- */}
                  <div className="admin-card" style={{
                    padding: '24px',
                    borderColor: homeCms.albums?.isHidden ? '#ff6a13' : undefined,
                    backgroundColor: homeCms.albums?.isHidden ? '#0e0b10' : undefined
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6a13', fontWeight: 700 }}>
                            SECTION 3
                          </span>
                          {homeCms.albums?.isHidden && (
                            <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#331500', color: '#ff944d', border: '1px solid #ff6a13', fontWeight: 700 }}>
                              HIDDEN ON LIVE SITE
                            </span>
                          )}
                          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#181824', color: '#ffaa66', border: '1px solid #332211', fontWeight: 600 }}>
                            3-Row × 4-Card Luxury Grid (Latest 12)
                          </span>
                        </div>
                        <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', color: '#fff', fontWeight: 700 }}>
                          Recent Masterpieces & Albums Showcase
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility('albums', 'Recent Albums Showcase')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 13px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            backgroundColor: homeCms.albums?.isHidden ? '#ff6a13' : '#14141f',
                            color: homeCms.albums?.isHidden ? '#fff' : '#ccc',
                            border: homeCms.albums?.isHidden ? '1px solid #ff6a13' : '1px solid #2e2e42',
                            boxShadow: homeCms.albums?.isHidden ? '0 2px 10px rgba(255,106,19,0.35)' : 'none'
                          }}
                          title={homeCms.albums?.isHidden ? "Click to make this section visible on the live site" : "Click to hide this section from the live site"}
                        >
                          {homeCms.albums?.isHidden ? (
                            <>
                              <EyeOff style={{ width: '14px', height: '14px' }} />
                              <span>Section Hidden (Click to Unhide)</span>
                            </>
                          ) : (
                            <>
                              <Eye style={{ width: '14px', height: '14px', color: '#22c55e' }} />
                              <span>Visible on Site (Click to Hide)</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveSection('manage-albums')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 14px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            backgroundColor: '#181826',
                            color: '#ffaa66',
                            border: '1px solid #3d2b1d'
                          }}
                        >
                          <Layers style={{ width: '14px', height: '14px', color: '#ff6a13' }} />
                          <span>Dedicated Album Hub →</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenAddAlbumModal()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 14px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            backgroundColor: '#ff6a13',
                            color: '#fff',
                            border: 'none',
                            boxShadow: '0 2px 10px rgba(255,106,19,0.35)'
                          }}
                        >
                          <Plus style={{ width: '14px', height: '14px' }} />
                          <span>Upload New Album</span>
                        </button>
                      </div>
                    </div>

                    {homeCms.albums?.isHidden && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#261205', border: '1px solid #ff6a13', borderRadius: '6px', marginBottom: '18px', color: '#ffb380', fontSize: '12px' }}>
                        <EyeOff style={{ width: '16px', height: '16px', color: '#ff6a13', flexShrink: 0 }} />
                        <span><strong>This Recent Albums Section is currently HIDDEN from visitors.</strong> It will not show up on the live Home page until you click Unhide.</span>
                      </div>
                    )}

                    {/* Section Texts & Customizer Settings */}
                    <div style={{ padding: '16px', backgroundColor: '#101018', border: '1px solid #1c1c28', borderRadius: '6px', marginBottom: '20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#aaa', marginBottom: '4px' }}>
                            Top Badge / Category Tagline
                          </label>
                          <input
                            type="text"
                            value={homeCms.albums?.badge || ''}
                            placeholder="e.g. CURATED CLIENT ARCHIVES"
                            onChange={(e) => saveAndPublishAlbumsUpdate({ badge: e.target.value })}
                            className="admin-input"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', fontSize: '12px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#aaa', marginBottom: '4px' }}>
                            Section Title
                          </label>
                          <input
                            type="text"
                            value={homeCms.albums?.title || ''}
                            placeholder="e.g. Recent Masterpieces & Albums"
                            onChange={(e) => saveAndPublishAlbumsUpdate({ title: e.target.value })}
                            className="admin-input"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', fontSize: '12px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#aaa', marginBottom: '4px' }}>
                            "View All" Button Text
                          </label>
                          <input
                            type="text"
                            value={homeCms.albums?.viewAllButtonText || ''}
                            placeholder="e.g. EXPLORE FULL GALLERY VAULT"
                            onChange={(e) => saveAndPublishAlbumsUpdate({ viewAllButtonText: e.target.value })}
                            className="admin-input"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', fontSize: '12px' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#aaa', marginBottom: '4px' }}>
                          Section Subtitle / Description
                        </label>
                        <textarea
                          rows={2}
                          value={homeCms.albums?.subtitle || ''}
                          placeholder="Brief description about these recent albums..."
                          onChange={(e) => saveAndPublishAlbumsUpdate({ subtitle: e.target.value })}
                          className="admin-input"
                          style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', fontSize: '12px', resize: 'vertical' }}
                        />
                      </div>

                      {/* Background Customizer */}
                      <div style={{ paddingTop: '12px', borderTop: '1px solid #1a1a26' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#ff6a13', textTransform: 'uppercase' }}>Section Background:</span>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ddd', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="albumsBgType"
                              checked={homeCms.albums?.bgType !== 'custom'}
                              onChange={() => saveAndPublishAlbumsUpdate({ bgType: 'default' })}
                              style={{ accentColor: '#ff6a13' }}
                            />
                            <span>Default Dark Tone (#07070a)</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ddd', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="albumsBgType"
                              checked={homeCms.albums?.bgType === 'custom'}
                              onChange={() => saveAndPublishAlbumsUpdate({ bgType: 'custom' })}
                              style={{ accentColor: '#ff6a13' }}
                            />
                            <span style={{ color: '#ff6a13', fontWeight: 600 }}>Custom Background Image</span>
                          </label>
                        </div>

                        {homeCms.albums?.bgType === 'custom' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
                            {homeCms.albums?.customBgImage && (
                              <img
                                src={homeCms.albums.customBgImage}
                                alt="Albums Bg Preview"
                                style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ff6a13', cursor: 'pointer' }}
                                onClick={() => openHeroEditor(homeCms.albums.customBgImage, 'Adjust Recent Albums Background', (croppedUrl) => {
                                  saveAndPublishAlbumsUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                })}
                                title="Click to adjust position in Preview Editor"
                              />
                            )}
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', backgroundColor: '#ff6a13', color: '#fff', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                              <Upload style={{ width: '12px', height: '12px' }} />
                              <span>Upload Background</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageFileChange(e, (dataUrl) => {
                                  openHeroEditor(dataUrl, 'Adjust Recent Albums Background', (croppedUrl) => {
                                    saveAndPublishAlbumsUpdate({ bgType: 'custom', customBgImage: croppedUrl });
                                  });
                                })}
                              />
                            </label>
                            <input
                              type="text"
                              placeholder="Or paste background image URL..."
                              value={homeCms.albums?.customBgImage || ''}
                              onChange={(e) => saveAndPublishAlbumsUpdate({ bgType: 'custom', customBgImage: e.target.value })}
                              className="admin-input"
                              style={{ flex: 1, minWidth: '200px', padding: '7px 10px', borderRadius: '4px', fontSize: '11px' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Albums Library Management */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '14px', color: '#fff', fontWeight: 600 }}>
                            Uploaded Albums Library ({albumsList.length} Total)
                          </h4>
                          <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#888899' }}>
                            The first 12 albums shown below appear on the Home page (3 rows of 4 cards). All albums will be displayed in the upcoming Gallery page.
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={handleResetAlbumsToDefault}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '6px 10px',
                              backgroundColor: '#161622',
                              border: '1px solid #2a2a3c',
                              color: '#999',
                              borderRadius: '4px',
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                            title="Reset to 8 default sample fine-art albums"
                          >
                            <RotateCcw style={{ width: '11px', height: '11px' }} />
                            <span>Reset Defaults</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleOpenAddAlbumModal}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              backgroundColor: '#ff6a13',
                              border: 'none',
                              color: '#fff',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <Plus style={{ width: '12px', height: '12px' }} />
                            <span>Add Album</span>
                          </button>
                        </div>
                      </div>

                      {/* Albums Grid in Admin */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '14px'
                      }}>
                        {albumsList.map((album, idx) => {
                          const isHomeLive = idx < 12;
                          return (
                            <div
                              key={album.id || idx}
                              style={{
                                backgroundColor: isHomeLive ? '#12121b' : '#0c0c12',
                                border: isHomeLive ? '1px solid #ff6a13' : '1px solid #1f1f2e',
                                borderRadius: '6px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.2s ease',
                                position: 'relative'
                              }}
                            >
                              {/* Image Thumbnail & Badge */}
                              <div style={{ position: 'relative', height: '140px', overflow: 'hidden', backgroundColor: '#07070a' }}>
                                <img
                                  src={album.coverImage}
                                  alt={album.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                  position: 'absolute',
                                  top: '8px',
                                  left: '8px',
                                  display: 'flex',
                                  gap: '6px',
                                  flexWrap: 'wrap'
                                }}>
                                  <span style={{
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    padding: '2px 7px',
                                    borderRadius: '3px',
                                    backgroundColor: isHomeLive ? '#ff6a13' : 'rgba(0,0,0,0.7)',
                                    color: '#fff',
                                    letterSpacing: '0.05em'
                                  }}>
                                    {isHomeLive ? `★ HOME CARD #${idx + 1}` : `GALLERY VAULT #${idx + 1}`}
                                  </span>

                                  <span style={{
                                    fontSize: '9px',
                                    fontWeight: 600,
                                    padding: '2px 6px',
                                    borderRadius: '3px',
                                    backgroundColor: 'rgba(0,0,0,0.75)',
                                    color: '#ffd7b3'
                                  }}>
                                    {album.category || 'Weddings'}
                                  </span>
                                </div>

                                <div style={{
                                  position: 'absolute',
                                  bottom: '8px',
                                  right: '8px',
                                  fontSize: '9px',
                                  fontWeight: 600,
                                  padding: '2px 6px',
                                  borderRadius: '3px',
                                  backgroundColor: 'rgba(0,0,0,0.8)',
                                  color: '#fff'
                                }}>
                                  {album.photoCount || 40} Photos
                                </div>
                              </div>

                              {/* Card Body */}
                              <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                  <h5 style={{ margin: '0 0 2px 0', fontSize: '13px', color: '#fff', fontWeight: 700 }}>
                                    {album.title}
                                  </h5>
                                  <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#ffaa66', fontStyle: 'italic' }}>
                                    {album.subtitle || 'Fine Art Celebration'}
                                  </p>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#888899' }}>
                                    {album.location && (
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                        <MapPin style={{ width: '10px', height: '10px', color: '#ff6a13' }} />
                                        <span>{album.location}</span>
                                      </span>
                                    )}
                                    {album.date && <span>• {album.date}</span>}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #1a1a26' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditAlbumModal(album)}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '4px 8px',
                                      backgroundColor: '#1b1b28',
                                      border: '1px solid #333348',
                                      color: '#eee',
                                      borderRadius: '3px',
                                      fontSize: '11px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <Edit style={{ width: '11px', height: '11px', color: '#ff6a13' }} />
                                    <span>Edit</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAlbum(album.id, album.title)}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '4px 8px',
                                      backgroundColor: '#201015',
                                      border: '1px solid #4a1520',
                                      color: '#ff6677',
                                      borderRadius: '3px',
                                      fontSize: '11px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <Trash2 style={{ width: '11px', height: '11px' }} />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>



                  {/* --------------------------------------------------------- */}
                  {/* SECTION 3.5: TRUSTED PARTNERS (SINGLE ROW SLIDER) */}
                  {/* --------------------------------------------------------- */}
                  <div className="admin-card" style={{
                    padding: '24px',
                    borderColor: homeCms.partners?.isHidden ? '#ff6a13' : undefined,
                    backgroundColor: homeCms.partners?.isHidden ? '#0e0b10' : undefined
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6a13', fontWeight: 700 }}>
                            SECTION 3.5
                          </span>
                          {homeCms.partners?.isHidden && (
                            <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#331500', color: '#ff944d', border: '1px solid #ff6a13', fontWeight: 700 }}>
                              HIDDEN ON LIVE SITE
                            </span>
                          )}
                        </div>
                        <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', color: '#fff' }}>
                          Trusted Partners & Clients (Single Row 4-Card Slider)
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888899' }}>
                          Displays prestigious client and partner logos with names in a single horizontal sliding row (4 at a time).
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility('partners', 'Trusted Partners Section')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 13px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            backgroundColor: homeCms.partners?.isHidden ? '#ff6a13' : '#14141f',
                            color: homeCms.partners?.isHidden ? '#fff' : '#ccc',
                            border: homeCms.partners?.isHidden ? '1px solid #ff6a13' : '1px solid #2e2e42',
                            boxShadow: homeCms.partners?.isHidden ? '0 2px 10px rgba(255,106,19,0.35)' : 'none'
                          }}
                          title={homeCms.partners?.isHidden ? "Click to make this section visible on the live site" : "Click to hide this section from the live site"}
                        >
                          {homeCms.partners?.isHidden ? (
                            <>
                              <EyeOff style={{ width: '14px', height: '14px' }} />
                              <span>Section Hidden (Click to Unhide)</span>
                            </>
                          ) : (
                            <>
                              <Eye style={{ width: '14px', height: '14px', color: '#22c55e' }} />
                              <span>Visible on Site (Click to Hide)</span>
                            </>
                          )}
                        </button>
                        <span style={{ fontSize: '11px', color: '#888899', fontFamily: 'monospace' }}>Clients / Partners</span>
                      </div>
                    </div>

                    {homeCms.partners?.isHidden && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#261205', border: '1px solid #ff6a13', borderRadius: '6px', marginBottom: '18px', color: '#ffb380', fontSize: '12px' }}>
                        <EyeOff style={{ width: '16px', height: '16px', color: '#ff6a13', flexShrink: 0 }} />
                        <span><strong>This Trusted Partners Section is currently HIDDEN from visitors.</strong> Click Unhide above to display it on the live homepage.</span>
                      </div>
                    )}

                    {/* Section Titles Settings */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '22px', padding: '16px', backgroundColor: '#101018', border: '1px solid #1c1c28', borderRadius: '6px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#ffaa66', marginBottom: '4px' }}>
                          Section Badge
                        </label>
                        <input
                          type="text"
                          value={homeCms.partners?.badge || ''}
                          placeholder="e.g. OUR PRESTIGIOUS NETWORK"
                          onChange={(e) => saveAndPublishPartnersUpdate({ badge: e.target.value })}
                          className="admin-input"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#ccc', marginBottom: '4px' }}>
                          Section Title *
                        </label>
                        <input
                          type="text"
                          value={homeCms.partners?.title || ''}
                          placeholder="e.g. Trusted Partners"
                          onChange={(e) => saveAndPublishPartnersUpdate({ title: e.target.value })}
                          className="admin-input"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#aaa', marginBottom: '4px' }}>
                          Section Subtitle Description
                        </label>
                        <input
                          type="text"
                          value={homeCms.partners?.subtitle || ''}
                          placeholder="e.g. Honored to collaborate with premier luxury brands, celebrated hospitality icons, and distinguished patrons across Sri Lanka."
                          onChange={(e) => saveAndPublishPartnersUpdate({ subtitle: e.target.value })}
                          className="admin-input"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    {/* Add New Partner Card */}
                    <div style={{ padding: '18px', backgroundColor: '#13131e', border: '1px solid #28283c', borderRadius: '8px', marginBottom: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                        <Plus style={{ width: '16px', height: '16px', color: '#ff6a13' }} />
                        <h4 style={{ margin: 0, fontSize: '14px', color: '#fff', fontWeight: 700 }}>
                          Add New Client / Partner Logo
                        </h4>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#ffaa66', marginBottom: '4px' }}>
                            Client / Partner Name *
                          </label>
                          <input
                            type="text"
                            value={newPartnerName}
                            placeholder="e.g. Cinnamon Grand Colombo"
                            onChange={(e) => setNewPartnerName(e.target.value)}
                            className="admin-input"
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 600, color: '#ccc' }}>
                              Partner Logo Image
                            </label>
                            <label style={{ fontSize: '10px', color: '#ff6a13', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Upload style={{ width: '10px', height: '10px' }} />
                              <span>{isProcessingPartnerLogo ? 'Processing...' : 'Upload File'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                disabled={isProcessingPartnerLogo}
                                onChange={(e) => handlePartnerLogoUpload(e, false)}
                              />
                            </label>
                          </div>
                          <input
                            type="text"
                            value={newPartnerLogo}
                            placeholder="Paste image/logo URL or upload file..."
                            onChange={(e) => setNewPartnerLogo(e.target.value)}
                            className="admin-input"
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={handleAddNewPartner}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              width: '100%',
                              padding: '9px 16px',
                              backgroundColor: '#ff6a13',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 4px 14px rgba(255,106,19,0.35)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Plus style={{ width: '14px', height: '14px' }} />
                            <span>Add Partner to Slider</span>
                          </button>
                        </div>
                      </div>

                      {newPartnerLogo && (
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#888' }}>Logo Preview:</span>
                          <div style={{ height: '42px', padding: '4px 12px', backgroundColor: '#0b0b12', border: '1px solid #333348', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                            <img src={newPartnerLogo} alt="Preview" style={{ maxHeight: '34px', maxWidth: '120px', objectFit: 'contain' }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Existing Partners List / Reorder Grid */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Building2 style={{ width: '15px', height: '15px', color: '#ff6a13' }} />
                          <h4 style={{ margin: 0, fontSize: '14px', color: '#fff', fontWeight: 600 }}>
                            Active Partners & Clients ({(homeCms.partners?.items || DEFAULT_PARTNERS).length})
                          </h4>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Reset partner logos back to luxury fine-art defaults?')) {
                                saveAndPublishPartnersUpdate({ items: DEFAULT_PARTNERS });
                              }
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 9px',
                              backgroundColor: '#1b1b28',
                              border: '1px solid #333348',
                              color: '#bbb',
                              borderRadius: '4px',
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                            title="Reset to default luxury brand logos"
                          >
                            <RotateCcw style={{ width: '11px', height: '11px' }} />
                            <span>Reset Default Logos</span>
                          </button>
                          <span style={{ fontSize: '11px', color: '#888' }}>
                            (4 shown at a time)
                          </span>
                        </div>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '12px'
                      }}>
                        {(homeCms.partners?.items || DEFAULT_PARTNERS).map((partner, pIdx, allPartners) => {
                          const isEditing = editingPartnerId === partner.id;
                          return (
                            <div
                              key={partner.id || pIdx}
                              style={{
                                padding: '14px',
                                backgroundColor: isEditing ? '#181828' : '#111119',
                                border: isEditing ? '1px solid #ff6a13' : '1px solid #222232',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <div>
                                    <label style={{ fontSize: '10px', color: '#ffaa66', fontWeight: 600 }}>Partner Name</label>
                                    <input
                                      type="text"
                                      value={editingPartnerName}
                                      onChange={(e) => setEditingPartnerName(e.target.value)}
                                      className="admin-input"
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }}
                                    />
                                  </div>
                                  <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                      <label style={{ fontSize: '10px', color: '#ccc', fontWeight: 600 }}>Logo URL / Upload</label>
                                      <label style={{ fontSize: '9px', color: '#ff6a13', cursor: 'pointer' }}>
                                        Upload File
                                        <input
                                          type="file"
                                          accept="image/*"
                                          style={{ display: 'none' }}
                                          onChange={(e) => handlePartnerLogoUpload(e, true)}
                                        />
                                      </label>
                                    </div>
                                    <input
                                      type="text"
                                      value={editingPartnerLogo}
                                      onChange={(e) => setEditingPartnerLogo(e.target.value)}
                                      className="admin-input"
                                      style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }}
                                    />
                                  </div>
                                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveEditPartner(partner.id)}
                                      style={{ flex: 1, padding: '5px', backgroundColor: '#ff6a13', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingPartnerId(null)}
                                      style={{ padding: '5px 10px', backgroundColor: '#20202e', color: '#bbb', border: '1px solid #333348', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {/* Logo Container */}
                                    <div style={{
                                      width: '64px',
                                      height: '46px',
                                      backgroundColor: '#0a0a10',
                                      border: '1px solid #28283c',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      padding: '4px',
                                      flexShrink: 0
                                    }}>
                                      {partner.logo ? (
                                        <img src={partner.logo} alt={partner.name} style={{ maxHeight: '38px', maxWidth: '56px', objectFit: 'contain' }} />
                                      ) : (
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#181826', color: '#ffaa66', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                                          {(partner.name || 'P').charAt(0)}
                                        </div>
                                      )}
                                    </div>

                                    {/* Name & Position */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <h5 style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {partner.name}
                                      </h5>
                                      <span style={{ fontSize: '10px', color: '#888899', fontFamily: 'monospace' }}>
                                        Position #{pIdx + 1}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Actions Bar */}
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #1c1c28' }}>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <button
                                        type="button"
                                        disabled={pIdx === 0}
                                        onClick={() => handleMovePartner(pIdx, 'up')}
                                        style={{
                                          padding: '4px 6px',
                                          backgroundColor: '#161622',
                                          border: '1px solid #2e2e42',
                                          color: pIdx === 0 ? '#444' : '#ccc',
                                          borderRadius: '3px',
                                          cursor: pIdx === 0 ? 'not-allowed' : 'pointer'
                                        }}
                                        title="Move earlier in slider"
                                      >
                                        <ArrowUp style={{ width: '11px', height: '11px' }} />
                                      </button>
                                      <button
                                        type="button"
                                        disabled={pIdx === allPartners.length - 1}
                                        onClick={() => handleMovePartner(pIdx, 'down')}
                                        style={{
                                          padding: '4px 6px',
                                          backgroundColor: '#161622',
                                          border: '1px solid #2e2e42',
                                          color: pIdx === allPartners.length - 1 ? '#444' : '#ccc',
                                          borderRadius: '3px',
                                          cursor: pIdx === allPartners.length - 1 ? 'not-allowed' : 'pointer'
                                        }}
                                        title="Move later in slider"
                                      >
                                        <ArrowDown style={{ width: '11px', height: '11px' }} />
                                      </button>
                                    </div>

                                    <div style={{ display: 'flex', gap: '6px' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleStartEditPartner(partner)}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '3px',
                                          padding: '4px 8px',
                                          backgroundColor: '#1a1a28',
                                          border: '1px solid #333348',
                                          color: '#eee',
                                          borderRadius: '3px',
                                          fontSize: '11px',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <Edit style={{ width: '10px', height: '10px', color: '#ff6a13' }} />
                                        <span>Edit</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleDeletePartner(partner.id, partner.name)}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '3px',
                                          padding: '4px 8px',
                                          backgroundColor: '#201015',
                                          border: '1px solid #4a1520',
                                          color: '#ff6677',
                                          borderRadius: '3px',
                                          fontSize: '11px',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <Trash2 style={{ width: '10px', height: '10px' }} />
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>



                  {/* --------------------------------------------------------- */}
                  {/* SECTION 4: STORY & PHILOSOPHY */}
                  {/* --------------------------------------------------------- */}
                  <div className="admin-card" style={{
                    padding: '24px',
                    borderColor: homeCms.story?.isHidden ? '#ff6a13' : undefined,
                    backgroundColor: homeCms.story?.isHidden ? '#0e0b10' : undefined
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6a13', fontWeight: 700 }}>
                            SECTION 4
                          </span>
                          {homeCms.story?.isHidden && (
                            <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#331500', color: '#ff944d', border: '1px solid #ff6a13', fontWeight: 700 }}>
                              HIDDEN ON LIVE SITE
                            </span>
                          )}
                        </div>
                        <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', color: '#fff' }}>
                          Philosophy & Story Section
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility('story', 'Philosophy & Story Section')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 13px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            backgroundColor: homeCms.story?.isHidden ? '#ff6a13' : '#14141f',
                            color: homeCms.story?.isHidden ? '#fff' : '#ccc',
                            border: homeCms.story?.isHidden ? '1px solid #ff6a13' : '1px solid #2e2e42',
                            boxShadow: homeCms.story?.isHidden ? '0 2px 10px rgba(255,106,19,0.35)' : 'none'
                          }}
                          title={homeCms.story?.isHidden ? "Click to make this section visible on the live site" : "Click to hide this section from the live site"}
                        >
                          {homeCms.story?.isHidden ? (
                            <>
                              <EyeOff style={{ width: '14px', height: '14px' }} />
                              <span>Section Hidden (Click to Unhide)</span>
                            </>
                          ) : (
                            <>
                              <Eye style={{ width: '14px', height: '14px', color: '#22c55e' }} />
                              <span>Visible on Site (Click to Hide)</span>
                            </>
                          )}
                        </button>
                        <span style={{ fontSize: '11px', color: '#888899', fontFamily: 'monospace' }}>Editorial Narrative</span>
                      </div>
                    </div>

                    {homeCms.story?.isHidden && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#261205', border: '1px solid #ff6a13', borderRadius: '6px', marginBottom: '18px', color: '#ffb380', fontSize: '12px' }}>
                        <EyeOff style={{ width: '16px', height: '16px', color: '#ff6a13', flexShrink: 0 }} />
                        <span><strong>This Story Section is currently HIDDEN from visitors.</strong> It will not show up on the live Home page until you click Unhide.</span>
                      </div>
                    )}

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
                  {/* SECTION 5: REVIEWS SECTION BACKGROUND */}
                  {/* --------------------------------------------------------- */}
                  <div className="admin-card" style={{
                    padding: '24px',
                    borderColor: homeCms.reviews?.isHidden ? '#ff6a13' : undefined,
                    backgroundColor: homeCms.reviews?.isHidden ? '#0e0b10' : undefined
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6a13', fontWeight: 700 }}>
                            SECTION 5
                          </span>
                          {homeCms.reviews?.isHidden && (
                            <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#331500', color: '#ff944d', border: '1px solid #ff6a13', fontWeight: 700 }}>
                              HIDDEN ON LIVE SITE
                            </span>
                          )}
                        </div>
                        <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', color: '#fff' }}>
                          Reviews Section Background
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility('reviews', 'Client Reviews Section')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 13px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            backgroundColor: homeCms.reviews?.isHidden ? '#ff6a13' : '#14141f',
                            color: homeCms.reviews?.isHidden ? '#fff' : '#ccc',
                            border: homeCms.reviews?.isHidden ? '1px solid #ff6a13' : '1px solid #2e2e42',
                            boxShadow: homeCms.reviews?.isHidden ? '0 2px 10px rgba(255,106,19,0.35)' : 'none'
                          }}
                          title={homeCms.reviews?.isHidden ? "Click to make this section visible on the live site" : "Click to hide this section from the live site"}
                        >
                          {homeCms.reviews?.isHidden ? (
                            <>
                              <EyeOff style={{ width: '14px', height: '14px' }} />
                              <span>Section Hidden (Click to Unhide)</span>
                            </>
                          ) : (
                            <>
                              <Eye style={{ width: '14px', height: '14px', color: '#22c55e' }} />
                              <span>Visible on Site (Click to Hide)</span>
                            </>
                          )}
                        </button>
                        <span style={{ fontSize: '11px', color: '#888899', fontFamily: 'monospace' }}>Testimonials Grid</span>
                      </div>
                    </div>

                    {homeCms.reviews?.isHidden && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#261205', border: '1px solid #ff6a13', borderRadius: '6px', marginBottom: '18px', color: '#ffb380', fontSize: '12px' }}>
                        <EyeOff style={{ width: '16px', height: '16px', color: '#ff6a13', flexShrink: 0 }} />
                        <span><strong>This Reviews Section is currently HIDDEN from visitors.</strong> It will not show up on the live Home page until you click Unhide.</span>
                      </div>
                    )}

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
                  {/* SECTION 6: CONTACT CALLOUT BANNER BACKGROUND */}
                  {/* --------------------------------------------------------- */}
                  <div className="admin-card" style={{
                    padding: '24px',
                    borderColor: homeCms.callout?.isHidden ? '#ff6a13' : undefined,
                    backgroundColor: homeCms.callout?.isHidden ? '#0e0b10' : undefined
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6a13', fontWeight: 700 }}>
                            SECTION 6
                          </span>
                          {homeCms.callout?.isHidden && (
                            <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#331500', color: '#ff944d', border: '1px solid #ff6a13', fontWeight: 700 }}>
                              HIDDEN ON LIVE SITE
                            </span>
                          )}
                        </div>
                        <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', color: '#fff' }}>
                          Studio Callout Banner Background
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility('callout', 'Contact Callout Banner')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 13px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            backgroundColor: homeCms.callout?.isHidden ? '#ff6a13' : '#14141f',
                            color: homeCms.callout?.isHidden ? '#fff' : '#ccc',
                            border: homeCms.callout?.isHidden ? '1px solid #ff6a13' : '1px solid #2e2e42',
                            boxShadow: homeCms.callout?.isHidden ? '0 2px 10px rgba(255,106,19,0.35)' : 'none'
                          }}
                          title={homeCms.callout?.isHidden ? "Click to make this section visible on the live site" : "Click to hide this section from the live site"}
                        >
                          {homeCms.callout?.isHidden ? (
                            <>
                              <EyeOff style={{ width: '14px', height: '14px' }} />
                              <span>Section Hidden (Click to Unhide)</span>
                            </>
                          ) : (
                            <>
                              <Eye style={{ width: '14px', height: '14px', color: '#22c55e' }} />
                              <span>Visible on Site (Click to Hide)</span>
                            </>
                          )}
                        </button>
                        <span style={{ fontSize: '11px', color: '#888899', fontFamily: 'monospace' }}>Bottom CTA Banner</span>
                      </div>
                    </div>

                    {homeCms.callout?.isHidden && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#261205', border: '1px solid #ff6a13', borderRadius: '6px', marginBottom: '18px', color: '#ffb380', fontSize: '12px' }}>
                        <EyeOff style={{ width: '16px', height: '16px', color: '#ff6a13', flexShrink: 0 }} />
                        <span><strong>This Callout Banner Section is currently HIDDEN from visitors.</strong> It will not show up on the live Home page until you click Unhide.</span>
                      </div>
                    )}

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

            {/* ============================================================= */}
            {/* DEDICATED SECTION: ALBUMS & GALLERY HUB (REQUESTED BY USER) */}
            {/* ============================================================= */}
            {activeSection === 'manage-albums' && (
              <div>
                {/* Header Bar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#ff6a13', fontWeight: 700 }}>
                        Fine-Art Collections
                      </span>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#181824', color: '#ffaa66', border: '1px solid #332211', fontWeight: 600 }}>
                        Top 12 Live on Home Showcase
                      </span>
                    </div>
                    <h1 style={{ margin: 0, fontSize: '26px', color: '#fff', fontWeight: 400 }}>
                      Masterpiece Albums & Showcase Manager
                    </h1>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888899' }}>
                      Upload, organize, and curate albums for the Home Page 12-Card Grid & Masterpiece Gallery. Compatible with ANY image format.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleResetAlbumsToDefault}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 15px',
                        backgroundColor: '#13131c',
                        border: '1px solid #28283c',
                        color: '#aaa',
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      title="Reset albums back to 12 fine-art collections"
                    >
                      <RotateCcw style={{ width: '13px', height: '13px' }} />
                      <span>Reset to Defaults</span>
                    </button>

                    <Link
                      to="/gallery"
                      target="_blank"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 15px',
                        backgroundColor: '#161622',
                        border: '1px solid #3d2b1d',
                        color: '#ffaa66',
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      <ExternalLink style={{ width: '13px', height: '13px' }} />
                      <span>View Live Gallery</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleOpenAddAlbumModal()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        padding: '9px 18px',
                        backgroundColor: '#ff6a13',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(255, 106, 19, 0.4)'
                      }}
                    >
                      <Plus style={{ width: '15px', height: '15px' }} />
                      <span>+ Upload New Album</span>
                    </button>
                  </div>
                </div>

                {/* KPI & Compatibility Info Ribbon */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '22px' }}>
                  <div style={{ padding: '16px', backgroundColor: '#0e0e16', border: '1px solid #1c1c28', borderRadius: '6px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#ff6a13', fontWeight: 700, letterSpacing: '0.1em' }}>TOTAL ALBUMS</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                      <span style={{ fontSize: '26px', color: '#fff', fontWeight: 700 }}>{albumsList.length}</span>
                      <span style={{ fontSize: '11px', color: '#888' }}>Collections</span>
                    </div>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: '#0e0e16', border: '1px solid #1c1c28', borderRadius: '6px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#22c55e', fontWeight: 700, letterSpacing: '0.1em' }}>HOME SHOWCASE</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                      <span style={{ fontSize: '26px', color: '#22c55e', fontWeight: 700 }}>12</span>
                      <span style={{ fontSize: '11px', color: '#888' }}>Cards (3 Rows × 4)</span>
                    </div>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: '#0e0e16', border: '1px solid #1c1c28', borderRadius: '6px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.1em' }}>ANY FORMAT COMPATIBLE</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                      {['JPG', 'PNG', 'WEBP', 'AVIF', 'HEIC', 'TIFF', 'BMP', 'URL'].map(fmt => (
                        <span key={fmt} style={{ fontSize: '9px', padding: '2px 5px', borderRadius: '3px', backgroundColor: '#181826', color: '#cbd5e1', border: '1px solid #28283c', fontWeight: 600 }}>
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: '#0e0e16', border: '1px solid #1c1c28', borderRadius: '6px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 700, letterSpacing: '0.1em' }}>SMART COMPRESSION</span>
                    <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#aaa', lineHeight: 1.4 }}>
                      Large camera exports auto-scaled to 1920px web-grade resolution (~150KB). Fast load, zero storage quota limit.
                    </p>
                  </div>
                </div>

                {/* Universal Quick Drop Upload Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsQuickDragOver(true); }}
                  onDragLeave={() => setIsQuickDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsQuickDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      handleUniversalCoverFileChange(file).then(() => {
                        setShowAddAlbumModal(true);
                      });
                    }
                  }}
                  style={{
                    padding: '24px',
                    borderRadius: '8px',
                    border: isQuickDragOver ? '2px dashed #ff6a13' : '1px dashed #28283c',
                    backgroundColor: isQuickDragOver ? 'rgba(255,106,19,0.08)' : '#0a0a10',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    textAlign: 'center',
                    marginBottom: '22px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,106,19,0.12)', border: '1px solid rgba(255,106,19,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UploadCloud style={{ width: '24px', height: '24px', color: '#ff6a13' }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#fff', display: 'block' }}>
                      Drag & Drop ANY Photo to Upload New Album
                    </strong>
                    <span style={{ fontSize: '12px', color: '#777788' }}>
                      Supports JPEG, PNG, WebP, AVIF, HEIC, TIFF, BMP, or camera exports. Auto-compressed in real-time.
                    </span>
                  </div>
                  <label style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 16px',
                    backgroundColor: '#1b1b28',
                    border: '1px solid #35354a',
                    color: '#ffaa66',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}>
                    <Upload style={{ width: '13px', height: '13px' }} />
                    <span>Browse Image File</span>
                    <input
                      type="file"
                      accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif,.bmp,.tiff,.tif,.gif,.svg"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUniversalCoverFileChange(file).then(() => {
                            setShowAddAlbumModal(true);
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                {/* ========================================================= */}
                {/* SYSTEM CATEGORIES MANAGER (ADD / EDIT / DELETE CATEGORIES) */}
                {/* ========================================================= */}
                <div style={{
                  padding: '20px 22px',
                  backgroundColor: '#0c0c14',
                  border: '1px solid #242436',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag style={{ width: '15px', height: '15px', color: '#ff6a13' }} />
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#ff6a13', fontWeight: 700 }}>
                          System Categories ({categoriesList.length} Active)
                        </span>
                      </div>
                      <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#888899' }}>
                        Add your own categories or delete unwanted ones (e.g. Weddings). Only active categories appear across website selectors & filters.
                      </p>
                    </div>

                    {/* Add Category Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddNewCategory();
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}
                    >
                      <input
                        type="text"
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        placeholder="New category name (e.g. Wildlife, Fashion)..."
                        className="admin-input"
                        style={{ padding: '8px 12px', borderRadius: '4px', fontSize: '12px', width: '250px' }}
                      />
                      <button
                        type="submit"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          backgroundColor: '#ff6a13',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 2px 10px rgba(255,106,19,0.35)'
                        }}
                      >
                        <Plus style={{ width: '14px', height: '14px' }} />
                        <span>Add Category</span>
                      </button>
                    </form>
                  </div>

                  {/* Category Chips List */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid #1a1a28' }}>
                    {categoriesList.map((cat) => {
                      const albumCount = albumsList.filter(a => (a.category || '').toLowerCase() === cat.name.toLowerCase()).length;
                      const isEditing = editingCategoryId === cat.id;

                      return (
                        <div
                          key={cat.id}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            borderRadius: '5px',
                            backgroundColor: '#13131d',
                            border: '1px solid #2a2a3e',
                            fontSize: '12px'
                          }}
                        >
                          {isEditing ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <input
                                type="text"
                                autoFocus
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleUpdateCategoryName(cat.id);
                                  if (e.key === 'Escape') setEditingCategoryId(null);
                                }}
                                className="admin-input"
                                style={{ padding: '3px 8px', fontSize: '11px', width: '130px' }}
                              />
                              <button
                                type="button"
                                onClick={() => handleUpdateCategoryName(cat.id)}
                                style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', padding: '2px' }}
                                title="Save name"
                              >
                                <Check style={{ width: '14px', height: '14px' }} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCategoryId(null)}
                                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '2px' }}
                                title="Cancel"
                              >
                                <X style={{ width: '14px', height: '14px' }} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <span style={{ color: '#fff', fontWeight: 600 }}>{cat.name}</span>
                              <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '3px', backgroundColor: '#1c1c2b', color: '#ffaa66', fontWeight: 600 }}>
                                {albumCount}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCategoryId(cat.id);
                                  setEditingCategoryName(cat.name);
                                }}
                                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '1px' }}
                                title="Rename category"
                              >
                                <Edit style={{ width: '12px', height: '12px' }} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategoryPrompt(cat.id, cat.name)}
                                style={{ background: 'none', border: 'none', color: '#ff6677', cursor: 'pointer', padding: '1px' }}
                                title="Delete category from entire system"
                              >
                                <Trash2 style={{ width: '12px', height: '12px' }} />
                              </button>
                            </>
                          )}
                        </div>
                      );
                    })}

                    {categoriesList.length === 0 && (
                      <span style={{ fontSize: '12px', color: '#ff6677' }}>
                        No categories in system. Please add at least one category above.
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={handleResetCategoriesToDefault}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        fontSize: '11px',
                        cursor: 'pointer',
                        marginLeft: 'auto',
                        textDecoration: 'underline'
                      }}
                      title="Reset categories to default initial set"
                    >
                      Reset Categories to Defaults
                    </button>
                  </div>
                </div>

                {/* Search & Category Filter Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', marginBottom: '18px', padding: '14px 18px', backgroundColor: '#0f0f17', border: '1px solid #1c1c28', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
                    <Search style={{ width: '15px', height: '15px', color: '#888' }} />
                    <input
                      type="text"
                      value={albumSearchQuery}
                      onChange={(e) => setAlbumSearchQuery(e.target.value)}
                      placeholder="Search albums by title, client, venue, or year..."
                      className="admin-input"
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', fontSize: '12px' }}
                    />
                    {albumSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setAlbumSearchQuery('')}
                        style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Category Filter Pills (Dynamically generated ONLY from active categories) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {['ALL', ...categoriesList.map(c => c.name.toUpperCase())].map((cat) => {
                      const isActive = albumCategoryFilter.toUpperCase() === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setAlbumCategoryFilter(cat)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            cursor: 'pointer',
                            border: isActive ? '1px solid #ff6a13' : '1px solid #222232',
                            backgroundColor: isActive ? '#ff6a13' : '#14141e',
                            color: isActive ? '#fff' : '#888899',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Album Cards Grid */}
                {(() => {
                  const filtered = albumsList.filter((a) => {
                    const albumCat = (a.category || '').toUpperCase();
                    const matchesCategory = albumCategoryFilter === 'ALL' || albumCat === albumCategoryFilter.toUpperCase();
                    const q = albumSearchQuery.toLowerCase().trim();
                    const matchesQuery = !q || (a.title && a.title.toLowerCase().includes(q)) || (a.subtitle && a.subtitle.toLowerCase().includes(q)) || (a.location && a.location.toLowerCase().includes(q)) || (a.date && a.date.toLowerCase().includes(q));
                    return matchesCategory && matchesQuery;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#0d0d14', border: '1px solid #1c1c28', borderRadius: '8px' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>No albums found matching "{albumSearchQuery}".</p>
                        <button
                          type="button"
                          onClick={() => { setAlbumSearchQuery(''); setAlbumCategoryFilter('ALL'); }}
                          style={{ marginTop: '12px', padding: '6px 14px', backgroundColor: '#181826', border: '1px solid #ff6a13', color: '#ff6a13', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          Clear Filters
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                      {filtered.map((album) => {
                        const globalIdx = albumsList.findIndex(a => a.id === album.id);
                        const isLiveOnHome = globalIdx < 12;

                        return (
                          <div
                            key={album.id}
                            className="admin-card"
                            style={{
                              padding: '14px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              borderColor: isLiveOnHome ? '#2a221d' : '#181824',
                              position: 'relative'
                            }}
                          >
                            {/* Card Cover with Badges */}
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#050508', marginBottom: '12px' }}>
                              <img
                                src={album.coverImage}
                                alt={album.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />

                              {/* Priority / Home Badge */}
                              <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10 }}>
                                {isLiveOnHome ? (
                                  <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', backgroundColor: '#ff6a13', color: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
                                    ★ Live Home #{globalIdx + 1}
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '9px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#aaa', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    ● Gallery Archive
                                  </span>
                                )}
                              </div>

                              {/* Category Badge */}
                              <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }}>
                                <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', padding: '2px 7px', borderRadius: '4px', backgroundColor: 'rgba(0,0,0,0.75)', color: '#ffaa66', border: '1px solid rgba(255,106,19,0.3)' }}>
                                  {album.category || 'Weddings'}
                                </span>
                              </div>

                              {/* Photo Count badge */}
                              <div style={{ position: 'absolute', bottom: '8px', right: '8px', zIndex: 10 }}>
                                <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '3px', backgroundColor: 'rgba(0,0,0,0.8)', color: '#ddd' }}>
                                  {album.photoCount || 40} Photos
                                </span>
                              </div>
                            </div>

                            {/* Card Details */}
                            <div style={{ marginBottom: '12px', flex: 1 }}>
                              <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', color: '#fff', fontWeight: 600 }}>
                                {album.title}
                              </h4>
                              {album.subtitle && (
                                <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#ffaa66', fontStyle: 'italic' }}>
                                  {album.subtitle}
                                </p>
                              )}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#777788', flexWrap: 'wrap' }}>
                                {album.location && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                    <MapPin style={{ width: '11px', height: '11px', color: '#ff6a13' }} />
                                    <span>{album.location}</span>
                                  </span>
                                )}
                                {album.date && (
                                  <span>• {album.date}</span>
                                )}
                              </div>
                            </div>

                            {/* Actions & Reordering Controls */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #1a1a26' }}>
                              {/* Move Priority buttons */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <button
                                  type="button"
                                  disabled={globalIdx === 0}
                                  onClick={() => handleMoveAlbum(album.id, 'up')}
                                  style={{
                                    padding: '3px 6px',
                                    backgroundColor: globalIdx === 0 ? '#101017' : '#181826',
                                    border: '1px solid #28283c',
                                    color: globalIdx === 0 ? '#444' : '#ffaa66',
                                    borderRadius: '3px',
                                    fontSize: '10px',
                                    cursor: globalIdx === 0 ? 'not-allowed' : 'pointer'
                                  }}
                                  title="Promote higher in Home Showcase"
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  disabled={globalIdx === albumsList.length - 1}
                                  onClick={() => handleMoveAlbum(album.id, 'down')}
                                  style={{
                                    padding: '3px 6px',
                                    backgroundColor: globalIdx === albumsList.length - 1 ? '#101017' : '#181826',
                                    border: '1px solid #28283c',
                                    color: globalIdx === albumsList.length - 1 ? '#444' : '#ffaa66',
                                    borderRadius: '3px',
                                    fontSize: '10px',
                                    cursor: globalIdx === albumsList.length - 1 ? 'not-allowed' : 'pointer'
                                  }}
                                  title="Demote lower in Home Showcase"
                                >
                                  ▼
                                </button>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditAlbumModal(album)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '5px 10px',
                                    backgroundColor: '#181826',
                                    border: '1px solid #333346',
                                    color: '#eee',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Edit style={{ width: '12px', height: '12px', color: '#ff6a13' }} />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteAlbum(album.id, album.title)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '5px 8px',
                                    backgroundColor: '#1c1014',
                                    border: '1px solid #4a1520',
                                    color: '#ff6677',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    cursor: 'pointer'
                                  }}
                                  title="Delete Album"
                                >
                                  <Trash2 style={{ width: '12px', height: '12px' }} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* CLIENT GALLERY */}
            {activeSection === 'customize-gallery' && (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
                  <h1 style={{ margin: 0, fontSize: '24px', color: '#fff', fontWeight: 400 }}>Customize Gallery Page</h1>
                  <button onClick={() => triggerGenericSave('Gallery Page')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: '#ff6a13', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    <Save style={{ width: '14px', height: '14px' }} />
                    <span>Save Changes</span>
                  </button>
                </div>

                {/* Primary CTA to open dedicated album manager */}
                <div className="admin-card" style={{ padding: '24px', backgroundColor: '#0f0f18', border: '1px solid #28283c', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#ff6a13', fontWeight: 700, letterSpacing: '0.1em' }}>MASTERPIECE ALBUMS HUB</span>
                    <h3 style={{ margin: '4px 0 6px 0', fontSize: '18px', color: '#fff', fontWeight: 600 }}>Manage All Client Albums ({albumsList.length} Collections)</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888899', maxWidth: '560px' }}>
                      Upload new albums in any format (JPG, PNG, WebP, AVIF, HEIC, TIFF, BMP, URLs) with auto-compression, multi-photo collections, and reordering.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSection('manage-albums')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      backgroundColor: '#ff6a13',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(255, 106, 19, 0.4)'
                    }}
                  >
                    <Layers style={{ width: '15px', height: '15px' }} />
                    <span>Open Dedicated Album Manager →</span>
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

        {/* ========================================================= */}
        {/* UNIVERSAL MULTI-FORMAT ALBUM UPLOAD & EDIT MODAL */}
        {/* ========================================================= */}
        {showAddAlbumModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(10px)',
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
                maxWidth: '680px',
                maxHeight: '92vh',
                overflowY: 'auto',
                backgroundColor: '#0c0c14',
                border: '1px solid #2d2d42',
                borderRadius: '12px',
                padding: '28px',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9)',
                boxSizing: 'border-box'
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #1c1c28' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#ff6a13', fontWeight: 700 }}>
                      {editingAlbum ? 'UPDATE ALBUM' : 'NEW MASTERPIECE ALBUM'}
                    </span>
                    <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '3px', backgroundColor: '#181826', color: '#38bdf8', border: '1px solid #28283c', fontWeight: 600 }}>
                      All Formats Compatible
                    </span>
                  </div>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', color: '#fff', fontWeight: 600 }}>
                    {editingAlbum ? 'Edit Album Details & Photos' : 'Upload & Publish Album'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAlbumModal(false);
                    setEditingAlbum(null);
                    setAlbumUploadStats(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X style={{ width: '22px', height: '22px' }} />
                </button>
              </div>

              <form onSubmit={handleSaveAlbum} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Universal Cover Image Upload Zone */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#ffaa66', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Album Cover Photo * (ANY FORMAT)
                    </label>
                    <span style={{ fontSize: '10px', color: '#888' }}>
                      JPG, PNG, WebP, AVIF, HEIC, TIFF, BMP, or URL
                    </span>
                  </div>

                  {/* Drag & Drop Zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsCoverDragOver(true); }}
                    onDragLeave={() => setIsCoverDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsCoverDragOver(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleUniversalCoverFileChange(file);
                    }}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      border: isCoverDragOver ? '2px dashed #ff6a13' : '1px dashed #2e2e42',
                      backgroundColor: isCoverDragOver ? 'rgba(255,106,19,0.08)' : '#101018',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      marginBottom: '10px'
                    }}
                  >
                    {isProcessingAlbumImage ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffaa66', fontSize: '12px', padding: '12px' }}>
                        <RotateCcw className="animate-spin" style={{ width: '16px', height: '16px' }} />
                        <span>Processing and optimizing image format...</span>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <label style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            backgroundColor: '#ff6a13',
                            color: '#fff',
                            borderRadius: '5px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 10px rgba(255, 106, 19, 0.35)'
                          }}>
                            <Upload style={{ width: '14px', height: '14px' }} />
                            <span>Choose Image File</span>
                            <input
                              type="file"
                              accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif,.bmp,.tiff,.tif,.gif,.svg"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUniversalCoverFileChange(file);
                              }}
                            />
                          </label>
                          <span style={{ fontSize: '12px', color: '#666' }}>or drag & drop your photo file here</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* URL Input Fallback */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      required
                      value={albumForm.coverImage}
                      placeholder="Or paste direct image URL (https://...)"
                      onChange={(e) => setAlbumForm({ ...albumForm, coverImage: e.target.value })}
                      className="admin-input"
                      style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Optimization Badge & Preview */}
                  {albumUploadStats && (
                    <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#4ade80' }}>
                      <CheckCircle2 style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                      <span>
                        <strong>Format converted:</strong> {albumUploadStats.format} ({albumUploadStats.originalSize}) → Optimized to {albumUploadStats.outputFormat} ({albumUploadStats.compressedSize})
                      </span>
                    </div>
                  )}

                  {albumForm.coverImage && (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '14px', padding: '10px', backgroundColor: '#13131d', borderRadius: '6px', border: '1px solid #202030' }}>
                      <img
                        src={albumForm.coverImage}
                        alt="Cover Preview"
                        style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ff6a13' }}
                      />
                      <div>
                        <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600, display: 'block' }}>Active Cover Photo</span>
                        <span style={{ fontSize: '10px', color: '#22c55e' }}>✓ Ready for live showcase & gallery</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Title & Subtitle */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#ffaa66', marginBottom: '4px' }}>
                      Album Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={albumForm.title}
                      placeholder="e.g. Kasun & Shenali"
                      onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                      className="admin-input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#ccc', marginBottom: '4px' }}>
                      Subtitle / Ceremony Type
                    </label>
                    <input
                      type="text"
                      value={albumForm.subtitle}
                      placeholder="e.g. Sacred Poruwa & Kandyan Elegance"
                      onChange={(e) => setAlbumForm({ ...albumForm, subtitle: e.target.value })}
                      className="admin-input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Category & Photo Count */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#ccc' }}>
                        Category *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const name = prompt('Enter new category name to add to system:');
                          if (name && name.trim()) {
                            const created = handleAddNewCategory(name.trim());
                            if (created) {
                              setAlbumForm(prev => ({ ...prev, category: created.name }));
                            }
                          }
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ff6a13',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        + Add New Category
                      </button>
                    </div>
                    <select
                      value={albumForm.category}
                      onChange={(e) => setAlbumForm({ ...albumForm, category: e.target.value })}
                      className="admin-input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box', backgroundColor: '#14141f' }}
                    >
                      {categoriesList.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                      {albumForm.category && !categoriesList.some(c => c.name.toLowerCase() === albumForm.category.toLowerCase()) && (
                        <option value={albumForm.category}>{albumForm.category} (Current)</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#ccc', marginBottom: '4px' }}>
                      Total Photo Count (in album)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={albumForm.photoCount}
                      onChange={(e) => setAlbumForm({ ...albumForm, photoCount: parseInt(e.target.value) || 40 })}
                      className="admin-input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Location & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#ccc', marginBottom: '4px' }}>
                      Location / Venue
                    </label>
                    <input
                      type="text"
                      value={albumForm.location}
                      placeholder="e.g. The Grand Kandyan Hotel, Kandy"
                      onChange={(e) => setAlbumForm({ ...albumForm, location: e.target.value })}
                      className="admin-input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#ccc', marginBottom: '4px' }}>
                      Date / Season
                    </label>
                    <input
                      type="text"
                      value={albumForm.date}
                      placeholder="e.g. October 2026"
                      onChange={(e) => setAlbumForm({ ...albumForm, date: e.target.value })}
                      className="admin-input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Multiple Photos in this Album (Optional Collection) */}
                <div style={{ padding: '14px', backgroundColor: '#101018', border: '1px solid #1c1c28', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '12px', color: '#fff', display: 'block' }}>
                        Album Gallery Photos ({albumForm.photos?.length || 0} Photos)
                      </strong>
                      <span style={{ fontSize: '11px', color: '#888' }}>
                        Add multiple photos to this album. Compatible with any image format.
                      </span>
                    </div>

                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      backgroundColor: '#1b1b28',
                      border: '1px solid #333346',
                      color: '#ffaa66',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                      <Plus style={{ width: '13px', height: '13px' }} />
                      <span>+ Add More Photos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif,.bmp,.tiff,.tif,.gif,.svg"
                        style={{ display: 'none' }}
                        onChange={(e) => handleUniversalMultiplePhotosUpload(e.target.files)}
                      />
                    </label>
                  </div>

                  {albumForm.photos && albumForm.photos.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto', padding: '4px' }}>
                      {albumForm.photos.map((photoUrl, pIdx) => {
                        const isCover = photoUrl === albumForm.coverImage;
                        return (
                          <div
                            key={pIdx}
                            style={{
                              position: 'relative',
                              aspectRatio: '1 / 1',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              border: isCover ? '2px solid #ff6a13' : '1px solid #28283c'
                            }}
                          >
                            <img src={photoUrl} alt={`Photo ${pIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            
                            {/* Actions on hover */}
                            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', opacity: 0, transition: 'opacity 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }} className="hover:opacity-100">
                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPhotoAsCover(photoUrl)}
                                  style={{ padding: '2px 4px', backgroundColor: '#ff6a13', border: 'none', color: '#fff', fontSize: '9px', borderRadius: '2px', cursor: 'pointer' }}
                                  title="Set as Cover"
                                >
                                  Cover
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemovePhotoFromAlbum(pIdx)}
                                style={{ padding: '2px 4px', backgroundColor: '#ff4444', border: 'none', color: '#fff', fontSize: '9px', borderRadius: '2px', cursor: 'pointer' }}
                                title="Remove"
                              >
                                ×
                              </button>
                            </div>

                            {isCover && (
                              <span style={{ position: 'absolute', bottom: '2px', left: '2px', fontSize: '8px', padding: '1px 3px', backgroundColor: '#ff6a13', color: '#fff', borderRadius: '2px', fontWeight: 700 }}>
                                Cover
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#ccc', marginBottom: '4px' }}>
                    Album Description / Client Story (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={albumForm.description}
                    placeholder="Brief background story about this couple or milestone event..."
                    onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                    className="admin-input"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', paddingTop: '14px', borderTop: '1px solid #1e1e2d' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAlbumModal(false);
                      setEditingAlbum(null);
                      setAlbumUploadStats(null);
                    }}
                    style={{
                      padding: '9px 18px',
                      backgroundColor: '#181824',
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
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 22px',
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
                    <Save style={{ width: '14px', height: '14px' }} />
                    <span>{editingAlbum ? 'Save Album Changes' : 'Publish & Add to Showcase'}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

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
