import React, { useState, useEffect, useRef } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { supabase } from "./supabaseClient";

import { getMenuCategories, getMenuData, t } from './data/menuData';
import { MenuItemCard } from './components/MenuItemCard';
import { LegalFooter } from './components/LegalFooter';
import { ReservationModal } from './components/ReservationModal';
import { DietaryFilterModal } from './components/DietaryFilterModal';

import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Pizza,
  Utensils,
  Coffee,
  Wine,
  ChefHat,
  Salad,
  CalendarCheck,
  Sparkles,
  Phone,
  Users,
  CalendarHeart,
  Briefcase,
  MapPin,
  Clock,
  ShoppingBag,
  Home,
  Facebook,
  Mail,
  Instagram,
  ShieldCheck,
  ExternalLink,
  Scale,
  Info,
  Music2,
  Moon,
  Sun,
  Star,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";



// --- APLICATIA PRINCIPALA ---
export default function App() {
  const [activeView, setActiveView] = useState("home");
  const [isPreloading, setIsPreloading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isDietaryModalOpen, setIsDietaryModalOpen] = useState(false);
  const [language, setLanguage] = useState("RO");
  const [activeMenuCategory, setActiveMenuCategory] = useState("mic-dejun");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dietaryFilters, setDietaryFilters] = useState({
    vegetarian: false,
    vegan: false,
    gf: false,
    df: false,
    nut: false,
  });

  const menuRef = useRef(null);
  const scrollLocked = useRef(false);
  const touchStartY = useRef(0);

  const currentCategories = getMenuCategories(language);
  const currentMenuData = getMenuData(language);
  const [dbMenuItems, setDbMenuItems] = useState<any[]>([]);

  // Sincronizare cu Baza de Date pentru Stoc/Preturi
  const fetchDbMenu = async () => {
    try {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (error) throw error;
      if (data) setDbMenuItems(data);
    } catch (err) {
      console.error("Eroare la incarcarea meniului din DB:", err);
    }
  };

  useEffect(() => {
    fetchDbMenu();

    // Realtime update pentru stoc - Ascultam absolut orice schimbare
    const sub = supabase.channel('menu_sync_realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        (payload) => {
          console.log("Schimbare detectata in meniu:", payload);
          fetchDbMenu();
        }
      )
      .subscribe((status) => {
        console.log("Status subscriptie Realtime:", status);
      });

    return () => { supabase.removeChannel(sub); };
  }, []);

  // --- CELE 4 SLIDE-URI ---
  const slides = [
    {
      title: (lang: string) => t(lang, "Gradina Floreasca", "Gradina Floreasca"),
      subtitle: (lang: string) => t(lang, "RESTAURANT & EVENTS", "RESTAURANT & EVENTS"),
      desc: (lang: string) =>
        t(
          lang,
          "Salate internationale, preparate de mana si feluri principale prezentate intr-o cafenea in aer liber eleganta intr-un parc, cu piscina.",
          "Global salads, handhelds & mains presented in a stylish alfresco cafe in a park, set around a pool."
        ),
      image: "download (2).png",
      type: "hero",
    },
    {
      title: (lang: string) => t(lang, "PARERILE OASPETILOR", "GUEST REVIEWS"),
      subtitle: (lang: string) =>
        t(lang, "4.5/5 DIN 2700+ RECENZII", "4.5/5 FROM 2700+ REVIEWS"),
      image: "download (4).png",
      type: "reviews",
      reviews: [
        {
          name: "Costi Baicu",
          text: t(
            language,
            "Am fost acolo in august-septembrie, atat pentru piscina cat si pentru restaurant. Mancarea a fost foarte buna, iar atmosfera in sine era foarte linistita.",
            "I visited in August-September, both for the pool and the restaurant. The food was excellent, and the atmosphere itself was incredibly peaceful."
          ),
        },
        {
          name: "Marius Eana",
          text: t(
            language,
            "Am comandat o pizza Margherita tare bună, la fel si salata cu halloumi si semințe. Limonada de ghimbir a fost exact cum trebuie. Locația este tare faină, ideală pentru a sta la o terasă înconjurată de verde.",
            "I ordered a Margherita pizza which was very good, as was the halloumi salad. The ginger lemonade was spot on. A wonderful location, ideal for relaxing on a terrace surrounded by greenery."
          ),
        },
        {
          name: "iulius caesar",
          text: t(
            language,
            "Locație excelentă. Servicii de calitate cu cei mai atenți ospătari. La evenimentul nostru privat mâncarea a fost foarte bună, iar barmanii au făcut cele mai bune cocktail-uri. Recomand cu drag!",
            "Excellent location. Premium service with highly attentive staff. For our private event, the food was delicious and the bartenders crafted amazing cocktails. Highly recommend!"
          ),
        },
        {
          name: "Daniela Gabriela Deleanu",
          text: t(
            language,
            "O experiență absolut minunată în ziua nunții noastre. Totul a fost perfect organizat, personalul excelent, iar mâncarea delicioasă. Un loc ideal pentru evenimente intime, plin de verdeață.",
            "An absolutely wonderful experience on our wedding day. Everything was perfectly organized, the staff was excellent, and the food delicious. An ideal venue for intimate events surrounded by greenery."
          ),
        },


      ],
    },
    {
      title: (lang: string) => t(lang, "OAZĂ URBANĂ", "URBAN OASIS"),
      subtitle: (lang: string) => t(lang, "RELAXARE ÎN NATURĂ", "RELAXATION IN NATURE"),
      desc: (lang: string) =>
        t(
          lang,
          "O grădină plină de viață, unde serile de vară devin amintiri de neuitat sub cerul liber.",
          "A lively garden where summer evenings become unforgettable memories under the open sky."
        ),
      image: "download (5).png",
      type: "hero",
    },
    {
      title: (lang: string) => t(lang, "EXPERIENȚE MEMORABILE", "MEMORABLE EXPERIENCES"),
      subtitle: (lang: string) => t(lang, "ELEGANȚĂ ȘI GUST", "ELEGANCE AND TASTE"),
      desc: (lang: string) =>
        t(
          lang,
          "Fine dining într-un cadru de poveste, creat special pentru momentele care contează cu adevărat.",
          "Fine dining in a fairytale setting, specially created for the moments that truly matter."
        ),
      image: "download (3).png",
      type: "hero",
    },
  ];

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const timer = setTimeout(() => setIsPreloading(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- REZOLVARE SCROLL INTERACTIV ---
  useEffect(() => {
    if (activeView !== "home") {
      document.body.style.overflow = "auto";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleWheel = (e) => {
      if (scrollLocked.current) return;
      if (Math.abs(e.deltaY) < 30) return;

      scrollLocked.current = true;
      if (e.deltaY > 0) {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
      setTimeout(() => {
        scrollLocked.current = false;
      }, 1400);
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (scrollLocked.current) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) > 40) {
        scrollLocked.current = true;
        if (deltaY > 0) {
          setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
        } else {
          setCurrentSlide((prev) => Math.max(prev - 1, 0));
        }
        setTimeout(() => {
          scrollLocked.current = false;
        }, 1200);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      document.body.style.overflow = "auto";
    };
  }, [activeView, slides.length]);

  const navigate = (view) => {
    if (view === "book") {
      setIsReservationOpen(true);
      setIsMenuOpen(false);
      return;
    }
    if (view === "menu" && activeView === "menu") {
      setActiveView("home");
      setIsMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setActiveView(view);
    setIsMenuOpen(false);
    setCurrentSlide(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToCategory = (id) => {
    setActiveMenuCategory(id);
    const element = document.getElementById(`cat-${id}`);
    if (element) {
      const yOffset = -140;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // --- VIEWS ---

  const renderHome = () => (
    <div className="relative flex-1 w-full h-full overflow-hidden bg-brand-dark">
      {slides.map((slide, idx) => {
        const isActive = currentSlide === idx;
        const isPast = currentSlide > idx;

        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${isActive
              ? "translate-y-0 opacity-100 z-10"
              : isPast
                ? "-translate-y-full opacity-0 z-0"
                : "translate-y-full opacity-0 z-0"
              }`}
          >
            <img
              src={slide.image}
              className={`absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[20s] ease-linear ${isActive ? "scale-110" : "scale-100"
                }`}
              alt="Refresh Slide"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/70"></div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pt-4 md:pt-10">
              <div
                className={`transition-all duration-1000 ease-in-out ${isActive
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-20 opacity-0 scale-95"
                  }`}
              >
                <h2 className="text-brand-accent font-serif text-xl md:text-3xl lg:text-4xl mb-2 md:mb-4 drop-shadow-md tracking-widest uppercase">
                  {typeof slide.title === "function"
                    ? slide.title(language)
                    : slide.title}
                </h2>
                <h1 className="text-white font-extrabold text-3xl md:text-6xl lg:text-7xl tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-xl px-2">
                  {typeof slide.subtitle === "function"
                    ? slide.subtitle(language)
                    : slide.subtitle}
                </h1>
              </div>

              {slide.type === "reviews" ? (
                <div
                  className={`w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-2 md:px-8 max-h-[50vh] md:max-h-none overflow-y-auto no-scrollbar pb-24 md:pb-0 transition-all duration-1000 delay-300 ease-in-out ${isActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                    }`}
                >
                  {slide.reviews.map((rev, rIdx) => (
                    <div
                      key={rIdx}
                      style={{
                        transitionDelay: `${isActive ? 500 + rIdx * 200 : 0}ms`,
                      }}
                      className={`flex flex-col bg-white/10 backdrop-blur-xl border border-white/20 p-5 md:p-8 rounded-3xl text-left shadow-2xl transition-all duration-700 ease-out ${isActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                        }`}
                    >
                      <div className="flex gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className="text-brand-accent fill-brand-accent"
                          />
                        ))}
                      </div>
                      <p className="text-gray-200 text-xs md:text-sm italic mb-4 leading-relaxed flex-grow">
                        "{rev.text}"
                      </p>
                      <p className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest border-t border-white/10 pt-3">
                        - {rev.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`transition-all duration-1000 delay-500 ease-in-out flex flex-col items-center ${isActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                    }`}
                >
                  <p className="text-gray-200 text-sm md:text-lg font-light max-w-2xl mx-auto italic min-h-[1.5em] px-4 mb-6 md:mb-8 drop-shadow-md">
                    {typeof slide.desc === "function"
                      ? slide.desc(language)
                      : slide.desc}
                  </p>
                  <button
                    onClick={() => navigate("menu")}
                    className="mt-2 px-10 py-4 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs md:text-sm font-black tracking-widest text-white uppercase hover:bg-brand-accent hover:border-brand-accent transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
                  >
                    {t(language, "Vezi Meniul", "View Menu")}
                  </button>
                </div>
              )}
            </div>

            {/* PEEK EFFECT PENTRU RECENZII - Varianta curata conform schitei */}
            {idx === 0 && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(1);
                }}
                className={`absolute bottom-[95px] md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-1000 group z-20 ${isActive
                  ? "opacity-70 translate-y-0 hover:opacity-100 hover:-translate-y-1 delay-1000 animate-pulse"
                  : "opacity-0 pointer-events-none translate-y-10"
                  }`}
              >
                {/* Stelele aurii */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-brand-accent fill-brand-accent"
                    />
                  ))}
                </div>

                {/* Text subtil fara fundal de "pastila" */}
                <p className="text-white text-[9px] font-bold tracking-[0.2em] uppercase drop-shadow-md">
                  {t(language, "Citeste Recenziile", "Read Reviews")}
                </p>

                {/* Sageata mica ce indica directia de swipe/click */}
                <ChevronDown
                  size={14}
                  className="text-white mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity"
                />
              </div>
            )}
          </div>
        );
      })}

      <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 md:gap-5 z-20">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-700 ${currentSlide === i
              ? "bg-brand-accent scale-[2.5] shadow-[0_0_15px_#D96C27]"
              : "bg-white/20 hover:bg-white/40"
              }`}
          />
        ))}
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="min-h-screen flex flex-col bg-brand-dark text-white pt-24">
      {/* BARA DE NAVIGARE MENIU - Flex Wrap (Se aseaza automat pe 2-3 randuri fara scroll) */}
      <div className="fixed top-0 md:top-16 left-0 w-full z-40 bg-brand-dark/95 backdrop-blur-xl border-b border-gray-800 shadow-xl py-2.5 px-2">
        <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 max-w-4xl mx-auto">
          {currentCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`py-1.5 px-2.5 md:py-2 md:px-4 text-[9.5px] md:text-xs font-bold uppercase rounded-lg transition-all whitespace-nowrap ${activeMenuCategory === cat.id
                ? "bg-brand-accent/20 text-brand-accent border border-brand-accent/50"
                : "text-gray-400 bg-white/5 border border-transparent hover:bg-white/10 hover:text-white"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow max-w-4xl mx-auto px-6 mt-12 md:mt-24 animate-slide-up-stagger w-full">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 tracking-wide">
            {t(language, "Meniu", "Menu")}
          </h1>
          <p className="text-gray-400 font-light text-lg">
            {t(
              language,
              "Apasa pe preparat pentru ingrediente si nutritie.",
              "Tap on a dish for ingredients and nutrition."
            )}
          </p>

          {(() => {
            const activeFiltersCount = Object.values(dietaryFilters).filter(Boolean).length;
            return (
              <button
                onClick={() => setIsDietaryModalOpen(true)}
                className={`inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full border transition-colors text-sm font-medium tracking-wide shadow-sm ${activeFiltersCount > 0
                  ? "border-brand-accent/50 bg-brand-accent/20 text-brand-accent"
                  : "border-white/10 bg-white/5 hover:bg-white/10 text-white"
                  }`}
              >
                <Utensils size={18} />
                {t(language, "Filtre Dietetice", "Dietary Needs")}
                {activeFiltersCount > 0 && (
                  <span className="ml-1 flex items-center justify-center bg-brand-accent text-white rounded-full w-5 h-5 text-[10px] font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            );
          })()}
        </div>

        {currentCategories.map((category) => {
          // Datele statice
          const staticItems = currentMenuData[category.id] || [];

          // Datele din DB care apartin acestei categorii si NU sunt deja in lista statica (evitam duplicatele)
          const dbItemsForCategory = dbMenuItems.filter(db =>
            db.category === category.id &&
            !staticItems.some(s => s.name === db.name)
          );

          // Functie de normalizare pentru matching robust (fara diacritice, lowercase)
          const normalize = (text: string) =>
            text ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : "";

          // Combinam cele doua liste si sincronizam preturile/stocul
          const items = staticItems.map((s: any) => {
            const sName = normalize(s.name);
            const dbMatch = dbMenuItems.find(d => normalize(d.name) === sName);

            let displayPrice = s.price;
            if (dbMatch) {
              // Daca avem pret in DB, il folosim si adaugam "lei" daca e doar numar
              displayPrice = typeof dbMatch.price === 'number' ? `${dbMatch.price} lei` : dbMatch.price;
            }

            return {
              ...s,
              price: displayPrice,
              available: dbMatch ? dbMatch.available : true
            };
          });

          // Adaugam produsele care sunt DOAR in baza de date (produse noi)
          dbItemsForCategory.forEach((db: any) => {
            if (!items.some(i => normalize(i.name) === normalize(db.name))) {
              items.push({
                name: db.name,
                price: typeof db.price === 'number' ? `${db.price} lei` : db.price,
                available: db.available,
                desc: "",
                image: null
              });
            }
          });

          if (items.length === 0) return null;

          const filteredItems = items.filter((item: any) => {
            // --- FILTRU DISPONIBILITATE BAZA DE DATE ---
            if (item.available === false) return false;

            const textToSearch = `${item.name} ${item.desc || ""} ${item.nutrition?.allergens || ""}`.toLowerCase();

            // Alergie la nuci
            if (dietaryFilters.nut && ["nuci", "fistic", "alune", "arahide", "susan", "migdale", "caju", "nut", "pistachio", "sesame", "peanut", "almond", "cashew"].some(k => textToSearch.includes(k))) return false;

            // Fara Gluten
            if (dietaryFilters.gf && ["gluten", "faina", "lipie", "bagheta", "crutoane", "paste", "spaghete", "paccheri", "tagliatelle", "lasagna", "penne", "rigatoni", "orecchiette", "focaccia", "blat", "pane", "piscoturi", "bere", "flour", "pita", "baguette", "crouton", "pasta", "spaghetti", "dough", "bread", "ladyfinger", "beer"].some(k => textToSearch.includes(k))) return false;

            // Fara Lactoza
            if (dietaryFilters.df && ["lactoza", "lactose", "branza", "cheese", "unt", "butter", "smantana", "cream", "parmezan", "parmesan", "mozzarella", "gorgonzola", "fior di latte", "mascarpone", "iaurt", "yogurt", "cedar", "cheddar", "brie", "telemea", "capra", "goat", "ricotta", "pecorino", "straciatella"].some(k => textToSearch.includes(k))) return false;

            // Detectare Carne (pentru Vegetarian & Vegan)
            const meatKeywords = ["salam", "salami", "prosciutto", "carne", "meat", "pui", "chicken", "peste", "fish", "ton", "tuna", "somon", "salmon", "fructe de mare", "seafood", "bacon", "carnati", "sausage", "sunca", "ham", "vita", "beef", "berbecut", "oaie", "lamb", "sheep", "burger", "angus", "guanciale", "pancetta", "chorizo", "dorada", "pastrav", "mici", "ceafa", "pork", "cotlet", "chop", "antricot", "ribeye", "mortadella", "salsicia", "rata", "duck"];
            const hasMeat = meatKeywords.some(k => textToSearch.includes(k));

            if (dietaryFilters.vegetarian && hasMeat) return false;

            if (dietaryFilters.vegan) {
              if (hasMeat) return false;
              if (["lactoza", "lactose", "branza", "cheese", "unt", "butter", "smantana", "cream", "parmezan", "parmesan", "mozzarella", "gorgonzola", "fior di latte", "mascarpone", "iaurt", "yogurt", "cedar", "cheddar", "brie", "telemea", "capra", "goat", "oua", "ou", "egg", "miere", "honey", "pecorino", "ricotta", "straciatella"].some(k => textToSearch.includes(k))) return false;
            }

            return true;
          });

          if (filteredItems.length === 0) return null;

          return (
            <div
              key={category.id}
              id={`cat-${category.id}`}
              className="mb-20 pt-8 border-t border-gray-800"
            >
              <h2 className="text-3xl md:text-5xl font-serif text-brand-accent mb-10 tracking-wide">
                {category.name}
              </h2>

              <div>
                {filteredItems.map((item: any, idx: number) => (
                  <MenuItemCard
                    key={item.name}
                    item={item}
                    index={idx}
                    lang={language}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <LegalFooter lang={language} theme="dark" />
    </div>
  );

  const renderFormPage = (title: string, subtitle: string, fields: any[], actionText: string) => (
    <div className="min-h-screen flex flex-col bg-brand-bg pt-24 text-brand-textMain animate-slide-up-stagger overflow-x-hidden md:pt-32">
      <div className="flex-grow max-w-3xl mx-auto px-6 text-center w-full">
        <h1 className="font-serif text-5xl mb-4 text-brand-dark">{title}</h1>
        <p className="text-brand-textMuted mb-12">{subtitle}</p>
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-brand-border shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-left mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {fields.map((field, idx) => (
              <div
                key={idx}
                className={field.full ? "col-span-1 md:col-span-2" : ""}
              >
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 focus:outline-none focus:border-brand-accent transition-colors"
                  ></textarea>
                ) : field.type === "select" ? (
                  <select className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 focus:outline-none focus:border-brand-accent transition-colors">
                    {field.options.map((opt, i) => (
                      <option key={i}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 focus:outline-none focus:border-brand-accent transition-colors"
                  />
                )}
              </div>
            ))}
          </div>
          <button className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-accent transition-all duration-300 shadow-lg">
            {actionText}
          </button>
        </div>
      </div>
      <LegalFooter lang={language} theme="light" />
    </div>
  );

  const renderBook = () =>
    renderFormPage(
      t(language, "Rezerva o Masa", "Book a Table"),
      t(
        language,
        "Selectati detaliile pentru a va asigura locul perfect.",
        "Select the details to secure your perfect spot."
      ),
      [
        { label: t(language, "Nume Complet", "Full Name"), type: "text" },
        { label: t(language, "Telefon", "Phone"), type: "tel" },
        { label: t(language, "Data", "Date"), type: "date" },
        { label: t(language, "Ora", "Time"), type: "time" },
        {
          label: t(language, "Persoane", "People"),
          type: "select",
          options: ["2", "3", "4", "5", "6+"],
        },
      ],
      t(language, "Confirma Rezervarea", "Confirm Reservation")
    );

  const renderEvents = () =>
    renderFormPage(
      t(language, "Evenimente Private", "Private Events"),
      t(
        language,
        "Transformam Gradina Floreasca in spatiul tau exclusivist.",
        "We transform Gradina Floreasca into your exclusive space."
      ),
      [
        { label: t(language, "Tip Eveniment", "Event Type"), type: "text" },
        { label: t(language, "Telefon", "Phone"), type: "tel" },
        {
          label: t(language, "Nr. Persoane", "Number of People"),
          type: "select",
          options: ["10-25", "25-50", "50-100", "100+"],
        },
        {
          label: t(language, "Data Estimativa", "Estimated Date"),
          type: "date",
        },
        {
          label: t(language, "Cerinte Speciale", "Special Requests"),
          type: "textarea",
          full: true,
        },
      ],
      t(language, "Cere Oferta", "Request Quote")
    );

  const renderJobs = () =>
    renderFormPage(
      t(language, "Alatura-te Echipei", "Join the Team"),
      t(
        language,
        "Cautam pasiune si dedicare pentru a oferi servicii de top.",
        "We are looking for passion and dedication to provide top-tier services."
      ),
      [
        { label: t(language, "Nume Complet", "Full Name"), type: "text" },
        { label: t(language, "Telefon", "Phone"), type: "tel" },
        {
          label: t(language, "Post Dorit", "Desired Position"),
          type: "select",
          options: [
            t(language, "Ospatar", "Waiter"),
            t(language, "Bucatar", "Chef"),
            t(language, "Barman", "Bartender"),
            "Hostess",
          ],
          full: true,
        },
        {
          label: t(language, "Scurta Experienta", "Short Experience"),
          type: "textarea",
          full: true,
        },
      ],
      t(language, "Aplica Acum", "Apply Now")
    );

  const renderContact = () => (
    <div className="min-h-screen flex flex-col bg-brand-bg pt-24 md:pt-32 text-brand-textMain animate-slide-up-stagger overflow-x-hidden">
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 text-center w-full">
          <h1 className="font-serif text-5xl mb-4 text-brand-dark">
            {t(language, "Contact & Locatie", "Contact & Location")}
          </h1>
          <p className="text-brand-textMuted mb-12">
            Global salads, handhelds & mains presented in a stylish alfresco cafe in a park, set around a pool.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-3xl border border-brand-border shadow-sm flex flex-col items-center hover:border-brand-accent transition-colors">
              <MapPin size={32} className="text-brand-accent mb-4" />
              <h3 className="font-bold mb-2 text-brand-dark">
                {t(language, "Adresa", "Address")}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Bulevardul Mircea Eliade 16<br />014192 Bucuresti
              </p>
              <a
                href="https://maps.app.goo.gl/kX7PqjZ8Z2Z2Z2Z28"
                target="_blank"
                rel="noreferrer"
                className="mt-auto px-6 py-2 bg-brand-dark text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-colors shadow-lg"
              >
                {t(language, "Navigheaza", "Navigate")}
              </a>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-brand-border shadow-sm flex flex-col items-center hover:border-brand-accent transition-colors">
              <Phone size={32} className="text-brand-accent mb-4" />
              <h3 className="font-bold mb-2 text-brand-dark">
                {t(language, "Telefon", "Phone")}
              </h3>
              <a href="tel:+40755085967" className="text-gray-500 text-sm hover:text-brand-accent">
                0755 085 967
              </a>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-brand-border shadow-sm flex flex-col items-center hover:border-brand-accent transition-colors">
              <Clock size={32} className="text-brand-accent mb-4" />
              <h3 className="font-bold mb-2 text-brand-dark">
                {t(language, "Program", "Hours")}
              </h3>
              <p className="text-gray-500 text-sm">
                {t(language, "Zilnic: 10:00 - 23:30", "Daily: 10:00 - 23:30")}
              </p>
            </div>
          </div>

          <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-brand-border shadow-inner mb-20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2847.533256515286!2d26.096775676648756!3d44.46328390035071!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1f8666579f19b%3A0x6b3b555555555555!2sGr%C4%83dina%20Floreasca!5e0!3m2!1sro!2sro!4v1714233000000!5m2!1sro!2sro"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <LegalFooter lang={language} theme="light" />
    </div>
  );

  const renderPopoverMenu = () => {
    const mainItems = [
      {
        id: "menu",
        label: t(language, "Meniu Restaurant", "Restaurant Menu"),
        icon: <Utensils size={18} />,
      },
      {
        id: "book",
        label: t(language, "Rezerva Masa", "Book a Table"),
        icon: <CalendarCheck size={18} />,
      },
      {
        id: "events",
        label: t(language, "Evenimente Private", "Private Events"),
        icon: <CalendarHeart size={18} />,
      },
    ];
    const secondaryItems = [
      {
        id: "contact",
        label: t(language, "Contact & Locatie", "Contact & Location"),
        icon: <MapPin size={18} />,
      },
      {
        id: "home",
        label: t(language, "Acasa", "Home"),
        icon: <Home size={18} />,
      },
      {
        id: "jobs",
        label: t(language, "Cariere", "Careers"),
        icon: <Briefcase size={18} />,
      },
    ];

    return (
      <div
        ref={menuRef}
        className={`absolute bottom-full left-0 mb-4 w-[280px] sm:w-72 bg-brand-dark text-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] transform origin-bottom-left ${isMenuOpen
          ? "scale-100 opacity-100 translate-y-0"
          : "scale-95 opacity-0 translate-y-4 pointer-events-none"
          }`}
      >
        <div className="py-3 px-3">
          {mainItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors group ${activeView === item.id
                ? "bg-brand-accent/10 text-brand-accent"
                : "hover:bg-white/5"
                }`}
            >
              <span
                className={`${activeView === item.id
                  ? "text-brand-accent"
                  : "text-gray-400 group-hover:text-white"
                  } transition-colors`}
              >
                {item.icon}
              </span>
              <span className="text-sm font-semibold tracking-wide">
                {item.label}
              </span>
            </button>
          ))}

          <div className="flex items-center gap-2 px-8 my-4 opacity-30">
            <div className="h-px flex-1 bg-white"></div>
            <div className="w-1.5 h-1.5 rotate-45 bg-white"></div>
            <div className="h-px flex-1 bg-white"></div>
          </div>

          <div className="px-1">
            {secondaryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors group ${activeView === item.id
                  ? "text-brand-accent"
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <span className="transition-colors">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-6 pb-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-brand-accent transition-colors"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-brand-accent transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a
              href="mailto:contact@gradinafloreasca.ro"
              className="text-gray-300 hover:text-brand-accent transition-colors"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full relative font-sans selection:bg-brand-accent selection:text-white">
      {/* DESKTOP NAVBAR */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10 px-8 py-4 items-center transition-all">
        <div className="flex-1">
          <div
            className="text-white font-serif text-2xl tracking-widest cursor-pointer hover:text-brand-accent transition-colors inline-block"
            onClick={() => navigate("home")}
          >
            Gradina Floreasca
          </div>
        </div>
        <div className="flex items-center gap-8">
          {[
            { id: "menu", label: t(language, "Meniu", "Menu") },
            { id: "book", label: t(language, "Rezervari", "Booking") },
            { id: "events", label: t(language, "Evenimente", "Events") },
            { id: "jobs", label: t(language, "Cariere", "Careers") },
            { id: "contact", label: t(language, "Contact", "Contact") },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${activeView === item.id
                ? "text-brand-accent"
                : "text-gray-300 hover:text-white"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex-1 flex justify-end">
          <button
            onClick={() => setLanguage(language === "RO" ? "EN" : "RO")}
            className="text-[10px] font-black text-white px-3 py-1.5 border border-white/20 rounded-full hover:bg-white/10 transition-colors"
          >
            {language}
          </button>
        </div>
      </nav>

      {/* PRELOADER */}
      <div
        className={`fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center transition-transform duration-[1s] ease-[cubic-bezier(0.85,0,0.15,1)] ${isPreloading ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="relative flex flex-col items-center w-fit max-w-full px-6">
          <h1 className="font-serif text-3xl md:text-5xl text-white tracking-[0.1em] md:tracking-[0.3em] text-center uppercase opacity-0 animate-[fadeInText_1s_0.2s_forwards]">
            Gradina Floreasca
          </h1>
          <div className="h-[2px] bg-brand-accent mt-6 w-0 animate-[expandLine_0.8s_1s_forwards]"></div>
        </div>
      </div>

      <main
        className={`w-full ${activeView === "home" ? "h-screen h-[100dvh]" : "min-h-screen min-h-[100dvh]"
          } bg-brand-dark flex flex-col`}
      >
        {activeView === "home" && renderHome()}
        {activeView === "menu" && renderMenu()}
        {activeView === "book" && renderBook()}
        {activeView === "events" && renderEvents()}
        {activeView === "contact" && renderContact()}
        {activeView === "jobs" && renderJobs()}
      </main>

      {/* MOBILE PILL NAVIGATION */}
      <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-auto min-w-[340px] max-w-[95%]">
        <div className="relative">{renderPopoverMenu()}</div>

        <div className="backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-full px-2 py-2 flex items-center justify-between transition-all duration-300 border bg-brand-dark/95 border-gray-700">
          <div className="flex items-center gap-1 sm:gap-3 pl-2 border-r border-gray-700 pr-3 sm:pr-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${isMenuOpen
                ? "bg-white text-brand-dark"
                : "text-white hover:bg-white/10"
                }`}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLanguage(language === "RO" ? "EN" : "RO");
              }}
              className="flex items-center gap-1 text-[10px] font-black px-3 py-2 rounded-full transition-colors border text-white bg-white/10 border-white/20 hover:bg-white/20"
            >
              {language}
            </button>
          </div>

          <div className="flex items-center pl-3 sm:pl-4 pr-1 gap-2">
            <button
              onClick={() => navigate("menu")}
              className={`px-5 py-3 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors whitespace-nowrap ${activeView === "menu"
                ? "bg-brand-accent/10 text-brand-accent"
                : "text-white hover:bg-white/10"
                }`}
            >
              {t(language, "Meniu", "Menu")}
            </button>
            <button
              onClick={() => navigate("book")}
              className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg transition-all whitespace-nowrap ${isReservationOpen
                ? "bg-brand-accent text-white shadow-brand-accent/30"
                : "bg-white text-brand-dark hover:bg-gray-200"
                }`}
            >
              {t(language, "Rezerva", "Book")}
            </button>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInText { from { opacity: 0; transform: translateY(15px); letter-spacing: 0.1em; } to { opacity: 1; transform: translateY(0); letter-spacing: 0.3em; } }
        @keyframes expandLine { from { width: 0; opacity: 0; } to { width: 100%; opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes slideUpStagger { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up-stagger { opacity: 0; animation: slideUpStagger 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        body { background: #0F1318; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        lang={language}
      />

      <DietaryFilterModal
        isOpen={isDietaryModalOpen}
        onClose={() => setIsDietaryModalOpen(false)}
        lang={language}
        currentFilters={dietaryFilters}
        onApplyFilters={setDietaryFilters}
      />
    </div>
  );
}
