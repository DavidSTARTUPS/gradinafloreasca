import React from 'react';
import { t } from '../data/menuData';

// --- COMPONENTA FOOTER LEGAL ---
export const LegalFooter = ({ lang, theme = "light" }: { lang: string; theme?: string }) => {
  const isDark = theme === "dark";
  const bgClass = isDark
    ? "bg-[#161616] border-gray-800 text-gray-400"
    : "bg-white border-brand-border text-gray-500";
  const textTitle = isDark ? "text-white" : "text-brand-dark";

  return (
    <div
      className={`mt-auto pt-16 pb-32 md:pb-16 px-6 border-t ${bgClass} text-left`}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-[10px] uppercase tracking-widest leading-loose">
        <div>
          <p className={`font-bold mb-3 ${textTitle}`}>
            Gradina Floreasca
          </p>
          <p></p>
          <p className="mb-3">
            {t(
              lang,
              "Bulevardul Mircea Eliade 16",
              "Johann Sebastian Bach St. 3"
            )}
            <br />
            014192 Bucuresti
          </p>
          <a
            href="https://www.google.com/maps/search/Gradina+Floreasca+Bucuresti//?hl=en"
            target="_blank"
            rel="noreferrer"
            className="inline-block px-4 py-2 bg-brand-accent text-white rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-brand-accentHover transition-colors shadow-sm"
          >
            {t(lang, "Navigheaza spre noi", "Navigate to us")}
          </a>
        </div>
        <div>
          <p className={`font-bold mb-3 ${textTitle}`}>
            {t(lang, "Contact Rapid", "Quick Contact")}
          </p>
          <p>Tel: 0755 085 967</p>
          <p>Email: contact@gradinafloreasca.ro</p>
          <p className="mt-2 text-gray-400 font-bold">
            {t(
              lang,
              "Zilnic: 10:00 - 23:30",
              "Daily: 10:00 - 23:30"
            )}
            <br />
            {t(lang, "", "")}
          </p>
        </div>
        <div className="flex flex-col md:items-end gap-3">
          <p className={`font-bold mb-1 ${textTitle}`}>
            {t(lang, "Legal & Transparenta", "Legal & Transparency")}
          </p>
          <a
            href="https://anpc.ro"
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand-accent transition-colors"
          >
            ANPC
          </a>
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand-accent transition-colors"
          >
            SOL / SAL
          </a>
          <div className="mt-4 flex flex-wrap gap-2 md:justify-end text-[8px] opacity-70">
            <span className="px-2 py-1 border border-current rounded-full">
              LGBTQ+ Friendly
            </span>
            <span className="px-2 py-1 border border-current rounded-full">
              Family Friendly
            </span>
            <span className="px-2 py-1 border border-current rounded-full">
              Wheelchair Accessible
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
