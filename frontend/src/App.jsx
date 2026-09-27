import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StorySection from './components/StorySection';
import PortfolioPreview from './components/PortfolioPreview';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-100 flex flex-col font-sans selection:bg-[#ff6a13] selection:text-white">
      {/* Top Floating Transparent Navigation */}
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Fullscreen Hero Section (Matching media_1790519034685.png) */}
        <Hero onOpenBooking={() => setIsBookingOpen(true)} />

        {/* Story Section: Inspired by the Elegance of Simplicity (Matching media_1790517783083.png) */}
        <StorySection onOpenBooking={() => setIsBookingOpen(true)} />

        {/* Selected Portfolio Gallery */}
        <PortfolioPreview onOpenBooking={() => setIsBookingOpen(true)} />
      </main>

      {/* Footer */}
      <Footer onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Reservation & Booking Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
}

export default App;
