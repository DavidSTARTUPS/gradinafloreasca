import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Users, CalendarCheck, Clock, Utensils, Check, ArrowRight, Loader2 } from 'lucide-react';
import { t } from '../data/menuData';
import { Calendar } from './Calendar';
import { supabase } from '../supabaseClient';

// --- COMPONENTA REZERVARE (Bottom Sheet iOS style) ---
export const ReservationModal = ({ isOpen, onClose, lang }: { isOpen: boolean; onClose: () => void; lang: string }) => {
  const [partySize, setPartySize] = useState("2");
  const [isCustomParty, setIsCustomParty] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | string>(1);
  const [customDate, setCustomDate] = useState<string>("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("19:00");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  // --- Swipe-to-dismiss state (MOBILE ONLY) ---
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);

  const today = new Date();
  const days = Array.from({ length: 2 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayEn = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayRo = d.toLocaleDateString("ro-RO", { weekday: "short" });
    return {
      id: i,
      label: i === 0 ? t(lang, "Azi", "Today") : i === 1 ? t(lang, "Maine", "Tomorrow") : t(lang, dayRo, dayEn),
      date: d.getDate().toString(),
      fullDate: d,
    };
  });

  const partyOptions = ["1", "2", "3", "4", "5+"];

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // --- Touch handlers for swipe-to-dismiss ---
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only enable swipe on mobile
    if (window.innerWidth >= 640) return;
    const target = e.target as HTMLElement;
    // Only start drag from the handle area (top ~60px)
    const rect = sheetRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touchY = e.touches[0].clientY;
    if (touchY - rect.top > 60) return; // only drag from top area
    dragStartY.current = e.touches[0].clientY;
    dragStartTime.current = Date.now();
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = Math.max(0, currentY - dragStartY.current); // only allow downward drag
    setDragY(diff);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const velocity = dragY / (Date.now() - dragStartTime.current) * 1000;
    // Dismiss if dragged > 120px or fast swipe
    if (dragY > 120 || velocity > 600) {
      setDragY(window.innerHeight); // animate out
      setTimeout(() => {
        onClose();
        setDragY(0);
      }, 300);
    } else {
      setDragY(0); // snap back
    }
  }, [isDragging, dragY, onClose]);

  // Calculate overlay opacity based on drag
  const overlayOpacity = isOpen ? Math.max(0, 1 - dragY / 400) : 0;

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

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      // Build the reservation date/time
      let reservationDate: Date;
      if (typeof selectedDate === 'number' && days[selectedDate]) {
        reservationDate = new Date(days[selectedDate].fullDate);
      } else if (customDate) {
        reservationDate = new Date(customDate);
      } else {
        reservationDate = new Date();
      }

      const [hours, minutes] = selectedTime.split(':').map(Number);
      reservationDate.setHours(hours, minutes, 0, 0);

      // Insert into Supabase
      const { error } = await supabase.from('reservations').insert([{
        guest_name: guestName || 'Website Guest',
        guest_phone: guestPhone,
        party_size: parseInt(partySize) || 2,
        reservation_time: reservationDate.toISOString(),
        status: 'confirmed'
      }]);

      if (error) throw error;

      setStatus("success");
      playSuccessSound();

      // Reset and close after confirmation
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          setStatus("idle");
          setGuestName("");
          setGuestPhone("");
          setSpecialRequests("");
          setPartySize("2");
          setIsCustomParty(false);
          setSelectedDate(1);
          setCustomDate("");
          setSelectedTime("19:00");
        }, 400);
      }, 2500);
    } catch (error) {
      console.error('Reservation error:', error);
      setStatus("idle");
      alert(t(lang, "A aparut o eroare.", "An error occurred."));
    }
  };

  return (
    <div className={`fixed inset-0 z-[200] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ opacity: overlayOpacity }}
        onClick={onClose}
      ></div>

      {/* Bottom Sheet Modal Container */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`fixed z-[210] flex flex-col bg-[#1A1817] shadow-float overflow-hidden
          inset-x-0 bottom-0 h-auto max-h-[70vh] rounded-t-[32px]
          sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:right-auto sm:-translate-x-1/2 sm:w-[92%] sm:max-w-[480px] sm:h-[85vh] sm:max-h-[750px] sm:rounded-[32px]
          ${isOpen ? "translate-y-0 opacity-100 sm:-translate-y-1/2 sm:scale-100" : "translate-y-full opacity-0 pointer-events-none sm:translate-y-0 sm:scale-95 sm:opacity-0 sm:pointer-events-none"}`}
        style={{
          transform: window.innerWidth < 640 && isOpen
            ? `translateY(${dragY}px)`
            : undefined,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.32,0.72,0,1), opacity 0.3s, scale 0.3s',
        }}
      >
        {/* Handle & Header */}
        <div className="flex flex-col items-center pt-3 pb-2 shrink-0 bg-[#1A1817] z-20 sticky top-0 border-b border-white/5">
          {/* Mobile drag handle */}
          <div className="h-1.5 w-12 rounded-full bg-gray-600/40 mb-4 sm:hidden cursor-grab active:cursor-grabbing"></div>
          <div className="w-full px-6 flex flex-col items-center relative">
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-white text-center">{t(lang, "Rezerva o Masa", "Book a Table")}</h1>
            {/* X button: only on desktop */}
            <button onClick={onClose} aria-label="Close" className="hidden sm:flex absolute right-6 items-center justify-center w-10 h-10 rounded-full bg-black/50 text-gray-400 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 pb-28 no-scrollbar">
          {/* Apple Pay Style Success Overlay */}
          <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#1A1817] transition-all duration-500 ${status === 'success' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-pop-in">
                <Check size={36} strokeWidth={3} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-serif text-white mb-2">{t(lang, "Rezervare Confirmata", "Booking Confirmed")}</h2>
            <p className="text-gray-400">{t(lang, "Te asteptam cu drag!", "We look forward to seeing you!")}</p>
          </div>

          <div className={`transition-opacity duration-300 ${status === 'success' ? 'opacity-0' : 'opacity-100'}`}>
            {/* Guest Info */}
            <section className="mb-6">
              <h2 className="text-sm uppercase tracking-wider text-gray-400 font-medium mb-3 flex items-center justify-center gap-2">
                <Users size={16} />
                {t(lang, "Contact", "Contact Info")}
              </h2>
              <div className="flex flex-col items-center gap-4">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder={t(lang, "Numele dumneavoastra", "Your name")}
                  className="block w-full max-w-[280px] border-0 border-b border-gray-700 bg-transparent py-2 px-0 text-white focus:border-brand-accent focus:ring-0 text-base placeholder:text-gray-500 transition-colors text-center"
                />
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder={t(lang, "Numar de telefon", "Phone number")}
                  className="block w-full max-w-[280px] border-0 border-b border-gray-700 bg-transparent py-2 px-0 text-white focus:border-brand-accent focus:ring-0 text-base placeholder:text-gray-500 transition-colors text-center"
                />
              </div>
            </section>

            {/* Party Size */}
            <section className="mb-6">
              <h2 className="text-sm uppercase tracking-wider text-gray-400 font-medium mb-3 flex items-center justify-center gap-2">
                <Users size={16} />
                {t(lang, "Persoane", "Party Size")}
              </h2>
              <div className="flex justify-center items-center gap-2">
                {partyOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      if (size === "5+") {
                        setIsCustomParty(true);
                        setPartySize("6");
                      } else {
                        setIsCustomParty(false);
                        setPartySize(size);
                      }
                    }}
                    className={`w-12 h-12 rounded-full border text-base flex items-center justify-center transition-all ${(partySize === size && !isCustomParty) || (size === "5+" && isCustomParty)
                      ? "border-brand-accent bg-brand-accent/10 text-brand-accent font-semibold"
                      : "border-gray-700/50 text-gray-200 font-medium hover:bg-white/5"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {isCustomParty && (
                <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300 flex justify-center">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    className="w-24 bg-[#121212] border border-brand-accent/30 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-brand-accent transition-all text-center text-lg font-bold"
                  />
                </div>
              )}
            </section>

            {/* Date Selection */}
            <section className="mb-5 relative">
              <h2 className="text-sm uppercase tracking-wider text-gray-400 font-medium mb-3 flex items-center justify-center gap-2">
                <CalendarCheck size={16} />
                {t(lang, "Data", "Date")}
              </h2>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 justify-center">
                {days.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => {
                      setSelectedDate(day.id);
                      setCustomDate("");
                    }}
                    className={`flex flex-col items-center justify-center min-w-[64px] py-2.5 rounded-xl border transition-all ${selectedDate === day.id
                      ? "border-brand-accent bg-brand-accent/10"
                      : "border-gray-700/50 bg-[#121212]/50 hover:bg-white/5"
                      }`}
                  >
                    <span className={`text-[10px] mb-0.5 ${selectedDate === day.id ? "text-brand-accent font-medium" : "text-gray-400"}`}>{day.label}</span>
                    <span className={`text-lg ${selectedDate === day.id ? "font-bold text-brand-accent" : "font-semibold text-white"}`}>{day.date}</span>
                  </button>
                ))}

                {/* Calendar Button */}
                <button
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className={`flex flex-col shrink-0 items-center justify-center min-w-[64px] py-2.5 rounded-xl border transition-all ${customDate ? "border-brand-accent bg-brand-accent/10" : "border-gray-700/50 bg-[#121212]/50 hover:bg-white/5"}`}
                >
                  <span className={`text-[10px] mb-0.5 ${customDate ? "text-brand-accent font-medium" : "text-gray-400"}`}>{customDate ? t(lang, "Alta Data", "Other Date") : t(lang, "Calendar", "Calendar")}</span>
                  <CalendarCheck size={20} className={customDate ? "text-brand-accent" : "text-white"} />
                </button>
              </div>
              <div className="relative">
                {isCalendarOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsCalendarOpen(false)} />
                    <div className="absolute left-0 right-0 top-0 z-40 flex justify-center animate-in fade-in zoom-in-95 duration-200">
                      <div className="bg-[#1A1817] border border-gray-700 rounded-2xl shadow-2xl p-2 max-w-full">
                        <Calendar 
                          onChange={(date: any) => {
                            const val = date.toString();
                            setCustomDate(val);
                            setSelectedDate(val);
                            setIsCalendarOpen(false);
                          }} 
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              {customDate && (
                <p className="mt-1 text-xs text-brand-accent font-medium text-center">{t(lang, `Data selectata: ${new Date(customDate).toLocaleDateString('ro-RO')}`, `Selected date: ${new Date(customDate).toLocaleDateString()}`)}</p>
              )}
            </section>

            {/* Time Selection */}
            <section className="mb-5">
              <div className="flex justify-center items-center mb-2">
                <h2 className="text-sm uppercase tracking-wider text-gray-400 font-medium flex items-center gap-2">
                  <Clock size={16} />
                  {t(lang, "Ora", "Time")}
                </h2>
              </div>
              <div className="flex items-center justify-center bg-[#121212]/50 border border-gray-700/30 rounded-[20px] py-4 px-5 shadow-inner max-w-[200px] mx-auto">
                <input
                  type="text"
                  placeholder="19:00"
                  value={selectedTime}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val.length <= 5) setSelectedTime(val);
                  }}
                  className="w-full bg-transparent text-3xl font-bold text-center text-white focus:outline-none focus:text-brand-accent transition-all placeholder:text-gray-700"
                />
              </div>
            </section>

            {/* Special Requests */}
            <section className="mb-4">
              <h2 className="text-sm uppercase tracking-wider text-gray-400 font-medium mb-2 flex items-center justify-center gap-2">
                <Utensils size={16} />
                {t(lang, "Cerinte Speciale", "Special Requests")}
              </h2>
              <div className="relative mt-1 flex justify-center">
                <input
                  id="requests"
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder={t(lang, "Restrictii alimentare, aniversari...", "Dietary restrictions, celebrations...")}
                  className="block w-full max-w-[280px] border-0 border-b border-gray-700 bg-transparent py-2 px-0 text-white focus:border-brand-accent focus:ring-0 text-base placeholder:text-gray-500 transition-colors text-center"
                />
              </div>
            </section>
          </div>
        </div>

        {/* Fixed Bottom Action */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#1A1817] via-[#1A1817] to-transparent pt-10 pointer-events-none">
          <button
            onClick={handleConfirm}
            disabled={status !== "idle"}
            className={`pointer-events-auto w-full h-[52px] rounded-full text-white font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${status === "success"
              ? "bg-green-500 shadow-[0_8px_32px_rgba(34,197,94,0.3)]"
              : "bg-brand-accent shadow-glow hover:bg-brand-accentHover"
              }`}
          >
            {status === "loading" ? (
              <Loader2 size={24} className="animate-spin" />
            ) : status === "success" ? (
              <Check size={24} className="animate-pop-in" />
            ) : (
              <>
                {t(lang, "Confirma Rezervarea", "Confirm Booking")}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
