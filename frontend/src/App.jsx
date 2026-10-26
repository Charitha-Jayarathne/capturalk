import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import PortfolioPage from './pages/PortfolioPage';
import ClientGallery from './pages/ClientGallery';
import ReviewsPage from './pages/ReviewsPage';
import ContactUs from './pages/ContactUs';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-100 flex flex-col font-sans selection:bg-[#ff6a13] selection:text-white">
      {/* Top Floating Luxury Navigation (hidden on Admin pages) */}
      {!isAdmin && <Navbar onOpenBooking={openBooking} />}

      {/* Dynamic Route Pages */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onOpenBooking={openBooking} />} />
          <Route path="/about" element={<AboutUs onOpenBooking={openBooking} />} />
          <Route path="/portfolio" element={<PortfolioPage onOpenBooking={openBooking} />} />
          <Route path="/client-gallery" element={<ClientGallery onOpenBooking={openBooking} />} />
          <Route path="/reviews" element={<ReviewsPage onOpenBooking={openBooking} />} />
          <Route path="/contact" element={<ContactUs onOpenBooking={openBooking} />} />
          <Route path="/admin" element={<AdminPage />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Luxury Footer (hidden on Admin pages) */}
      {!isAdmin && <Footer onOpenBooking={openBooking} />}

      {/* Reservation & Booking Modal (accessible globally across all pages) */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={closeBooking}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

