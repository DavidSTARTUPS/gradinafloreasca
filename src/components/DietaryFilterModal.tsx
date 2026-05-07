import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { t } from '../data/menuData';

// --- COMPONENTA FILTRE DIETETICE (Modern Minimalist) ---
export const DietaryFilterModal = ({
  isOpen,
  onClose,
  lang,
  currentFilters,
  onApplyFilters,
}: {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  currentFilters: any;
  onApplyFilters: (f: any) => void;
}) => {
  const [localFilters, setLocalFilters] = useState(currentFilters);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(currentFilters);
    }
  }, [currentFilters, isOpen]);

  const toggleOptions = [
    { id: "vegetarian", labelEn: "Vegetarian", labelRo: "Vegetarian" },
    { id: "vegan", labelEn: "Vegan", labelRo: "Vegan" },
    { id: "gf", labelEn: "Gluten-Free", labelRo: "Fara Gluten" },
    { id: "df", labelEn: "Dairy-Free", labelRo: "Fara Lactoza" },
    { id: "nut", labelEn: "Nut Allergy", labelRo: "Alergie la Alune", isWarning: true },
  ];

  return (
    <div className={`fixed inset-0 z-[250] bg-[#050505] flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? "translate-y-0" : "translate-y-full"}`}>
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#050505] h-[72px]">
        <button onClick={onClose} aria-label="Go back" className="flex items-center justify-center w-12 h-12 rounded-full active:bg-white/10 transition-colors">
          <X className="text-white" size={32} />
        </button>
        <h1 className="text-white text-3xl md:text-4xl font-serif font-medium absolute left-1/2 transform -translate-x-1/2">
          {t(lang, "Filtre Dietetice", "Dietary Needs")}
        </h1>
        <div className="w-12 h-12"></div> {/* Spacer */}
      </header>

      {/* Main Content: Filter List */}
      <main className="flex-1 overflow-y-auto px-6 pb-32 pt-4 no-scrollbar">
        <p className="text-[#A3A3A3] text-sm md:text-base font-light mb-8 leading-relaxed">
          {t(
            lang,
            "Bifati optiunile de mai jos pentru a filtra meniul. Preparatele care contin ingrediente neselectate vor fi ascunse.",
            "Toggle the options below to filter the menu. Dishes containing unselected ingredients will be hidden."
          )}
        </p>
        
        <div className="flex flex-col">
          {toggleOptions.map((opt) => (
            <div key={opt.id} className="flex items-center justify-between h-[72px] border-b border-white/10 group">
              <label htmlFor={`toggle-${opt.id}`} className={`text-lg md:text-xl font-bold tracking-wide flex-1 cursor-pointer flex items-center gap-3 transition-colors ${opt.isWarning ? "text-brand-accent hover:text-brand-accentHover" : "text-white hover:text-gray-200"}`}>
                {opt.isWarning && <Info size={22} />}
                {t(lang, opt.labelRo, opt.labelEn)}
              </label>
              <div className="relative inline-block w-[56px] h-[32px] align-middle select-none shrink-0">
                <input
                  id={`toggle-${opt.id}`}
                  type="checkbox"
                  className="peer absolute inset-0 w-full h-full cursor-pointer z-20 opacity-0 m-0 p-0"
                  checked={localFilters[opt.id as keyof typeof localFilters]}
                  onChange={(e) => setLocalFilters({ ...localFilters, [opt.id]: e.target.checked })}
                />
                <div className="absolute inset-0 rounded-full bg-[#1A1A1A] peer-checked:bg-brand-accent transition-colors duration-300 pointer-events-none"></div>
                <div className="absolute top-[2px] left-[2px] w-[28px] h-[28px] bg-[#A3A3A3] rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] peer-checked:translate-x-[24px] peer-checked:bg-white shadow-sm pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Sticky Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 backdrop-blur-[24px] bg-[#141414]/75 border-t border-white/5 z-50">
        <button 
          onClick={() => { onApplyFilters(localFilters); onClose(); }} 
          className="w-full h-[64px] bg-brand-accent text-white text-sm font-bold uppercase tracking-widest rounded-full flex items-center justify-center active:scale-[0.98] transition-all shadow-lg hover:bg-brand-accentHover"
        >
          {t(lang, "Aplica Filtrele", "Apply Filters")}
        </button>
      </div>
    </div>
  );
};
