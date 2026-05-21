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
  Heart,
  Baby,
  ArrowDown,
} from "lucide-react";
import confetti from "canvas-confetti";



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

  // --- STATE-URI PENTRU CALCULATOR EVENIMENTE ---
  const [calculatorStep, setCalculatorStep] = useState(1);
  const [eventType, setEventType] = useState("wedding");
  const [guestCount, setGuestCount] = useState(100);
  const [selectedPackages, setSelectedPackages] = useState<string[]>(["menu", "bar"]);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [calcStatus, setCalcStatus] = useState<"idle" | "loading" | "success">("idle");

  // --- STATE-URI PENTRU BROȘURĂ (LOOKBOOK) ---
  const [lookbookName, setLookbookName] = useState("");
  const [lookbookEmail, setLookbookEmail] = useState("");
  const [lookbookPhone, setLookbookPhone] = useState("");
  const [lookbookStatus, setLookbookStatus] = useState<"idle" | "loading" | "success">("idle");

  // --- STATE-URI PENTRU GALERII FOTO SALOANE ---
  const [showSalon1Gallery, setShowSalon1Gallery] = useState(false);
  const [showSalon2Gallery, setShowSalon2Gallery] = useState(false);
  const [activePoolRule, setActivePoolRule] = useState<number | null>(null);
  const [activeEventFilter, setActiveEventFilter] = useState("all");
  const [newsletterPopup, setNewsletterPopup] = useState<{ isOpen: boolean; type: "pool" | "salons" | "events" | null; email: string; isSubmitted: boolean }>({ isOpen: false, type: null, email: "", isSubmitted: false });

  // --- STATE-URI PENTRU RSVP EVENIMENTE ---
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpEvent, setRsvpEvent] = useState("film");
  const [rsvpGuests, setRsvpGuests] = useState("2");
  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "loading" | "success">("idle");

  const playSuccessSound = () => {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const playTone = (freq: number, startTime: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + dur);
      };
      const now = ctx.currentTime;
      playTone(1200, now, 0.15);
      playTone(1600, now + 0.12, 0.3);
    } catch (e) {
      console.error(e);
    }
  };

  const getCalculatedPrice = () => {
    let pricePerPax = 0;
    if (selectedPackages.includes("menu")) pricePerPax += 85;
    if (selectedPackages.includes("bar")) pricePerPax += 43;
    if (selectedPackages.includes("addons")) pricePerPax += 15;
    return guestCount * pricePerPax;
  };

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
      image: "/download (2).png",
      type: "hero",
    },
    {
      title: (lang: string) => t(lang, "PARERILE OASPETILOR", "GUEST REVIEWS"),
      subtitle: (lang: string) =>
        t(lang, "4.5/5 DIN 2700+ RECENZII", "4.5/5 FROM 2700+ REVIEWS"),
      image: "/download (4).png",
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
      image: "/download (5).png",
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
      image: "/download (3).png",
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

  // --- NEWSLETTER DYNAMIC TIMER POPUP ---
  useEffect(() => {
    if (activeView === "pool" || activeView === "salons" || activeView === "events") {
      const hasSubscribed = sessionStorage.getItem(`subscribed_${activeView}`);
      const hasClosed = sessionStorage.getItem(`closed_${activeView}`);
      if (hasSubscribed || hasClosed) return;

      const timer = setTimeout(() => {
        setNewsletterPopup({
          isOpen: true,
          type: activeView as "pool" | "salons" | "events",
          email: "",
          isSubmitted: false
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeView]);

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
              alt="Slide Grădina Floreasca"
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

  const renderEvents = () => {
    const eventsData = [
      {
        id: "cinema",
        day: "Miercuri",
        dayEn: "Wednesday",
        time: "21:00",
        title: t(language, "Seri de Film sub Stele: Star Wars", "Movie Nights Under the Stars: Star Wars"),
        subtitle: t(language, "Star Wars: The Force Awakens • Ecran Uriaș", "Star Wars: The Force Awakens • Giant Screen"),
        description: t(
          language,
          "Transformăm vizionarea unui film într-o experiență cinematică absolută. Miercurea aceasta proiectăm legendarul 'Star Wars: The Force Awakens'. Bucură-te de o seară intergalactică într-un cadru natural spectaculos, sub un baldachin de stele.",
          "We transform movie watching into an absolute cinematic experience. This Wednesday we project the legendary 'Star Wars: The Force Awakens'. Enjoy an intergalactic evening in a spectacular natural setting, under a canopy of stars."
        ),
        details: t(
          language,
          "Biletul de acces include popcorn cald cu trufe, un cocktail tematic premium sau un pahar de prosecco din partea casei și acces complet la zona de lounge.",
          "Access ticket includes hot truffle popcorn, a premium themed cocktail or a complimentary glass of prosecco, and full access to the lounge area."
        ),
        price: "75 RON",
        slots: t(language, "Doar 12 din 150 de șezlonguri rămase", "Only 12 out of 150 loungers left"),
        badge: t(language, "Săptămânal", "Weekly"),
        tag: "cinema",
        image: "/cinema-stele.jpg"
      },
      {
        id: "dj",
        day: "Vineri & Sâmbătă",
        dayEn: "Friday & Saturday",
        time: "18:00",
        title: "Sunset DJ Sessions: DJ Sahar",
        subtitle: t(language, "Special Guest: DJ Sahar • Afro & Deep House", "Special Guest: DJ Sahar • Afro & Deep House"),
        description: t(
          language,
          "Pe măsură ce soarele apune și aruncă reflexii aurii pe suprafața piscinei, te invităm la o călătorie muzicală ghidată de renumitul DJ Sahar. Ritmuri sofisticate de Deep și Organic House dictate de la pupitru.",
          "As the sun sets and casts golden reflections on the pool surface, we invite you to a musical journey guided by the renowned DJ Sahar. Sophisticated Deep and Organic House rhythms dictated from the deck."
        ),
        details: t(
          language,
          "DJ Sahar rezident la pupitru, cocktailuri de specialitate infuzate cu ierburi aromatice proaspete, plus un spectacol inedit de lumini subacvatice.",
          "DJ Sahar resident at the deck, specialty cocktails infused with fresh aromatic herbs, plus a unique underwater light show."
        ),
        price: t(language, "Intrare Liberă • RSVP Obligatoriu", "Free Entry • RSVP Required"),
        slots: t(language, "Rezervare masă recomandată", "Table reservation recommended"),
        badge: t(language, "Hot", "Hot"),
        tag: "party",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "yoga",
        day: "Duminică",
        dayEn: "Sunday",
        time: "09:00",
        title: "Morning Yoga & Mindfulness: Vinyasa Flow",
        subtitle: t(language, "Sesiune Vinyasa Flow cu Andreea Alina", "Vinyasa Flow Session with Andreea Alina"),
        description: t(
          language,
          "Găsește-ți armonia interioară în oaza noastră verde. Instructorul nostru de elită, Andreea Alina, te va ghida printr-o sesiune revigorantă de Vinyasa Flow, potrivită atât pentru începători, cât și pentru avansați.",
          "Find your inner harmony in our green oasis. Our elite instructor, Andreea Alina, will guide you through a revitalizing Vinyasa Flow session, suitable for both beginners and advanced practitioners."
        ),
        details: t(
          language,
          "Include sesiune ghidată de 60 min cu Andreea Alina, covoraș de yoga asigurat, prosop revigorant, plus un brunch delicios compus din smoothie bowls.",
          "Includes 60-minute guided session with Andreea Alina, yoga mat provided, refreshing towel, plus a delicious brunch consisting of smoothie bowls."
        ),
        price: "120 RON",
        slots: t(language, "Doar 6 locuri rămase", "Only 6 spots left"),
        badge: t(language, "Wellness", "Wellness"),
        tag: "wellness",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80"
      }
    ];

    const filteredEvents = activeEventFilter === "all"
      ? eventsData
      : eventsData.filter(e => e.tag === activeEventFilter);

    return (
      <div className="min-h-screen bg-brand-dark text-white antialiased overflow-x-hidden animate-fade-in font-sans">
        {/* Cinematic Premium Hero */}
        <header className="relative w-full h-[65vh] min-h-[500px] flex flex-col justify-center px-6 md:px-20 pt-24 md:pt-32 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 z-0">
            <img
              alt="Cinematic Hero Image"
              className="w-full h-full object-cover opacity-60 scale-100"
              src="/film.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/20 px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-accent">
                {t(language, "Evenimente Exclusive", "Exclusive Events")}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-7xl text-white mb-6 leading-tight font-normal">
              {t(language, "Colecția de Experiențe", "The Collection of Experiences")}
              <br />
              <span className="italic text-brand-accent">
                {t(language, "Săptămânale", "Weekly")}
              </span>
            </h1>
            <p className="font-sans text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              {t(
                language,
                "Redefinim evadarea urbană printr-o selecție curată de momente multisenzoriale. De la zorii liniștiți de yoga la seri de film captivante și DJ Sessions vibrante.",
                "We redefine the urban escape through a curated selection of multisensory moments. From quiet yoga mornings to captivating movie nights and vibrant DJ Sessions."
              )}
            </p>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* Experiențe Curate — Bento Grid                              */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section className="py-12 md:py-24 px-6 md:px-20 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-[48px] text-white leading-tight mb-4 font-normal">
                {t(language, "Experiențe", "Curated")}{" "}
                <span className="italic text-brand-accent">{t(language, "Curate", "Experiences")}</span>
              </h2>
              <span className="w-24 h-px bg-brand-accent mx-auto block"></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ gridAutoRows: "300px" }}>
              {/* Cinema Image — Large (2 cols, 2 rows) */}
              <div className="lg:col-span-2 lg:row-span-2 relative rounded-3xl overflow-hidden group">
                <img alt={t(language, "Cinema sub Stele", "Cinema under Stars")} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" src="/cinema-stele.jpg" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[12px] bg-brand-accent text-brand-dark px-3 py-1 rounded-full uppercase tracking-widest font-bold">{t(language, "Miercuri, 21:00", "Wednesday, 21:00")}</span>
                  </div>
                  <h3 className="font-serif text-3xl md:text-[40px] text-white leading-tight mb-3 font-normal">Cinema <span className="italic text-brand-accent">sub Stele</span></h3>
                  <p className="font-sans text-sm md:text-base text-gray-300 max-w-lg mb-6 font-light leading-relaxed">
                    {t(language, "O experiență cinematică absolută în confortul șezlongurilor noastre premium, sub un baldachin de stele și lumini ambientale calde.", "An absolute cinematic experience in the comfort of our premium loungers, under a canopy of stars and warm ambient lights.")}
                  </p>
                  <button onClick={() => { setRsvpEvent("film"); setIsRsvpOpen(true); }} className="w-max flex items-center gap-2 text-brand-accent font-sans text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                    <span>{t(language, "Rezervă Acum", "Book Now")}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Text Cell 1 — Weekly Summer Events (Large, 2 cols, 1 row) */}
              <div className="lg:col-span-2 lg:row-span-1 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col justify-center items-start">
                <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent mb-4"><CalendarHeart size={22} /></div>
                <h3 className="font-serif text-2xl md:text-[28px] text-white mb-2 font-normal">{t(language, "Evenimente", "Weekly Events")}{" "}<span className="italic text-brand-accent">{t(language, "de Vară", "Summer")}</span></h3>
                <p className="font-sans text-sm md:text-base text-gray-400 font-light leading-relaxed">
                  {t(language, "Pe parcursul întregii veri, Grădina Floreasca susține un calendar vibrant de evenimente săptămânale. De la proiecții de film sub stele miercurea, la sesiuni DJ la apus în weekend și yoga revigorantă duminica — fiecare săptămână aduce o experiență nouă.", "Throughout the entire summer, Grădina Floreasca hosts a vibrant calendar of weekly events. From movie screenings under the stars on Wednesdays, to sunset DJ sessions on weekends and refreshing yoga on Sundays — each week brings a new experience.")}
                </p>
              </div>

              {/* DJ Image — Tall (1 col, 2 rows) */}
              <div className="lg:col-span-1 lg:row-span-2 relative rounded-3xl overflow-hidden group">
                <img alt="Sunset DJ Sessions" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" src={eventsData[1]?.image || ""} />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="font-mono text-[10px] bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full uppercase tracking-widest w-max mb-3">{t(language, "Vin & Sâm", "Fri & Sat")}</span>
                  <h3 className="font-serif text-xl md:text-[24px] text-white leading-tight mb-4 font-normal">Sunset DJ <span className="italic text-brand-accent">Sessions</span></h3>
                  <button onClick={() => { setRsvpEvent("dj"); setIsRsvpOpen(true); }} className="w-10 h-10 rounded-full bg-brand-accent text-brand-dark flex items-center justify-center hover:scale-110 transition-transform">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              {/* Yoga Image — Tall (1 col, 2 rows) */}
              <div className="lg:col-span-1 lg:row-span-2 relative rounded-3xl overflow-hidden group">
                <img alt="Yoga & Mindfulness" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" src={eventsData[2]?.image || ""} />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="font-mono text-[10px] bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full uppercase tracking-widest w-max mb-3">{t(language, "Dum, 09:00", "Sun, 09:00")}</span>
                  <h3 className="font-serif text-xl md:text-[24px] text-white leading-tight mb-4 font-normal">Yoga & <span className="italic text-brand-accent">Mindfulness</span></h3>
                  <button onClick={() => { setRsvpEvent("yoga"); setIsRsvpOpen(true); }} className="w-10 h-10 rounded-full bg-brand-accent text-brand-dark flex items-center justify-center hover:scale-110 transition-transform">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              {/* Text Cell 2 — "O Evadare Revigorantă" (Small, 1 col, 1 row) */}
              <div className="lg:col-span-1 lg:row-span-1 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col justify-center items-start">
                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent mb-3"><Sparkles size={18} /></div>
                <h3 className="font-serif text-lg text-white mb-2 font-normal">
                  {t(language, "O Evadare", "An Escape")}{" "}
                  <span className="italic text-brand-accent">{t(language, "Revigorantă", "Refreshing")}</span>
                </h3>
                <p className="font-sans text-[12px] text-gray-400 font-light leading-relaxed line-clamp-4">
                  {t(language, "Grădina Floreasca organizează săptămânal evenimente exclusiviste într-un cadru natural de vis. O evadare revigorantă sub cerul liber.", "Grădina Floreasca organizes weekly exclusive events in a dreamy natural setting. A refreshing escape under the open sky.")}
                </p>
              </div>

              {/* Text Cell 3 — "Filme noi în fiecare săptămână" */}
              <div className="lg:col-span-1 lg:row-span-1 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col justify-center items-start">
                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent mb-3"><Moon size={18} /></div>
                <h3 className="font-serif text-lg text-white mb-2 font-normal">{t(language, "Filme noi", "New movies")}{" "}<span className="italic text-brand-accent">{t(language, "săptămânal", "weekly")}</span></h3>
                <p className="font-sans text-[12px] text-gray-400 font-light leading-relaxed line-clamp-4">
                  {t(language, "Descoperă selecția noastră curată de capodopere cinematografice, clasice și contemporane.", "Discover our curated selection of cinematic masterpieces, classic and contemporary.")}
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* ══════════════════════════════════════════════════════════════ */}
        {/* Evenimentele Actuale — Delimiter Section                     */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section className="pt-24 pb-8 px-6 md:px-20 relative border-t border-white/5 bg-black/10">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight mb-4 font-normal">
              {t(language, "Evenimentele", "Current")}{" "}
              <span className="italic text-brand-accent">{t(language, "Actuale", "Events")}</span>
            </h2>
            <p className="font-sans text-xs md:text-sm text-gray-400 uppercase tracking-widest max-w-md mx-auto font-light">
              {t(language, "Calendarul complet al experiențelor din această perioadă", "The complete calendar of current experiences")}
            </p>
            <span className="w-16 h-[1.5px] bg-brand-accent mx-auto mt-6 block"></span>
          </div>
        </section>

        {/* Dynamic Event Showcase Section - NO HEAVY OVERLAYS, Crisp HD image cards */}
        <section className="py-24 px-6 md:px-20 max-w-[1440px] mx-auto">
          <div className="flex flex-col gap-24">
            {filteredEvents.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={item.id}
                  className={`flex flex-col lg:flex-row items-stretch gap-12 lg:gap-20 transition-all duration-500`}
                >
                  {/* High Quality Unblurred Cover */}
                  <div className={`w-full lg:w-1/2 relative min-h-[400px] lg:min-h-[550px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group ${isEven ? "lg:order-1" : "lg:order-2"
                    }`}>
                    <img
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                      src={item.image}
                    />
                    {/* Subtle top left styling badge */}
                    <div className="absolute top-6 left-6 z-10">
                      <span className="bg-brand-accent text-brand-dark font-sans text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  {/* Informational Promo content */}
                  <div className={`w-full lg:w-1/2 flex flex-col justify-center gap-6 ${isEven ? "lg:order-2" : "lg:order-1"
                    }`}>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-[1.5px] bg-brand-accent"></span>
                      <span className="font-sans text-xs text-brand-accent uppercase tracking-widest font-bold">
                        {language === "RO" ? item.day : item.dayEn} • {item.time}
                      </span>
                    </div>

                    <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight font-normal">
                      {item.title}
                    </h2>

                    <p className="text-brand-accent font-sans text-sm tracking-wider uppercase font-medium">
                      {item.subtitle}
                    </p>

                    <p className="font-sans text-base text-gray-300 font-light leading-relaxed">
                      {item.description}
                    </p>

                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
                      <p className="font-sans text-xs text-gray-400 leading-relaxed italic">
                        {item.details}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                          <span className="text-[11px] text-red-400 font-bold uppercase tracking-wider">
                            {item.slots}
                          </span>
                        </div>
                        <span className="text-white font-sans text-sm font-bold bg-white/5 px-3 py-1 rounded-md border border-white/10">
                          {item.price}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (item.tag === "cinema") setRsvpEvent("film");
                        else if (item.tag === "party") setRsvpEvent("dj");
                        else if (item.tag === "wellness") setRsvpEvent("yoga");
                        setIsRsvpOpen(true);
                      }}
                      className="w-full md:w-max px-8 py-4 bg-brand-accent hover:bg-brand-accentHover text-brand-dark rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-brand-accent/20"
                    >
                      {t(language, "Rezervă Acum Locul", "Book Your Spot Now")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Promotional VIP Package tiers - HIGH CONVERSION */}
        <section className="py-24 px-6 md:px-20 bg-black/30 border-t border-white/5">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-16">
              <span className="font-sans text-[10px] text-brand-accent uppercase tracking-[0.2em] font-bold mb-3 block">
                {t(language, "Pachete Experiențe", "Experience Packages")}
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-white font-normal">
                {t(language, "Alege Nivelul tău de Răsfăț", "Choose Your Level of Indulgence")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Package 1 */}
              <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-brand-accent/20 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl text-white mb-2">Cinema Silver Lounge</h3>
                  <div className="text-2xl font-sans text-brand-accent font-bold mb-4">75 RON <span className="text-xs text-gray-500">/ {t(language, "persoană", "person")}</span></div>
                  <ul className="text-xs text-gray-400 space-y-3 mb-8">
                    <li className="flex items-center gap-2">✓ {t(language, "Șezlong premium asigurat", "Premium lounger")}</li>
                    <li className="flex items-center gap-2">✓ {t(language, "Popcorn cald premium", "Hot premium popcorn")}</li>
                    <li className="flex items-center gap-2">✓ {t(language, "Un pahar de Prosecco", "One glass of Prosecco")}</li>
                  </ul>
                </div>
                <button
                  onClick={() => { setRsvpEvent("film"); setIsRsvpOpen(true); }}
                  className="w-full py-3 bg-transparent border border-white/20 hover:border-brand-accent text-white hover:text-brand-dark hover:bg-brand-accent rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
                >
                  {t(language, "Rezervă Miercuri", "Book Wednesday")}
                </button>
              </div>

              {/* Package 2 - Best Seller / Featured */}
              <div className="p-8 rounded-2xl bg-brand-accent/5 border-2 border-brand-accent/30 hover:border-brand-accent/60 transition-all duration-300 flex flex-col justify-between relative transform lg:-translate-y-2">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-accent text-brand-dark text-[9px] uppercase tracking-widest font-black px-4 py-1 rounded-full shadow-md">
                  {t(language, "Cel mai Popular", "Most Popular")}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-white mb-2">Sunset VIP Cabana</h3>
                  <div className="text-2xl font-sans text-brand-accent font-bold mb-4">400 RON <span className="text-xs text-gray-500">/ {t(language, "masă (4 pers)", "table (4 pax)")}</span></div>
                  <ul className="text-xs text-gray-400 space-y-3 mb-8">
                    <li className="flex items-center gap-2">✓ {t(language, "Baldachin privat lângă piscină", "Private poolside cabana")}</li>
                    <li className="flex items-center gap-2">✓ {t(language, "Platou exotic de fructe calde", "Exotic warm fruit platter")}</li>
                    <li className="flex items-center gap-2">✓ {t(language, "O sticlă de vin premium", "Bottle of premium wine")}</li>
                    <li className="flex items-center gap-2">✓ {t(language, "Serviciu VIP concierge dedicat", "VIP dedicated concierge")}</li>
                  </ul>
                </div>
                <button
                  onClick={() => { setRsvpEvent("dj"); setIsRsvpOpen(true); }}
                  className="w-full py-3 bg-brand-accent hover:bg-brand-accentHover text-brand-dark rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-md"
                >
                  {t(language, "Rezervă Weekend", "Book Weekend")}
                </button>
              </div>

              {/* Package 3 */}
              <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-brand-accent/20 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl text-white mb-2">Yoga & Healthy Brunch</h3>
                  <div className="text-2xl font-sans text-brand-accent font-bold mb-4">120 RON <span className="text-xs text-gray-500">/ {t(language, "persoană", "person")}</span></div>
                  <ul className="text-xs text-gray-400 space-y-3 mb-8">
                    <li className="flex items-center gap-2">✓ {t(language, "Sesiune Yoga cu instructor de elită", "Yoga session with elite coach")}</li>
                    <li className="flex items-center gap-2">✓ {t(language, "Smoothie Bowl & Suc Cold-Pressed", "Smoothie Bowl & Cold-Pressed Juice")}</li>
                    <li className="flex items-center gap-2">✓ {t(language, "Covoraș & prosop asigurat", "Yoga mat & towel provided")}</li>
                  </ul>
                </div>
                <button
                  onClick={() => { setRsvpEvent("yoga"); setIsRsvpOpen(true); }}
                  className="w-full py-3 bg-transparent border border-white/20 hover:border-brand-accent text-white hover:text-brand-dark hover:bg-brand-accent rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
                >
                  {t(language, "Rezervă Duminică", "Book Sunday")}
                </button>
              </div>
            </div>
          </div>
        </section>

        <LegalFooter lang={language} theme="dark" />
      </div>
    );
  };

  // --- NEWSLETTER DYNAMIC TIMER POPUP RENDERER ---
  const renderNewsletterPopup = () => {
    if (!newsletterPopup.isOpen || !newsletterPopup.type) return null;

    const handleClose = () => {
      sessionStorage.setItem(`closed_${newsletterPopup.type}`, "true");
      setNewsletterPopup(prev => ({ ...prev, isOpen: false }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newsletterPopup.email || !newsletterPopup.email.includes("@")) return;
      sessionStorage.setItem(`subscribed_${newsletterPopup.type}`, "true");
      setNewsletterPopup(prev => ({ ...prev, isSubmitted: true }));
      playSuccessSound();
      setTimeout(() => {
        setNewsletterPopup(prev => ({ ...prev, isOpen: false, isSubmitted: false }));
      }, 3000);
    };

    let details = {
      badge: t(language, "OFERTĂ EXCLUSIVĂ", "EXCLUSIVE OFFER"),
      title: "",
      subtitle: "",
      desc: "",
      btnText: ""
    };

    if (newsletterPopup.type === "events") {
      details = {
        badge: t(language, "⚡ ACCES PRIORITY", "⚡ PRIORITY ACCESS"),
        title: t(language, "Stai la curent cu Experiențele Săptămânale", "Stay updated with Weekly Experiences"),
        subtitle: t(language, "Invitații Private & Acces Prioritar cu 48h înainte", "Private Invitations & 48h Priority Access"),
        desc: t(
          language,
          "Alătură-te clubului nostru privat. Fii primul care primește notificări și bilete în avanpremieră la Serile de Film sub Stele, Sunset DJ Sessions sau sesiunile exclusive de Yoga & Mindfulness. Abonații noi primesc 15% reducere la primul bilet achiziționat.",
          "Join our private club. Be the first to receive notifications and preview tickets for Movie Nights Under the Stars, Sunset DJ Sessions, or exclusive Yoga & Mindfulness sessions. New subscribers get 15% off their first ticket."
        ),
        btnText: t(language, "Vreau acces prioritar", "I want priority access")
      };
    } else if (newsletterPopup.type === "pool") {
      details = {
        badge: t(language, "🥂 CADOU DE BUN VENIT", "🥂 WELCOME GIFT"),
        title: t(language, "Stai la curent cu Ofertele la Piscină", "Stay updated with Pool Offers"),
        subtitle: t(language, "Prosecco Complimentary la prima vizită", "Complimentary Prosecco on your first visit"),
        desc: t(
          language,
          "Înscrie-te în cercul nostru exclusiv de pool-lovers pentru a primi coduri promoționale private, invitații la Pool Parties de weekend și notificări în timp real despre disponibilitatea șezlongurilor noastre premium.",
          "Join our exclusive pool-lovers circle to receive private promo codes, invitations to weekend Pool Parties, and real-time notifications about the availability of our premium sunbeds."
        ),
        btnText: t(language, "Obține cadoul și ofertele", "Claim gift & pool offers")
      };
    } else if (newsletterPopup.type === "salons") {
      details = {
        badge: t(language, "📖 CADOU DIGITAL", "📖 DIGITAL GIFT"),
        title: t(language, "Ghidul tău Exclusiv de Organizare Evenimente", "Your Exclusive Event Planning Guide"),
        subtitle: t(language, "Ghid PDF Premium + 10% reducere salon", "Premium PDF Guide + 10% salon discount"),
        desc: t(
          language,
          "Pregătești un moment special? Abonează-te acum și îți trimitem Ghidul de Organizare Evenimente Premium 2026 (secrete de design floral, timing perfect și asortare de meniuri), alături de o ofertă de 10% reducere pentru datele din timpul săptămânii.",
          "Planning a special moment? Subscribe now and we will send you the 2026 Premium Event Planning Guide (floral design secrets, perfect timing, and menu pairings), along with a 10% discount offer for weekday dates."
        ),
        btnText: t(language, "Descarcă ghidul premium", "Download premium guide")
      };
    }

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in text-left">
        <div className="relative w-full max-w-xl bg-[#0b0c10] border border-brand-accent/20 rounded-2xl p-8 md:p-10 shadow-[0_0_50px_rgba(212,175,55,0.15)] animate-pop-in text-white overflow-hidden">
          {/* Decorative premium radial shine */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[80px] pointer-events-none z-0"></div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="relative z-10 flex flex-col gap-5 text-center">
            {/* Badge */}
            <div className="mx-auto">
              <span className="inline-block bg-brand-accent/15 border border-brand-accent/30 text-brand-accent text-[9px] uppercase tracking-[0.2em] font-black px-4 py-1.5 rounded-full">
                {details.badge}
              </span>
            </div>

            {/* Title */}
            <div>
              <h3 className="font-serif text-2xl md:text-3xl font-normal leading-tight">
                {details.title}
              </h3>
              <p className="font-sans text-xs text-brand-accent uppercase tracking-wider font-semibold mt-2">
                {details.subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="font-sans text-xs md:text-sm text-gray-300 font-light leading-relaxed">
              {details.desc}
            </p>

            {/* Form */}
            {!newsletterPopup.isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-4">
                <input
                  type="email"
                  required
                  placeholder={t(language, "Introduceți adresa de e-mail...", "Enter your email address...")}
                  value={newsletterPopup.email}
                  onChange={(e) => setNewsletterPopup(prev => ({ ...prev, email: e.target.value }))}
                  className="flex-1 px-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-full font-sans text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent/60 transition-all text-center sm:text-left"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-brand-accent hover:bg-brand-accentHover text-brand-dark rounded-full font-sans text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-brand-accent/10 whitespace-nowrap"
                >
                  {details.btnText}
                </button>
              </form>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-brand-accent/10 border border-brand-accent/20 animate-fade-in">
                <p className="font-serif text-brand-accent text-lg font-semibold">
                  ✓ {t(language, "Ești înscris cu succes!", "Successfully subscribed!")}
                </p>
                <p className="font-sans text-xs text-gray-300 font-light mt-1">
                  {t(language, "Cadoul tău digital și detaliile au fost trimise pe e-mail.", "Your digital gift and details have been sent to your email.")}
                </p>
              </div>
            )}

            {/* Dismiss Link */}
            {!newsletterPopup.isSubmitted && (
              <button
                onClick={handleClose}
                className="text-[10px] text-gray-500 hover:text-gray-400 uppercase tracking-widest font-bold underline transition-colors mt-2"
              >
                {t(language, "Nu, mulțumesc, prefer să ratez ofertele", "No thanks, I prefer to miss these offers")}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSalons = () => {
    const handleInquirySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setCalcStatus("loading");
      try {
        const { error } = await supabase.from('event_inquiries').insert([{
          client_name: clientName,
          client_phone: clientPhone,
          client_email: clientEmail,
          event_type: eventType,
          guest_count: guestCount,
          estimated_date: eventDate,
          selected_services: selectedPackages.join(", "),
          estimated_budget: getCalculatedPrice(),
          status: 'new_lead'
        }]);
        if (error) {
          const { error: err2 } = await supabase.from('reservations').insert([{
            guest_name: clientName,
            guest_phone: clientPhone,
            party_size: guestCount,
            special_requests: `Calculator Inquiry (${eventType}): Date=${eventDate}, Packages=${selectedPackages.join(", ")}, Budget=${getCalculatedPrice()}`,
            status: 'calculator_lead'
          }]);
          if (err2) throw err2;
        }

        setCalcStatus("success");
        playSuccessSound();
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#C8A96E', '#FFFFFF', '#0F1318']
        });

        setTimeout(() => {
          setCalculatorStep(1);
          setCalcStatus("idle");
          setClientName("");
          setClientPhone("");
          setClientEmail("");
          setEventDate("");
        }, 5000);
      } catch (err) {
        console.error(err);
        alert(t(language, "Eroare la trimiterea solicitării. Vă rugăm să încercați din nou.", "Error sending request. Please try again."));
        setCalcStatus("idle");
      }
    };

    const handleLookbookSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLookbookStatus("loading");
      try {
        const { error } = await supabase.from('lookbook_requests').insert([{
          client_name: lookbookName,
          client_email: lookbookEmail,
          client_phone: lookbookPhone,
          status: 'new'
        }]);
        if (error) {
          const { error: err2 } = await supabase.from('reservations').insert([{
            guest_name: lookbookName,
            guest_phone: lookbookPhone,
            party_size: 1,
            special_requests: `Lookbook Request: Email=${lookbookEmail}`,
            status: 'lookbook'
          }]);
          if (err2) throw err2;
        }

        setLookbookStatus("success");
        playSuccessSound();
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C8A96E', '#FFFFFF']
        });

        setTimeout(() => {
          setLookbookStatus("idle");
          setLookbookName("");
          setLookbookEmail("");
          setLookbookPhone("");
        }, 5000);
      } catch (err) {
        console.error(err);
        alert(t(language, "Eroare la trimiterea solicitării.", "Error sending request."));
        setLookbookStatus("idle");
      }
    };

    return (
      <div className="min-h-screen bg-brand-dark text-white antialiased overflow-x-hidden selection:bg-brand-accent selection:text-brand-dark pt-24 md:pt-32 animate-fade-in font-sans">
        {/* Elegant Minimalist Hero Section with custom image background */}
        <header className="relative w-full min-h-[75vh] flex flex-col items-center justify-center text-center px-6 md:px-20 max-w-[1600px] mx-auto mb-12 rounded-3xl overflow-hidden border border-white/5">
          {/* Absolute background image with high-end overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/salon-hero-bg.jpg"
              alt="Salon Floreasca luxury setup"
              className="w-full h-full object-cover opacity-70 filter brightness-[0.92] scale-100 transition-all duration-[2s]"
            />
            {/* Elegant luxury gradient overlay - soft blend at top and bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/95 via-brand-dark/35 to-brand-dark/95"></div>
            {/* Subtle luxury radial overlay - only fades out and blurs towards the outer corners */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(15,19,24,0.85)_95%)]"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-4xl px-4">
            <p className="font-sans text-[10px] md:text-xs text-brand-accent font-bold uppercase tracking-[0.3em] mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {t(language, "Grădina Floreasca • Saloane de Evenimente", "Grădina Floreasca • Event Salons")}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6 font-normal drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              {t(language, "Unde momentele devin memorabile", "Where moments become memorable")}
            </h1>
            <div className="w-12 h-px bg-brand-accent/60 mb-8 drop-shadow-md"></div>
            <p className="font-sans text-sm md:text-base text-white max-w-2xl leading-relaxed font-normal drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
              {t(
                language,
                "Două spații deosebite concepute pentru a găzdui momente de referință. De la nunți rafinate la conferințe corporative de înaltă ținută, vă punem la dispoziție un cadru exclusivist, în inima parcului.",
                "Two distinct spaces designed to host milestone occasions. From elegant weddings to high-profile corporate conferences, we offer an exclusive setting in the heart of the park."
              )}
            </p>
            <button
              onClick={() => {
                const el = document.getElementById("showrooms");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-10 bg-brand-dark/80 backdrop-blur-md border border-white/10 hover:border-brand-accent text-white font-bold text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-full transition-all flex items-center gap-2"
            >
              {t(language, "Explorează Saloanele", "Explore Showrooms")}
              <ArrowDown size={12} className="opacity-60" />
            </button>
          </div>
        </header>

        {/* Clean Symmetrical Showrooms Grid (Side-by-Side on Desktop, Full Screen Stretch) */}
        <section id="showrooms" className="py-24 px-6 md:px-12 lg:px-20 w-full max-w-[1600px] mx-auto border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
            {/* Salon I */}
            <div className="flex flex-col bg-brand-dark/40 border border-white/5 rounded-3xl p-6 md:p-8 hover:border-brand-accent/20 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(200,169,110,0.05)]">
              <div className="overflow-hidden rounded-2xl border border-white/5 mb-6">
                <img
                  src="/download (1).png"
                  alt="Salon I Interior"
                  className="w-full h-[280px] md:h-[380px] object-cover hover:scale-105 transition-transform duration-[2s]"
                />
              </div>
              <div className="flex flex-col flex-1">
                <p className="text-xs md:text-sm text-brand-accent uppercase tracking-[0.2em] font-semibold mb-3">
                  {t(language, "Intim & Rafinat", "Intimate & Refined")}
                </p>
                <h2 className="font-serif text-4xl md:text-5xl text-white mb-4 font-normal">Salon I</h2>
                <p className="font-sans text-gray-300 text-sm md:text-base leading-relaxed mb-8 font-light">
                  {t(
                    language,
                    "Creat pentru întâlnini exclusiviste, Salon I oferă o atmosferă sofisticată, cu vederi panoramice spre grădină. Ideal pentru cine private de afaceri sau nunți intime.",
                    "Designed for exclusive gatherings, Salon I offers a sophisticated atmosphere with panoramic views of the garden. Perfect for private corporate dinners or intimate weddings."
                  )}
                </p>
                <ul className="flex flex-col gap-4 font-sans text-sm md:text-base text-gray-300 mb-8 mt-auto">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400 font-light">{t(language, "Capacitate", "Capacity")}</span>
                    <span className="text-white font-semibold">90 - 150 Pax</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400 font-light">{t(language, "Suprafață", "Area")}</span>
                    <span className="text-white font-semibold">250 Mq</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400 font-light">{t(language, "Facilități", "Features")}</span>
                    <span className="text-white font-semibold text-right max-w-[65%]">
                      {t(language, "Terasă Privată, Lumini Custom", "Private Terrace, Custom Lights")}
                    </span>
                  </li>
                </ul>
                <div className="mt-auto pt-2 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      setGuestCount(100);
                      setCalculatorStep(2);
                      const el = document.getElementById("calculator");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex-1 text-center px-6 py-3.5 bg-brand-accent hover:bg-brand-accentHover text-brand-dark font-bold text-[10px] uppercase tracking-widest rounded-full transition-all shadow-md"
                  >
                    {t(language, "Calculează Buget", "Calculate Budget")}
                  </button>
                  <button
                    onClick={() => {
                      const wasOpen = showSalon1Gallery;
                      setShowSalon1Gallery(!showSalon1Gallery);
                      setShowSalon2Gallery(false);
                      if (!wasOpen) {
                        setTimeout(() => {
                          document.getElementById('salon1-gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }
                    }}
                    className={`flex-1 text-center px-6 py-3.5 border font-bold text-[10px] uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 ${showSalon1Gallery
                      ? "bg-white text-brand-dark border-white hover:bg-white/90"
                      : "bg-transparent text-white border-white/20 hover:border-brand-accent hover:text-brand-accent"
                      }`}
                  >
                    {showSalon1Gallery ? t(language, "Închide Galeria", "Close Gallery") : t(language, "Vezi Galeria", "View Gallery")}
                  </button>
                </div>
              </div>
            </div>

            {/* Salon II */}
            <div className="flex flex-col bg-brand-dark/40 border border-white/5 rounded-3xl p-6 md:p-8 hover:border-brand-accent/20 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(200,169,110,0.05)]">
              <div className="overflow-hidden rounded-2xl border border-white/5 mb-6">
                <img
                  src="/download (3).png"
                  alt="Salon II Interior"
                  className="w-full h-[280px] md:h-[380px] object-cover hover:scale-105 transition-transform duration-[2s]"
                />
              </div>
              <div className="flex flex-col flex-1">
                <p className="text-xs md:text-sm text-brand-accent uppercase tracking-[0.2em] font-semibold mb-3">
                  {t(language, "Grandios & Impunător", "Grand & Imposing")}
                </p>
                <h2 className="font-serif text-4xl md:text-5xl text-white mb-4 font-normal">Salon II</h2>
                <p className="font-sans text-gray-300 text-sm md:text-base leading-relaxed mb-8 font-light">
                  {t(
                    language,
                    "Spațiul nostru principal pentru evenimente monumentale. Salon II oferă plafoane înalte, acustică de ultimă generație și un design deosebit, ideal pentru gale de anvergură.",
                    "Our premier space for monumental events. Salon II boasts soaring ceilings, state-of-the-art acoustics, and an impressive layout, ideal for large-scale galas."
                  )}
                </p>
                <ul className="flex flex-col gap-4 font-sans text-sm md:text-base text-gray-300 mb-8 mt-auto">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400 font-light">{t(language, "Capacitate", "Capacity")}</span>
                    <span className="text-white font-semibold">200 - 270 Pax</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400 font-light">{t(language, "Suprafață", "Area")}</span>
                    <span className="text-white font-semibold">450 Mq</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400 font-light">{t(language, "Facilități", "Features")}</span>
                    <span className="text-white font-semibold text-right max-w-[65%]">
                      {t(language, "Scenă Mare, Ecrane LED", "Grand Stage, LED Walls")}
                    </span>
                  </li>
                </ul>
                <div className="mt-auto pt-2 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      setGuestCount(220);
                      setCalculatorStep(2);
                      const el = document.getElementById("calculator");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex-1 text-center px-6 py-3.5 bg-brand-accent hover:bg-brand-accentHover text-brand-dark font-bold text-[10px] uppercase tracking-widest rounded-full transition-all shadow-md"
                  >
                    {t(language, "Calculează Buget", "Calculate Budget")}
                  </button>
                  <button
                    onClick={() => {
                      const wasOpen = showSalon2Gallery;
                      setShowSalon2Gallery(!showSalon2Gallery);
                      setShowSalon1Gallery(false);
                      if (!wasOpen) {
                        setTimeout(() => {
                          document.getElementById('salon2-gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }
                    }}
                    className={`flex-1 text-center px-6 py-3.5 border font-bold text-[10px] uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 ${showSalon2Gallery
                      ? "bg-white text-brand-dark border-white hover:bg-white/90"
                      : "bg-transparent text-white border-white/20 hover:border-brand-accent hover:text-brand-accent"
                      }`}
                  >
                    {showSalon2Gallery ? t(language, "Închide Galeria", "Close Gallery") : t(language, "Vezi Galeria", "View Gallery")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Gallery for Salon I */}
          {showSalon1Gallery && (
            <div id="salon1-gallery" className="mt-16 border-t border-white/5 pt-12 animate-fade-in">
              <div className="flex flex-col items-center text-center mb-8 max-w-2xl mx-auto">
                <p className="text-[10px] md:text-xs text-brand-accent uppercase tracking-[0.2em] font-bold mb-2">
                  {t(language, "Galerie Foto • Salon I", "Photo Gallery • Salon I")}
                </p>
                <h3 className="font-serif text-3xl md:text-4xl text-white font-normal mb-3">
                  {t(language, "Momente de Colecție & Decoruri Rafinate", "Collection Moments & Refined Decors")}
                </h3>
                <div className="w-12 h-px bg-brand-accent/30 my-2"></div>
              </div>
              <SalonGallery
                images={[
                  { src: "/salon-peach.jpg", isPortrait: true, alt: "Decor floral roz somon pe scaune elegante de lemn" },
                  { src: "/salon-decor-1.jpg", isPortrait: true, alt: "Aranjamente florale de lux pe mese rotunde" },
                  { src: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=80", isPortrait: false, alt: "Detalii pahare si aranjament de masa sofisticat" },
                  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", isPortrait: false, alt: "Decor nunta aer liber si interior floral" },
                  { src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80", isPortrait: true, alt: "Arcada florala si buchete de mireasa spectaculoase" },
                  { src: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80", isPortrait: true, alt: "Tort de nunta elegant cu detalii aurii" },
                  { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80", isPortrait: false, alt: "Cina privata festiva cu lumanari parfumate" },
                  { src: "https://images.unsplash.com/photo-1507504038482-7621c51873f6?auto=format&fit=crop&w=1200&q=80", isPortrait: false, alt: "Apus superb pe terasa langa piscina Floreasca" },
                  { src: "/download (1).png", isPortrait: false, alt: "Salon I Privit de Sus" }
                ]}
              />
            </div>
          )}

          {/* Expanded Gallery for Salon II */}
          {showSalon2Gallery && (
            <div id="salon2-gallery" className="mt-16 border-t border-white/5 pt-12 animate-fade-in">
              <div className="flex flex-col items-center text-center mb-8 max-w-2xl mx-auto">
                <p className="text-[10px] md:text-xs text-brand-accent uppercase tracking-[0.2em] font-bold mb-2">
                  {t(language, "Galerie Foto • Salon II", "Photo Gallery • Salon II")}
                </p>
                <h3 className="font-serif text-3xl md:text-4xl text-white font-normal mb-3">
                  {t(language, "Evenimente Monumentale & Decoruri Impunătoare", "Monumental Events & Imposing Decors")}
                </h3>
                <div className="w-12 h-px bg-brand-accent/30 my-2"></div>
              </div>
              <SalonGallery
                images={[
                  { src: "/salon-setup-wide.jpg", isPortrait: false, alt: "Configuratie de gala in Salon II cu mese rotunde si lumina calda" },
                  { src: "/salon-window.jpg", isPortrait: true, alt: "Masa festiva langa geamul panoramic" },
                  { src: "/garden-books.jpg", isPortrait: true, alt: "Photo corner tematic din carti deschise si trandafiri in gradina" },
                  { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80", isPortrait: false, alt: "Banchet monumental cu lumini feerice suspendate" },
                  { src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80", isPortrait: true, alt: "Aranjamente florale impunatoare de trandafiri albi" },
                  { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80", isPortrait: false, alt: "Masa festiva de seara in aer liber" },
                  { src: "https://images.unsplash.com/photo-1507504038482-7621c51873f6?auto=format&fit=crop&w=1200&q=80", isPortrait: false, alt: "Zona lounge piscina si cocktail bar" },
                  { src: "/download (3).png", isPortrait: false, alt: "Salon II Privire Panoramica" }
                ]}
              />
            </div>
          )}
        </section>

        {/* Menu & Pricing - Symmetrical & Sophisticated Full Screen Layout */}
        <section className="py-24 px-6 md:px-20 bg-black/20 border-t border-white/5">
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-5xl text-white mb-4 font-normal">
                {t(language, "Excelență Culinară", "Culinary Excellence")}
              </h2>
              <p className="font-sans text-gray-400 max-w-xl mx-auto text-sm leading-relaxed font-light">
                {t(
                  language,
                  "Experiențe gastronomice rafinate, create pentru a satisface cele mai exigente standarde.",
                  "Curated dining experiences tailored to satisfy your most exacting standards."
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Menu Card */}
              <div className="bg-brand-dark/50 border border-white/5 p-8 rounded-3xl flex flex-col justify-between hover:border-brand-accent/20 transition-all duration-300">
                <div>
                  <h3 className="font-serif text-2xl text-white mb-4 font-normal">
                    {t(language, "Meniuri Signature", "Signature Menus")}
                  </h3>
                  <p className="font-sans text-gray-300 text-sm mb-8 leading-relaxed font-light">
                    {t(
                      language,
                      "O călătorie culinară din patru preparate ce îmbină rețete locale cu tehnici moderne.",
                      "A four-course journey blending local heritage with avant-garde culinary techniques."
                    )}
                  </p>
                  <ul className="flex flex-col gap-4 font-sans text-gray-300 text-sm mb-8">
                    <li className="flex items-center gap-3 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> {t(language, "Canapes de întâmpinare", "Welcome Canapés")}
                    </li>
                    <li className="flex items-center gap-3 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> {t(language, "Aperitiv rafinat platou", "Plated Appetizer")}
                    </li>
                    <li className="flex items-center gap-3 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> {t(language, "Fel principal la alegere", "Choice of Main")}
                    </li>
                    <li className="flex items-center gap-3 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> {t(language, "Desert decadent signature", "Decadent Dessert")}
                    </li>
                  </ul>
                </div>
                <div className="border-t border-white/5 pt-6 mt-auto">
                  <span className="font-sans text-xs text-gray-400 uppercase tracking-wider block mb-1">
                    {t(language, "Începând de la", "Starting from")}
                  </span>
                  <div className="font-serif text-3xl text-brand-accent font-normal">
                    €79 - €89<span className="text-sm font-sans text-gray-400 font-light"> /pers</span>
                  </div>
                </div>
              </div>

              {/* Bar Card */}
              <div className="bg-brand-dark/50 border border-brand-accent/20 p-8 rounded-3xl flex flex-col justify-between hover:border-brand-accent/40 transition-all duration-300">
                <div>
                  <h3 className="font-serif text-2xl text-white mb-4 font-normal">
                    {t(language, "Open Bar Premium", "Premium Open Bar")}
                  </h3>
                  <p className="font-sans text-gray-300 text-sm mb-8 leading-relaxed font-light">
                    {t(
                      language,
                      "Serviciu nelimitat cu selecție largă de băuturi fine și cocktailuri semnătură.",
                      "Unlimited service featuring top-tier spirits and bespoke signature cocktails."
                    )}
                  </p>
                  <ul className="flex flex-col gap-4 font-sans text-gray-300 text-sm mb-8">
                    <li className="flex items-center gap-3 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> {t(language, "Băuturi spirtoase fine", "Premium Spirits")}
                    </li>
                    <li className="flex items-center gap-3 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> {t(language, "Cocktailuri semnătură", "Signature Cocktails")}
                    </li>
                    <li className="flex items-center gap-3 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> {t(language, "Vinuri atent selecționate", "Selected Wines")}
                    </li>
                    <li className="flex items-center gap-3 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> {t(language, "Răcoritoare & cafea premium", "Soft Drinks & Coffee")}
                    </li>
                  </ul>
                </div>
                <div className="border-t border-white/5 pt-6 mt-auto">
                  <span className="font-sans text-xs text-gray-400 uppercase tracking-wider block mb-1">
                    {t(language, "Începând de la", "Starting from")}
                  </span>
                  <div className="font-serif text-3xl text-brand-accent font-normal">
                    €38 - €48<span className="text-sm font-sans text-gray-400 font-light"> /pers</span>
                  </div>
                </div>
              </div>

              {/* Addons Card */}
              <div className="bg-brand-dark/50 border border-white/5 p-8 rounded-3xl flex flex-col justify-between hover:border-brand-accent/20 transition-all duration-300">
                <div>
                  <h3 className="font-serif text-2xl text-white mb-4 font-normal">
                    {t(language, "Servicii Adiționale", "Bespoke Enhancements")}
                  </h3>
                  <p className="font-sans text-gray-300 text-sm mb-8 leading-relaxed font-light">
                    {t(
                      language,
                      "Elevă-ți evenimentul cu elemente exclusive create special pentru viziunea ta.",
                      "Elevate your event with exclusive additions tailored precisely to your vision."
                    )}
                  </p>
                  <ul className="flex flex-col gap-4 font-sans text-gray-300 text-sm mb-8">
                    <li className="flex justify-between border-b border-white/5 pb-2 font-light">
                      <span className="text-gray-400">{t(language, "Turn de Șampanie", "Champagne Tower")}</span>
                      <span className="text-brand-accent font-semibold">{t(language, "La cerere", "On request")}</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2 font-light">
                      <span className="text-gray-400">{t(language, "Bar de Scoici / Oystere", "Oyster Bar")}</span>
                      <span className="text-brand-accent font-semibold">{t(language, "La cerere", "On request")}</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2 font-light">
                      <span className="text-gray-400">{t(language, "Bufet de noapte târziu", "Late Night Stations")}</span>
                      <span className="text-brand-accent font-semibold">{t(language, "La cerere", "On request")}</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-6 mt-auto">
                  <button
                    onClick={() => navigate("menu")}
                    className="w-full border border-white/10 hover:border-brand-accent text-white font-bold text-[10px] uppercase tracking-widest py-3.5 rounded-full transition-all hover:bg-white/5"
                  >
                    {t(language, "Vezi Meniul Complet", "View Full Menu")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clean Minimalist Event Calculator Widget */}
        <section id="calculator" className="py-24 px-6 md:px-20 relative border-t border-white/5">
          <div className="max-w-3xl mx-auto bg-brand-dark/85 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            {/* Elegant thin progress bar */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5">
              <div
                className="h-full bg-brand-accent transition-all duration-500"
                style={{ width: `${(calculatorStep / 4) * 100}%` }}
              ></div>
            </div>

            <div className="text-center mb-10 mt-2">
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-2 font-normal">
                {t(language, "Calculator Eveniment", "Event Calculator")}
              </h2>
              <p className="font-sans text-gray-400 text-sm font-light">
                {t(language, "Planificați estimativ costurile în patru pași simpli.", "Plan your estimated costs in four simple steps.")}
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
              {/* Step 1: Type */}
              {calculatorStep === 1 && (
                <div className="animate-fade-in flex flex-col gap-6 text-center">
                  <label className="font-sans text-[10px] text-brand-accent uppercase tracking-widest block font-bold mb-4">
                    {t(language, "1. Alege tipul evenimentului", "1. Select event type")}
                  </label>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { id: "wedding", label: t(language, "Nuntă", "Wedding"), icon: <Heart size={14} /> },
                      { id: "corporate", label: t(language, "Corporate", "Corporate"), icon: <Briefcase size={14} /> },
                      { id: "baptism", label: t(language, "Botez", "Baptism"), icon: <Baby size={14} /> },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setEventType(item.id);
                          setCalculatorStep(2);
                        }}
                        className={`border rounded-full py-3.5 px-6 flex items-center justify-center gap-2 transition-all text-[10px] font-bold uppercase tracking-widest ${eventType === item.id
                          ? "border-brand-accent bg-brand-accent/10 text-brand-accent"
                          : "border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                          }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Guest Count */}
              {calculatorStep === 2 && (
                <div className="animate-fade-in flex flex-col items-center gap-6">
                  <label className="font-sans text-[10px] text-brand-accent uppercase tracking-widest block text-center font-bold">
                    {t(language, "2. Numărul de Invitați", "2. Number of Guests")}
                  </label>
                  <div className="text-5xl font-serif text-white font-normal mt-2 tracking-wide">
                    {guestCount}{" "}
                    <span className="text-sm font-sans text-gray-400 font-light tracking-wide uppercase">
                      {t(language, "oaspeți", "guests")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="350"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full max-w-md accent-brand-accent cursor-pointer bg-white/10 h-[2px] rounded-lg appearance-none"
                  />
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-accent bg-brand-accent/5 px-6 py-3 border border-brand-accent/15 rounded-full mt-2">
                    {guestCount < 160 ? (
                      <span>
                        {t(
                          language,
                          "Recomandare: Salon I (Capacitate ideală 90-150)",
                          "Recommendation: Salon I (Ideal capacity 90-150)"
                        )}
                      </span>
                    ) : (
                      <span>
                        {t(
                          language,
                          "Recomandare: Salon II (Capacitate ideală 200-270)",
                          "Recommendation: Salon II (Ideal capacity 200-270)"
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setCalculatorStep(1)}
                      className="px-6 py-3 rounded-full border border-white/10 hover:border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                    >
                      {t(language, "Înapoi", "Back")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalculatorStep(3)}
                      className="px-8 py-3 bg-brand-accent hover:bg-brand-accentHover text-brand-dark font-bold text-[10px] uppercase tracking-widest rounded-full transition-all"
                    >
                      {t(language, "Înainte", "Next")}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Packages */}
              {calculatorStep === 3 && (
                <div className="animate-fade-in flex flex-col gap-6">
                  <label className="font-sans text-[10px] text-brand-accent uppercase tracking-widest block text-center font-bold">
                    {t(language, "3. Selectează Pachetele", "3. Select Packages")}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        id: "menu",
                        title: t(language, "Meniu Signature", "Signature Menu"),
                        desc: t(language, "4 preparate fine servite", "Fine 4-course menu"),
                        price: 85,
                      },
                      {
                        id: "bar",
                        title: t(language, "Open Bar Premium", "Premium Open Bar"),
                        desc: t(language, "Băuturi nelimitate", "Unlimited drinks service"),
                        price: 43,
                      },
                      {
                        id: "addons",
                        title: t(language, "Servicii Premium", "Premium Enhancements"),
                        desc: t(language, "Oyster bar & altele", "Oyster bar & more"),
                        price: 15,
                      },
                    ].map((pkg) => {
                      const isSelected = selectedPackages.includes(pkg.id);
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedPackages(selectedPackages.filter((p) => p !== pkg.id));
                            } else {
                              setSelectedPackages([...selectedPackages, pkg.id]);
                            }
                          }}
                          className={`border p-6 rounded-2xl text-left flex flex-col justify-between min-h-[140px] transition-all ${isSelected ? "border-brand-accent bg-brand-accent/5" : "border-white/10 hover:border-white/20 bg-transparent"
                            }`}
                        >
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-[11px] font-bold uppercase tracking-widest ${isSelected ? "text-brand-accent" : "text-white"}`}>
                                {pkg.title}
                              </span>
                              {isSelected && <Check size={14} className="text-brand-accent" />}
                            </div>
                            <p className="text-xs text-gray-400 mb-4 leading-normal font-light">{pkg.desc}</p>
                          </div>
                          <div className={`text-xl font-serif ${isSelected ? "text-brand-accent" : "text-white"} font-semibold`}>
                            €{pkg.price} <span className="text-[10px] font-sans text-gray-400 font-light">/ pers</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/5 pt-6">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      {t(language, "Buget Estimativ:", "Estimated Budget:")}
                    </div>
                    <div className="text-4xl font-serif text-brand-accent font-normal">
                      €{getCalculatedPrice()}{" "}
                      <span className="text-xs font-sans text-gray-400 font-light uppercase">EUR</span>
                    </div>

                    <div className="flex gap-4 mt-2">
                      <button
                        type="button"
                        onClick={() => setCalculatorStep(2)}
                        className="px-6 py-3 rounded-full border border-white/10 hover:border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                      >
                        {t(language, "Înapoi", "Back")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalculatorStep(4)}
                        className="px-8 py-3 bg-brand-accent hover:bg-brand-accentHover text-brand-dark font-bold text-[10px] uppercase tracking-widest rounded-full transition-all"
                      >
                        {t(language, "Înainte", "Next")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Contact & Submission */}
              {calculatorStep === 4 && (
                <div className="animate-fade-in">
                  {calcStatus === "success" ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center animate-pop-in">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                        <Check size={24} className="text-emerald-500" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-2xl font-serif text-white mb-2 font-normal">
                        {t(language, "Solicitare Trimisă!", "Inquiry Sent!")}
                      </h3>
                      <p className="text-sm text-gray-400 max-w-sm leading-relaxed font-light">
                        {t(
                          language,
                          "Mulțumim! Vă vom contacta în cel mai scurt timp pentru o ofertă personalizată.",
                          "Thank you! We will contact you shortly with a personalized offer."
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      <label className="font-sans text-[10px] text-brand-accent uppercase tracking-widest block text-center font-bold">
                        {t(language, "4. Date de Contact & Confirmare", "4. Contact Info & Confirmation")}
                      </label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {t(language, "Nume Complet", "Full Name")}
                          </label>
                          <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="bg-transparent border-b border-white/10 text-white py-2 focus:outline-none focus:border-brand-accent transition-colors font-sans text-sm"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {t(language, "Număr Telefon", "Phone Number")}
                          </label>
                          <input
                            type="tel"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            className="bg-transparent border-b border-white/10 text-white py-2 focus:outline-none focus:border-brand-accent transition-colors font-sans text-sm"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {t(language, "Adresă Email", "Email Address")}
                          </label>
                          <input
                            type="email"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="bg-transparent border-b border-white/10 text-white py-2 focus:outline-none focus:border-brand-accent transition-colors font-sans text-sm"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {t(language, "Dată Eveniment", "Event Date")}
                          </label>
                          <input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="bg-transparent border-b border-white/10 text-white py-2 focus:outline-none focus:border-brand-accent transition-colors font-sans text-sm text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-3 border-t border-white/5 pt-6 mt-4">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          {t(language, "Rezumat Estimativ:", "Event Summary:")}
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {t(
                            language,
                            eventType === "wedding" ? "Nuntă" : eventType === "corporate" ? "Eveniment Corporate" : "Botez",
                            eventType === "wedding" ? "Wedding" : eventType === "corporate" ? "Corporate Event" : "Baptism"
                          )}{" "}
                          • {guestCount} {t(language, "persoane", "guests")}
                        </div>
                        <div className="text-2xl font-serif text-brand-accent font-normal">
                          {t(language, "Buget Estimativ:", "Estimated Budget:")} €{getCalculatedPrice()}
                        </div>
                      </div>

                      <div className="flex gap-4 justify-center mt-4">
                        <button
                          type="button"
                          onClick={() => setCalculatorStep(3)}
                          disabled={calcStatus === "loading"}
                          className="px-6 py-3 rounded-full border border-white/10 hover:border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                        >
                          {t(language, "Înapoi", "Back")}
                        </button>
                        <button
                          type="button"
                          onClick={handleInquirySubmit}
                          disabled={calcStatus === "loading" || !clientName || !clientPhone || !clientEmail || !eventDate}
                          className="px-8 py-3 bg-brand-accent hover:bg-brand-accentHover text-brand-dark font-bold text-[10px] uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {calcStatus === "loading" ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <>
                              {t(language, "Trimite Solicitare", "Send Inquiry")}
                              <ArrowRight size={12} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Clean Symmetrical Lookbook Request Section */}
        <section className="py-24 px-6 md:px-20 bg-[#16130f] relative overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 z-0 opacity-15">
            <img
              src="/download (5).png"
              alt="Luxury garden view texture"
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto text-center bg-brand-dark/85 backdrop-blur-xl p-10 md:p-16 rounded-3xl border border-white/5 shadow-2xl">
            {lookbookStatus === "success" ? (
              <div className="flex flex-col items-center justify-center text-center animate-pop-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                  <Check size={22} className="text-emerald-500" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-serif text-white mb-2 font-normal">
                  {t(language, "Broșura este pe cale!", "Brochure is on its way!")}
                </h3>
                <p className="text-sm text-gray-400 max-w-sm leading-relaxed font-light">
                  {t(
                    language,
                    "Link-ul de descărcare a fost trimis pe adresa dvs. de e-mail. Vizionare plăcută!",
                    "The download link has been sent to your email address. Enjoy the read!"
                  )}
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-3xl md:text-4xl text-white mb-4 font-normal">
                  {t(language, "Solicită Catalogul Oficial", "Request the Lookbook")}
                </h2>
                <p className="font-sans text-gray-400 text-sm mb-8 leading-relaxed font-light">
                  {t(
                    language,
                    "Descarcă broșura noastră completă ce conține planurile detaliate al saloanelor, meniuri complete și opțiuni speciale de design.",
                    "Download our comprehensive brochure detailing floor plans, full menus, and premium styling options."
                  )}
                </p>
                <form onSubmit={handleLookbookSubmit} className="flex flex-col gap-6 text-left">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      {t(language, "Nume Complet", "Full Name")}
                    </label>
                    <input
                      type="text"
                      value={lookbookName}
                      onChange={(e) => setLookbookName(e.target.value)}
                      className="bg-transparent border-b border-white/10 text-white py-2 focus:outline-none focus:border-brand-accent transition-colors font-sans text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        {t(language, "Adresă Email", "Email Address")}
                      </label>
                      <input
                        type="email"
                        value={lookbookEmail}
                        onChange={(e) => setLookbookEmail(e.target.value)}
                        className="bg-transparent border-b border-white/10 text-white py-2 focus:outline-none focus:border-brand-accent transition-colors font-sans text-sm"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        {t(language, "Număr Telefon", "Phone Number")}
                      </label>
                      <input
                        type="tel"
                        value={lookbookPhone}
                        onChange={(e) => setLookbookPhone(e.target.value)}
                        className="bg-transparent border-b border-white/10 text-white py-2 focus:outline-none focus:border-brand-accent transition-colors font-sans text-sm"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={lookbookStatus === "loading" || !lookbookName || !lookbookEmail || !lookbookPhone}
                    className="mt-6 bg-brand-accent hover:bg-brand-accentHover text-brand-dark font-bold text-[10px] uppercase tracking-widest py-4 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {lookbookStatus === "loading" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      t(language, "Descarcă Broșura (PDF)", "Download Brochure (PDF)")
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    );
  };

  const renderPool = () => {
    return (
      <div className="min-h-screen bg-[#f9f9ff] text-[#001c3a] antialiased overflow-x-hidden animate-fade-in font-sans">
        {/* Elegant Hero Section with custom image background */}
        <header className="relative w-full min-h-[75vh] flex flex-col items-center justify-center text-center px-6 md:px-20 pt-24 md:pt-32 mb-16 rounded-none overflow-hidden border-b border-white shadow-2xl">
          {/* Absolute background image with high-end light overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/piscina.jpg"
              alt="Pool & Terrace Floreasca luxury setup"
              className="w-full h-full object-cover scale-100 transition-all duration-[2s]"
            />
            {/* Soft gradient overlay to ensure text readability while maintaining bright vibe */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-[#f9f9ff]/90 mix-blend-multiply"></div>
          </div>

          {/* Hero Content Floating Glass Card */}
          <div className="relative z-10 w-full max-w-3xl mx-auto px-4 mt-8">
            <div className="bg-white/75 backdrop-blur-[20px] border border-white/50 p-8 md:p-12 rounded-[32px] shadow-2xl shadow-[#005ab7]/5 max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#5ef6e6]/30 text-[#006f66] font-sans text-xs font-bold mb-6 uppercase tracking-widest border border-[#006a62]/10">
                {t(language, "DAYTIME OASIS", "DAYTIME OASIS")}
              </span>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#001c3a] mb-6 drop-shadow-sm font-normal">
                {t(language, "Oază de relaxare sub soarele Bucureștiului", "A Daytime Oasis Under Bucharest's Sun")}
              </h1>
              <p className="font-sans text-sm md:text-base text-[#414754] mb-8 max-w-xl mx-auto font-light leading-relaxed">
                {t(
                  language,
                  "Evadați din zgomotul orașului. Cufundați-vă în apele noastre cristaline, savurați cocktailuri mediteraneene și lăsați adierea blândă a grădinilor noastre luxuriante să vă transporte într-o stare deplină de liniște.",
                  "Escape the city noise. Immerse yourself in crystalline waters, savor Mediterranean-inspired refreshments, and let the gentle breeze of our lush gardens transport you to a tropical state of mind."
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("menu")}
                  className="bg-[#005ab7] hover:bg-[#0072e5] text-white font-sans text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>{t(language, "Explorează Meniul", "Explore the Menu")}</span>
                  <Utensils size={14} />
                </button>
                <button
                  onClick={() => setIsReservationOpen(true)}
                  className="bg-white/50 border border-[#005ab7]/20 text-[#005ab7] font-sans text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white/85 hover:shadow-md transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2"
                >
                  <span>{t(language, "Descoperă Grădina", "Discover the Garden")}</span>
                  <Sparkles size={14} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Editorial Showcase (Bento Grid) */}
        <section className="py-24 px-6 md:px-12 lg:px-20 w-full max-w-[1440px] mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl md:text-5xl text-[#001c3a] font-normal mb-4">
              {t(language, "A Curated Experience", "A Curated Experience")}
            </h2>
            <div className="w-12 h-px bg-[#005ab7]/20 mx-auto my-2"></div>
            <p className="font-sans text-base md:text-lg text-[#414754] leading-relaxed font-light mt-3">
              {t(
                language,
                "Fiecare detaliu al terasei și piscinei noastre este proiectat pentru a oferi o îmbinare perfectă între lux, confort și o estetică naturală spectaculoasă.",
                "Every detail of our terrace and pool area is designed to provide a seamless blend of luxury, comfort, and breathtaking aesthetics."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 auto-rows-[minmax(350px,_auto)]">
            {/* Bento Card 1: The Crystal Waters (2/3 width) */}
            <div className="lg:col-span-8 group bg-white/80 backdrop-blur-[16px] border border-white rounded-[24px] overflow-hidden shadow-xl shadow-[#005ab7]/5 flex flex-col md:flex-row h-full transition-all duration-500 hover:shadow-2xl">
              <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80"
                  alt="Crystal water close-up"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/40">
                <div className="w-12 h-12 rounded-full bg-[#005ab7]/10 flex items-center justify-center mb-6 text-[#005ab7]">
                  <Sparkles size={20} />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-[#001c3a] mb-4 font-normal">
                  {t(language, "The Crystal Waters", "The Crystal Waters")}
                </h3>
                <p className="font-sans text-base text-[#414754] leading-relaxed font-light mb-6">
                  {t(
                    language,
                    "Piscina noastră menținută meticulos oferă apă la temperatură ideală, cu o puritate de cristal ce reflectă perfect cerul senin de vară. Un cadru sublim conceput pentru înot revigorant sau momente lungi de lenevire pe șezlong.",
                    "Dive into perfection. Our meticulously maintained pool features temperature-controlled, crystal-clear water that mirrors the endless summer sky. Designed for both invigorating morning swims and lazy afternoon lounging."
                  )}
                </p>
                <a
                  onClick={() => alert(t(language, "Informațiile despre tratarea ecologică a apei sunt disponibile la recepție.", "Eco water treatment specs are available at the front desk."))}
                  className="inline-flex items-center text-[#005ab7] font-sans text-sm font-bold uppercase tracking-widest hover:text-[#0072e5] transition-colors cursor-pointer group/link"
                >
                  {t(language, "Află mai multe despre calitatea apei →", "Learn about our water quality →")}
                </a>
              </div>
            </div>

            {/* Bento Card 2: Mediterranean Flavors (1/3 width) */}
            <div className="lg:col-span-4 group bg-white/80 backdrop-blur-[16px] border border-white rounded-[24px] overflow-hidden shadow-xl shadow-[#005ab7]/5 flex flex-col h-full transition-all duration-500 hover:shadow-2xl">
              <div className="h-64 relative overflow-hidden shrink-0">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1200&q=80"
                  alt="Cocktails by the pool"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between bg-white/40">
                <div>
                  <h3 className="font-serif text-2xl text-[#001c3a] mb-3 font-normal">
                    {t(language, "Mediterranean Flavors", "Mediterranean Flavors")}
                  </h3>
                  <p className="font-sans text-base text-[#414754] leading-relaxed font-light mb-6">
                    {t(
                      language,
                      "Elevați experiența de zi cu preparate ușoare de vară și cocktailuri signature pline de culoare, livrate direct la șezlong.",
                      "Elevate your poolside experience with our curated menu. From crisp, refreshing signature cocktails to light, vibrant Mediterranean bites."
                    )}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate("menu")}
                    className="w-full py-3 px-6 rounded-xl bg-[#005ab7] hover:bg-[#0072e5] text-white font-sans text-xs font-bold uppercase tracking-widest text-center flex justify-center items-center gap-2"
                  >
                    <Utensils size={14} />
                    {t(language, "Meniu Restaurant", "Menu Restaurant")}
                  </button>
                  <button
                    onClick={() => navigate("menu")}
                    className="w-full py-3 px-6 rounded-xl border border-[#005ab7]/20 hover:bg-[#005ab7]/5 text-[#005ab7] font-sans text-xs font-bold uppercase tracking-widest text-center flex justify-center items-center gap-2"
                  >
                    <Wine size={14} />
                    {t(language, "Meniu Bar", "Menu Bar")}
                  </button>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Unmatched Serenity */}
            <div className="lg:col-span-5 group bg-[#effaf8] border border-[#e0f2f1] rounded-[24px] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden shadow-xl shadow-[#005ab7]/5 transition-all duration-500 hover:shadow-2xl">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 text-[#006a62]/5 pointer-events-none">
                <Sparkles size={250} />
              </div>
              <div className="relative z-10">
                <h3 className="font-serif text-2xl md:text-3xl text-[#001c3a] mb-4 font-normal">
                  {t(language, "Unmatched Serenity", "Unmatched Serenity")}
                </h3>
                <p className="font-sans text-base md:text-lg text-[#414754] leading-relaxed font-light mb-6">
                  {t(
                    language,
                    "Înconjurată de copaci maturi și vegetație luxuriantă, terasa noastră oferă un refugiu privat rar întâlnit de liniște deplină chiar în inima parcului, la doar câțiva pași de centrul agitat al orașului.",
                    "Surrounded by mature, lush vegetation and designed with expansive spatial flow, our terrace offers a rare pocket of absolute tranquility in the heart of the city."
                  )}
                </p>
                <ul className="space-y-4 mb-2">
                  {[
                    t(language, "Șezlonguri ergonomice din lemn cu saltea ultra-confortabilă", "Premium, ergonomically designed sun loungers"),
                    t(language, "Serviciu dedicat la șezlong prin cod QR", "Dedicated poolside service"),
                    t(language, "Zone VIP cu baldachine private și intimitate sporită", "Private cabana options available")
                  ].map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start text-base text-[#006f66] font-medium gap-3">
                      <Check size={16} className="text-[#006f66] mt-0.5 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bento Card 4: Atmosphere Quote Image */}
            <div className="lg:col-span-7 rounded-[24px] overflow-hidden shadow-xl shadow-[#005ab7]/5 relative min-h-[350px] lg:min-h-full group border border-white">
              <img
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1507504038482-7621c51873f6?auto=format&fit=crop&w=1200&q=80"
                alt="Floreasca premium lounge terrace"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 md:p-12">
                <p className="text-white font-serif text-2xl md:text-3xl italic font-normal max-w-lg drop-shadow-md">
                  {t(language, "„Cel mai frumos refugiu este cel aflat chiar lângă tine.”", "“The perfect escape, right where you are.”")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Program & Tarife Section */}
        <section className="py-24 px-6 md:px-12 lg:px-20 w-full border-t border-[#c1c6d7]/20 bg-[#edf2f9]/70 rounded-[24px] max-w-[1440px] mx-auto mb-16 shadow-xl shadow-[#005ab7]/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="font-sans text-[10px] md:text-xs text-[#005ab7] font-bold uppercase tracking-[0.2em] mb-3">
                {t(language, "PLANIFICĂ VIZITA", "PLAN YOUR VISIT")}
              </p>
              <h2 className="font-serif text-3xl md:text-5xl text-[#001c3a] font-normal mb-8">
                {t(language, "Program & Tarife", "Program & Tarife")}
              </h2>

              <div className="space-y-6">
                {/* Schedule Box */}
                <div className="bg-white p-6 md:p-8 rounded-[20px] border border-[#c1c6d7]/20 shadow-md">
                  <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-[#005ab7] mb-4 flex items-center gap-2 border-b border-[#f0f4fa] pb-3">
                    <Clock size={16} />
                    {t(language, "ORAR", "ORAR")}
                  </h4>
                  <ul className="space-y-3 font-sans text-sm md:text-base text-[#414754]">
                    <li className="flex justify-between pb-3 border-b border-[#f0f4fa] font-semibold text-[#001c3a]">
                      <span className="font-light text-[#414754]">{t(language, "Luni-Duminică:", "Luni-Duminică:")}</span>
                      <span>10:00 – 19:00</span>
                    </li>
                    <li className="pt-2 text-[#006f66] flex flex-col gap-1">
                      <div className="flex justify-between font-semibold">
                        <span>{t(language, "MARȚI și DUMINICĂ:", "MARȚI și DUMINICĂ:")}</span>
                        <span>19:00 – 22:00</span>
                      </div>
                      <span className="text-xs text-gray-500 font-light italic">
                        {t(language, "Program prelungit, acces gratuit după ora 18:00", "Program prelungit, acces gratuit după ora 18:00")}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Rates Box */}
                <div className="bg-white p-6 md:p-8 rounded-[20px] border border-[#c1c6d7]/20 shadow-md">
                  <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-[#005ab7] mb-4 flex items-center gap-2 border-b border-[#f0f4fa] pb-3">
                    <ShoppingBag size={16} />
                    {t(language, "TARIFE ACCES", "TARIFE ACCES")}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sans text-sm md:text-base text-[#414754]">
                    <div className="pb-4 md:pb-0 md:pr-6 md:border-r border-[#f0f4fa]">
                      <p className="font-semibold text-[#001c3a] mb-2">
                        {t(language, "Luni - Vineri", "Luni - Vineri")}
                      </p>
                      <div className="flex justify-between mb-1 font-light">
                        <span>{t(language, "Copii:", "Copii:")}</span>
                        <span className="font-semibold text-[#001c3a]">60 lei</span>
                      </div>
                      <div className="flex justify-between font-light">
                        <span>{t(language, "Adulți:", "Adulți:")}</span>
                        <span className="font-semibold text-[#001c3a]">80 lei</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-[#001c3a] mb-2">
                        {t(language, "Sâmbătă - Duminică", "Sâmbătă - Duminică")}
                      </p>
                      <div className="flex justify-between mb-1 font-light">
                        <span>{t(language, "Copii:", "Copii:")}</span>
                        <span className="font-semibold text-[#001c3a]">100 lei</span>
                      </div>
                      <div className="flex justify-between font-light">
                        <span>{t(language, "Adulți:", "Adulți:")}</span>
                        <span className="font-semibold text-[#001c3a]">120 lei</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#f0f4fa] text-xs text-gray-500 font-light flex flex-col gap-2">
                    <p className="flex items-center gap-2">
                      <Info size={14} className="text-[#005ab7]" />
                      {t(language, "Tarifele includ șezlong & umbrelă.", "Tarifele includ șezlong & umbrelă.")}
                    </p>
                    <p className="flex items-center gap-2">
                      <Info size={14} className="text-[#005ab7]" />
                      {t(language, "Închiriere prosop: 30 lei", "Închiriere prosop: 30 lei")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Regulament Accordion Card */}
            <div className="bg-white p-8 rounded-[20px] border border-[#c1c6d7]/20 shadow-md h-full flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-[#001c3a] mb-6 font-normal">
                  {t(language, "Regulament Piscină", "Regulament Piscină")}
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      title: t(language, "Standarde de Conduită", "Standarde de Conduită"),
                      desc: t(language, "Accesul implică respectarea celor 32 de puncte ale regulamentului intern. Acesta include norme de igienă, siguranță și respect față de ceilalți oaspeți. Vă rugăm să consultați lista completă la recepție sau prin link-ul de mai jos.", "Accesul implică respectarea celor 32 de puncte ale regulamentului intern. Acesta include norme de igienă, siguranță și respect față de ceilalți oaspeți. Vă rugăm să consultați lista completă la recepție sau prin link-ul de mai jos.")
                    },
                    {
                      title: t(language, "Acces și Rezervări", "Acces și Rezervări"),
                      desc: t(language, "Rezervările sunt recomandate pentru weekend-uri. Accesul minorilor este permis doar sub supravegherea adulților.", "Rezervările sunt recomandate pentru weekend-uri. Accesul minorilor este permis doar sub supravegherea adulților.")
                    },
                    {
                      title: t(language, "Securitate și Obiecte Personale", "Securitate și Obiecte Personale"),
                      desc: t(language, "Administrația nu își asumă răspunderea pentru obiectele lăsate nesupravegheate. Vă rugăm să utilizați vestiarele special amenajate.", "Administrația nu își asumă răspunderea pentru obiectele lăsate nesupravegheate. Vă rugăm să utilizați vestiarele special amenajate.")
                    }
                  ].map((rule, idx) => {
                    const isOpen = activePoolRule === idx;
                    return (
                      <div key={idx} className="border-b border-[#f0f4fa] pb-4">
                        <button
                          onClick={() => setActivePoolRule(isOpen ? null : idx)}
                          className="w-full flex justify-between items-center text-left py-3 font-sans text-sm md:text-base font-semibold text-[#001c3a] hover:text-[#005ab7] transition-colors"
                        >
                          <span>{rule.title}</span>
                          <ChevronDown
                            size={16}
                            className={`text-[#005ab7] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        <div
                          className={`transition-all duration-300 overflow-hidden font-sans text-xs md:text-sm text-[#414754] leading-relaxed ${isOpen ? "max-h-40 mt-2 opacity-100" : "max-h-0 opacity-0"}`}
                        >
                          <p className="py-2 pl-2 border-l border-[#005ab7]/40">{rule.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-8 border-t border-[#f0f4fa] mt-10">
                <button
                  onClick={() => alert(t(language, "Descărcare regulament (PDF) începută...", "Regulations PDF download started..."))}
                  className="text-[#005ab7] hover:text-[#0072e5] transition-colors font-sans text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                >
                  <Briefcase size={14} />
                  {t(language, "Descarcă Regulamentul Complet (32 puncte)", "Descarcă Regulamentul Complet (32 puncte)")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 bg-gradient-to-br from-[#005ab7]/10 via-white to-[#e6eeff]/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#005ab7] rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#e6eeff] rounded-full blur-[120px]"></div>
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#005ab7]/20 shadow-sm mb-8">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-[#001c3a]">
                {t(language, "Disponibilitate Limitată", "Limited Availability")}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-[#001c3a] mb-8 leading-tight font-normal">
              {t(
                language,
                "Locurile se ocupă rapid! Rezervă-ți acum oaza de liniște pentru acest weekend.",
                "Spots fill up fast! Reserve your oasis of calm for this weekend."
              )}
            </h2>
            <div className="flex justify-center">
              <a
                href="tel:+40755085967"
                className="inline-flex items-center justify-center gap-4 bg-[#005ab7] text-white px-10 py-5 rounded-full font-sans text-lg font-bold hover:bg-[#0072e5] transition-all duration-300 shadow-xl hover:shadow-[#005ab7]/20 hover:-translate-y-1 transform active:scale-95"
              >
                <Phone size={24} />
                <span>{t(language, "Sună pentru Rezervare", "Call for Reservation")}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Circular Ripples Accent Section */}
        <section className="py-24 bg-[#f0f4fa] relative overflow-hidden">
          {/* Concentric ripples effect */}
          <div className="absolute inset-0 opacity-30 pointer-events-none z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[1px] border-[#005ab7]/20 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[1px] border-[#005ab7]/30 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
          </div>

          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <div className="text-[#005ab7] mb-6 flex justify-center">
              <Sun size={48} />
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-[#001c3a] mb-6 font-normal">
              {t(language, "Ready to soak up the sun?", "Ready to soak up the sun?")}
            </h2>
            <p className="font-sans text-base md:text-lg text-[#414754] mb-10 max-w-xl mx-auto font-light leading-relaxed">
              {t(
                language,
                "Vă așteptăm pentru o zi de neuitat plină de relaxare, arome deosebite și atmosferă de vacanță la Grădina Floreasca.",
                "Join us for an unforgettable day of relaxation, exquisite flavors, and perfect weather at Grădina Floreasca."
              )}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={() => navigate("menu")}
                className="w-full sm:w-auto bg-[#005ab7] hover:bg-[#0072e5] text-white font-sans text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-full shadow-lg transition-all duration-300"
              >
                {t(language, "Explorează Meniul", "Explore the Menu")}
              </button>
              <button
                onClick={() => setIsReservationOpen(true)}
                className="w-full sm:w-auto bg-white/60 border border-[#005ab7] text-[#005ab7] font-sans text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white hover:shadow-md transition-all duration-300 backdrop-blur-sm"
              >
                {t(language, "Calendar Evenimente", "View Event Calendar")}
              </button>
            </div>
          </div>
        </section>

        <LegalFooter lang={language} theme="light" />
      </div>
    );
  };

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
        id: "pool",
        label: t(language, "Piscină & Terasă", "Pool & Terrace"),
        icon: <Sparkles size={18} />,
      },
      {
        id: "salons",
        label: t(language, "Saloane Evenimente", "Event Salons"),
        icon: <ChefHat size={18} />,
      },
      {
        id: "book",
        label: t(language, "Rezerva Masa", "Book a Table"),
        icon: <CalendarCheck size={18} />,
      },
      {
        id: "events",
        label: t(language, "Evenimente", "Events"),
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
            { id: "pool", label: t(language, "Piscină", "Pool") },
            { id: "salons", label: t(language, "Saloane", "Salons") },
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
        {activeView === "salons" && renderSalons()}
        {activeView === "pool" && renderPool()}
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

      {/* ═══ RSVP Bottom Sheet for Events ═══ */}
      <div className={`fixed inset-0 z-[200] ${isRsvpOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${isRsvpOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setIsRsvpOpen(false)}
        ></div>
        <div
          className={`fixed z-[210] flex flex-col bg-[#1A1817] shadow-float overflow-hidden
            inset-x-0 bottom-0 h-auto max-h-[85vh] rounded-t-[32px]
            sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:right-auto sm:-translate-x-1/2 sm:w-[92%] sm:max-w-[560px] sm:rounded-[32px]
            ${isRsvpOpen ? "translate-y-0 opacity-100 sm:-translate-y-1/2 sm:scale-100" : "translate-y-full opacity-0 pointer-events-none sm:translate-y-0 sm:scale-95 sm:opacity-0 sm:pointer-events-none"}`}
          style={{ transition: "transform 0.4s cubic-bezier(0.32,0.72,0,1), opacity 0.3s, scale 0.3s" }}
        >
          {/* Handle & Header */}
          <div className="flex flex-col items-center pt-3 pb-2 shrink-0 bg-[#1A1817] z-20 sticky top-0 border-b border-white/5">
            <div className="h-1.5 w-12 rounded-full bg-gray-600/40 mb-4 sm:hidden"></div>
            <div className="w-full px-6 flex items-center justify-between">
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-brand-accent">RSVP</h1>
              <button onClick={() => setIsRsvpOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 pb-28 no-scrollbar">
            {/* Success state */}
            <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#1A1817] transition-all duration-500 ${rsvpStatus === "success" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}>
              <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-pop-in">
                  <Check size={36} strokeWidth={3} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-serif text-white mb-2">{t(language, "Rezervare Confirmată", "Booking Confirmed")}</h2>
              <p className="text-gray-400">{t(language, "Te așteptăm cu drag!", "We look forward to seeing you!")}</p>
            </div>

            <div className={`flex flex-col gap-6 transition-opacity duration-300 ${rsvpStatus === "success" ? "opacity-0" : "opacity-100"}`}>
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[10px] text-gray-400 mb-2 uppercase tracking-[0.1em]">{t(language, "Nume Complet", "Full Name")}</label>
                  <input
                    type="text"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder={t(language, "Ex: Alexandru Popescu", "Ex: John Smith")}
                    required
                    className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-brand-accent transition-colors text-base placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-gray-400 mb-2 uppercase tracking-[0.1em]">{t(language, "Telefon", "Phone")}</label>
                  <input
                    type="tel"
                    value={rsvpPhone}
                    onChange={(e) => setRsvpPhone(e.target.value)}
                    placeholder="+40 7xx xxx xxx"
                    required
                    className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-brand-accent transition-colors text-base placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Event Selection */}
              <div>
                <label className="block font-mono text-[10px] text-gray-400 mb-2 uppercase tracking-[0.1em]">{t(language, "Selectează Evenimentul", "Select Event")}</label>
                <select
                  value={rsvpEvent}
                  onChange={(e) => setRsvpEvent(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-brand-accent transition-colors text-base appearance-none"
                  style={{ background: "#1A1817" }}
                >
                  <option value="film" style={{ background: "#1A1817" }}>{t(language, "Seri de Film sub Stele", "Movie Nights Under the Stars")}</option>
                  <option value="dj" style={{ background: "#1A1817" }}>Sunset DJ Sessions</option>
                  <option value="yoga" style={{ background: "#1A1817" }}>Morning Yoga & Mindfulness</option>
                </select>
              </div>

              {/* Guest Count */}
              <div>
                <label className="block font-mono text-[10px] text-gray-400 mb-2 uppercase tracking-[0.1em]">{t(language, "Număr de Persoane", "Number of Guests")}</label>
                <select
                  value={rsvpGuests}
                  onChange={(e) => setRsvpGuests(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-brand-accent transition-colors text-base appearance-none"
                  style={{ background: "#1A1817" }}
                >
                  <option value="1" style={{ background: "#1A1817" }}>{t(language, "1 Persoană", "1 Person")}</option>
                  <option value="2" style={{ background: "#1A1817" }}>{t(language, "2 Persoane", "2 People")}</option>
                  <option value="3" style={{ background: "#1A1817" }}>{t(language, "3 Persoane", "3 People")}</option>
                  <option value="4" style={{ background: "#1A1817" }}>{t(language, "4 Persoane", "4 People")}</option>
                  <option value="5+" style={{ background: "#1A1817" }}>{t(language, "Grup (5+ Persoane)", "Group (5+ People)")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Action */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#1A1817] via-[#1A1817] to-transparent pt-10 pointer-events-none">
            <button
              onClick={async () => {
                setRsvpStatus("loading");
                try {
                  await supabase.from("reservations").insert([{
                    guest_name: rsvpName || "Event Guest",
                    guest_phone: rsvpPhone,
                    party_size: parseInt(rsvpGuests) || 2,
                    reservation_time: new Date().toISOString(),
                    status: "confirmed"
                  }]);
                  setRsvpStatus("success");
                  playSuccessSound();
                  setTimeout(() => {
                    setIsRsvpOpen(false);
                    setTimeout(() => {
                      setRsvpStatus("idle");
                      setRsvpName("");
                      setRsvpPhone("");
                      setRsvpEvent("film");
                      setRsvpGuests("2");
                    }, 400);
                  }, 2500);
                } catch {
                  setRsvpStatus("idle");
                  alert(t(language, "A apărut o eroare.", "An error occurred."));
                }
              }}
              disabled={rsvpStatus !== "idle"}
              className={`pointer-events-auto w-full h-[52px] rounded-full text-white font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${rsvpStatus === "success"
                ? "bg-green-500 shadow-[0_8px_32px_rgba(34,197,94,0.3)]"
                : "bg-brand-accent shadow-glow hover:bg-brand-accentHover text-brand-dark"
                }`}
            >
              {rsvpStatus === "loading" ? (
                <Loader2 size={24} className="animate-spin" />
              ) : rsvpStatus === "success" ? (
                <Check size={24} className="animate-pop-in" />
              ) : (
                <>
                  {t(language, "Confirmă Rezervarea", "Confirm Booking")}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <DietaryFilterModal
        isOpen={isDietaryModalOpen}
        onClose={() => setIsDietaryModalOpen(false)}
        lang={language}
        currentFilters={dietaryFilters}
        onApplyFilters={setDietaryFilters}
      />

      {renderNewsletterPopup()}
    </div>
  );
}

// --- HELPER COMPONENT: ANIMATED IMAGE FOR SCROLLABLE MASONRY ---
function AnimatedImage({ alt, src, ratio, placeholder }: { alt: string; src: string; ratio: number; placeholder?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleError = () => {
    if (placeholder) {
      setImgSrc(placeholder);
    }
  };

  return (
    <div
      ref={ref}
      style={{ aspectRatio: ratio }}
      className="bg-white/5 relative w-full rounded-2xl border border-white/5 overflow-hidden group shadow-xl"
    >
      <img
        alt={alt}
        src={imgSrc}
        className={`w-full h-full object-cover transition-all duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-[1.08] ${isInView && !isLoading ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
          }`}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
        onError={handleError}
      />
    </div>
  );
}

// --- HELPER COMPONENT: RESPONSIVE PINTEREST-STYLE MASONRY GALLERY ---
interface SalonGalleryProps {
  images: { src: string; isPortrait: boolean; alt: string }[];
}

function SalonGallery({ images }: SalonGalleryProps) {
  // Split images into 3 columns dynamically
  const col1 = images.filter((_, idx) => idx % 3 === 0);
  const col2 = images.filter((_, idx) => idx % 3 === 1);
  const col3 = images.filter((_, idx) => idx % 3 === 2);

  return (
    <div className="w-full mt-10 p-6 md:p-10 bg-black/45 border border-white/5 rounded-3xl animate-fade-in shadow-2xl relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[85vh] overflow-y-auto pr-2 no-scrollbar scroll-smooth">
        {[col1, col2, col3].map((colImages, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-6">
            {colImages.map((img, imgIdx) => {
              const ratio = img.isPortrait ? 9 / 16 : 16 / 9;
              return (
                <AnimatedImage
                  key={`${colIdx}-${imgIdx}`}
                  alt={img.alt}
                  src={img.src}
                  ratio={ratio}
                  placeholder="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=20"
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="text-center text-[10px] text-gray-500 font-mono tracking-widest mt-8 uppercase flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping"></span>
        Scroll pentru a explora toate momentele de colecție
      </div>
    </div>
  );
}
