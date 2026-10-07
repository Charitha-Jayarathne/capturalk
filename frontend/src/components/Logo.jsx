import React from 'react';

export default function Logo() {
  return (
    <a href="#home" className="inline-flex flex-col group select-none transition-transform hover:scale-105 duration-200">
      <div className="flex items-center">
        <span className="bg-[#ff6a13] text-white font-black text-lg sm:text-xl px-2 py-0.5 tracking-tight font-sans">
          CAP
        </span>
        <span className="text-white font-black text-lg sm:text-xl tracking-tight pl-1.5 font-sans">
          TURA<span className="text-[#ff6a13]">.</span>
        </span>
      </div>
      <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 tracking-[0.32em] uppercase mt-0.5 pl-0.5">
        EVENTS • LK
      </span>
    </a>
  );
}
