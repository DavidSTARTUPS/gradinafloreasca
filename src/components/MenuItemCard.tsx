import React, { useState } from 'react';
import { Info, Plus } from 'lucide-react';
import { t } from '../data/menuData';

// --- COMPONENTA PREPARAT (Acordeon Optimizat) ---
export const MenuItemCard = ({ item, index, lang }: { item: any; index: number; lang: string }) => {
  if (item.isHeader) {
    return (
      <div className="pt-12 pb-4 mb-6 border-b border-white/5">
        <h3 className="text-xl font-black tracking-[0.2em] text-brand-accent uppercase">
          {item.name}
        </h3>
      </div>
    );
  }

  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!hasBeenOpened) setHasBeenOpened(true);
  };

  const imageUrl =
    item.image ||
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80";

  return (
    <div
      className={`group mb-6 pb-6 border-b border-white/5 last:border-0 animate-slide-up-stagger`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* HEADER-ul preparatului: Nume, Descriere, Pret, Buton */}
      <div
        className="flex items-start justify-between cursor-pointer gap-4"
        onClick={handleToggle}
      >
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-bold text-white tracking-wide transition-colors group-hover:text-brand-accent flex items-center gap-2 flex-wrap">
            {item.name}
            {item.name.includes("Diavola") && (
              <span className="text-[9px] bg-red-900/30 text-red-500 border border-red-900/50 px-1.5 py-0.5 rounded tracking-widest mt-0.5">
                PICANT
              </span>
            )}
          </h3>
          <p className="text-gray-400 mt-1.5 font-light text-xs md:text-sm leading-relaxed pr-2">
            {item.desc}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 mt-0.5">
          <span className="text-base md:text-lg font-medium text-white">
            {item.price}
          </span>
          <div
            className={`w-7 h-7 md:w-8 md:h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${
              isOpen
                ? "border-brand-accent bg-brand-accent/20 text-brand-accent"
                : "border-gray-700 group-hover:border-brand-accent/50 text-gray-400 group-hover:text-brand-accent"
            }`}
          >
            <Plus 
              size={18} 
              strokeWidth={3} 
              className={`transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`} 
            />
          </div>
        </div>
      </div>

      {/* CONTINUT EXPANDABIL (Poza si alergeni) */}
      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen
            ? "grid-rows-[1fr] mt-5 opacity-100"
            : "grid-rows-[0fr] mt-0 opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-[#161616] border border-gray-800/60 p-4 md:p-5 rounded-2xl flex flex-col md:flex-row gap-5 md:gap-6 shadow-inner">
            {/* IMAGINEA PREPARATULUI */}
            <div className="w-full md:w-1/3 h-48 md:h-auto min-h-[140px] rounded-xl overflow-hidden relative shadow-md border border-white/5 bg-[#121212]">
              {hasBeenOpened && (
                <>
                  <img
                    src={imageUrl}
                    alt={item.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700 animate-fade-in"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                </>
              )}
            </div>

            {/* DETALIILE TEHNICE */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-5">
                <strong className="flex items-center gap-2 text-brand-accent uppercase tracking-widest mb-2 text-[10px]">
                  <Info size={12} />
                  {t(lang, "Alergeni & Detalii", "Allergens & Details")}
                </strong>
                <span className="text-gray-300 text-sm font-light leading-relaxed block">
                  {item.nutrition?.allergens || "-"}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 md:gap-3 bg-black/40 p-3 md:p-4 rounded-xl border border-gray-800/50">
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] md:text-[9px] uppercase text-gray-500 mb-1 tracking-widest">
                    Kcal
                  </span>
                  <span className="text-gray-200 text-xs md:text-sm font-medium">
                    {item.nutrition?.cal || "-"}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center border-l border-gray-800">
                  <span className="text-[8px] md:text-[9px] uppercase text-gray-500 mb-1 tracking-widest">
                    Prot
                  </span>
                  <span className="text-gray-200 text-xs md:text-sm font-medium">
                    {item.nutrition?.prot || "-"}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center border-l border-gray-800">
                  <span className="text-[8px] md:text-[9px] uppercase text-gray-500 mb-1 tracking-widest">
                    Carb
                  </span>
                  <span className="text-gray-200 text-xs md:text-sm font-medium">
                    {item.nutrition?.carb || "-"}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center border-l border-gray-800">
                  <span className="text-[8px] md:text-[9px] uppercase text-gray-500 mb-1 tracking-widest">
                    {t(lang, "Grasimi", "Fats")}
                  </span>
                  <span className="text-gray-200 text-xs md:text-sm font-medium">
                    {item.nutrition?.fat || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
