import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function PortfolioPreview({ onOpenBooking }) {
  const [filter, setFilter] = useState('ALL');

  const categories = ['ALL', 'WEDDINGS', 'HOMECOMING', 'PRE-SHOOT', 'PORTRAITURE'];

  const works = [
    {
      id: 1,
      title: 'Grand Nuptials & Romance',
      category: 'WEDDINGS',
      location: 'Colombo, Sri Lanka',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85',
      span: 'col-span-1 md:col-span-2 row-span-2',
    },
    {
      id: 2,
      title: 'Golden Sunset at Bentota',
      category: 'PRE-SHOOT',
      location: 'Southern Coastline',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      span: 'col-span-1',
    },
    {
      id: 3,
      title: 'Haute Bridal Portrait',
      category: 'PORTRAITURE',
      location: 'Cinnamon Grand Studio',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      span: 'col-span-1',
    },
    {
      id: 4,
      title: 'Royal Homecoming Celebration',
      category: 'HOMECOMING',
      location: 'Galle Face Hotel, Colombo',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      span: 'col-span-1',
    },
    {
      id: 5,
      title: 'Highlands Mist & Romance',
      category: 'PRE-SHOOT',
      location: 'Nuwara Eliya Tea Country',
      image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
      span: 'col-span-1',
    }
  ];

  const filtered = filter === 'ALL' ? works : works.filter(w => w.category === filter);

  return (
    <section id="portfolio" className="py-24 bg-[#0a0a0d] border-t border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] text-[#ff6a13] font-semibold uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a13]" />
              Selected Portfolio
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-light text-white tracking-tight">
              Stories of <span className="italic text-neutral-300">Timeless Elegance</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={
                  "text-[11px] font-semibold tracking-[0.18em] uppercase px-4 py-2 border transition-all " +
                  (filter === cat
                    ? "bg-[#ff6a13] text-white border-[#ff6a13] shadow-md shadow-[#ff6a13]/25"
                    : "bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700")
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={"group relative overflow-hidden border border-neutral-800/80 bg-neutral-950 aspect-[4/3] " + item.span}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 text-[10px] tracking-[0.2em] font-bold uppercase bg-black/70 backdrop-blur-md text-[#ff944d] border border-[#ff6a13]/30">
                    {item.category}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:rotate-45 duration-300">
                    <ArrowUpRight className="w-4 h-4 text-[#ff6a13]" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif-luxury text-xl sm:text-2xl text-white font-medium mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 flex items-center gap-1">
                    <span>{item.location}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 border border-neutral-800 bg-gradient-to-r from-neutral-950 via-[#14100c] to-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium">
              Planning your celebration in Sri Lanka or Overseas?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Popular wedding dates fill up fast. Inquire today to guarantee your date.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenBooking}
            className="px-7 py-3 bg-[#ff6a13] hover:bg-[#e05300] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-lg shadow-[#ff6a13]/25 flex-shrink-0"
          >
            Check Date Availability
          </button>
        </div>

      </div>
    </section>
  );
}
