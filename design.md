# Directivă de Design Premium pentru Grădina Floreasca
## UI/UX, Estetică și Sisteme de Conversie pentru Stitch

Acest document servește drept ghid arhitectural și estetic complet pentru **Stitch**, având ca scop construirea a trei secțiuni premium pentru site-ul **Grădina Floreasca**:
1. **Pagina de Promovare a Evenimentelor Săptămânale**
2. **Pagina de Saloane de Evenimente (Nunți, Botezuri, Corporate)**
3. **Pagina pentru Terasă & Piscină (Urban Oasis)**

Fiecare dintre aceste pagini trebuie să emane lux, rafinament și exclusivitate, utilizând codul estetic actual al brandului (combinație de culori deep dark, accente de aur șampanie, fonturi elegante, micro-animații fluide și mecanisme de conversie tip iOS care generează lead-uri calificate).

---

## 1. Arhitectura Vizuală & Sistemul Estetic (Aesthetic Tokens)

Pentru a asigura o integrare perfectă cu estetica actuală, Stitch trebuie să respecte cu strictețe următoarele specificații:

### A. Paleta de Culori (The Lux-Dark System)
*   **Fundal Principal (Deep Dark):** `#0F1318` (gri-albăstrui extrem de închis, fluid, care oferă profunzime) și `#0A0B0E` (pentru secțiuni ultra-dark).
*   **Fundal Modale/Carduri (iOS Glass):** `#1A1817` sau `rgba(26, 24, 23, 0.7)` combinat cu `backdrop-blur-xl`.
*   **Accentul de Aur (Champagne Gold):** `#C8A96E` (reprezintă rafinamentul și luxul organic al grădinii).
*   **Hover Accent:** `#B8955A` (un aur mai saturat, patinat).
*   **Glow Shadows:** `shadow-[0_8px_32px_rgba(200,169,110,0.15)]` (o strălucire subtilă, caldă).
*   **High-fidelity Accents:**
    *   *Live Badge / Hot Event:* Crimson Red (`#dc2626` / `#ef4444`) – utilizat pentru a indica evenimente în desfășurare sau "sold out în curând".
    *   *Success Action:* Emerald Green (`#22c55e`) – pentru confirmarea rezervărilor sau trimiterea formularelor.
*   **Culori Text:**
    *   *Titluri:* Alb pur (`#FFFFFF`) sau Gold Champagne (`#C8A96E`).
    *   *Text Principal:* Silver Gray (`#E0E0E0`) pentru lizibilitate excelentă pe fundal închis.
    *   *Text Secundar / Muted:* Slate Muted (`#777777` sau `text-white/40`).
    *   *Borduri subțiri:* `border-white/10` sau `border-white/5` pentru un efect extrem de curat de "glassmorphism".

### B. Tipografia (The Editorial Tone)
*   **Titluri Principale (Hero & Sectiuni):** `font-serif` (folosind **Playfair Display**). Trebuie să folosească kerning generos, uppercase strategic sau elemente cursive (`italic`) pentru a crea un sentiment de poveste, de editorial de modă sau revistă de lifestyle.
*   **Subtitluri, Monitoare & Metadata:** `font-mono` (pentru date, ore, capacități, statusuri live).
*   **Text de Corp & Butoane:** `font-sans` (folosind **Inter**, font curat, modern, geometric).

### C. Dinamică & Micro-Animații (Spring Motion Standards)
Toate tranzițiile trebuie să fie organice și să ofere feedback tactil/vizual excelent.
*   **Intrări în Pagină:** Efect de "slide-up-stagger" (elementele apar pe rând, venind de jos, cu opacitate progresivă).
*   **Spring Configuration (Framer Motion):** 
    ```typescript
    const springTransition = { type: "spring", stiffness: 300, damping: 30; }
    ```
*   **Tranziții Hover:** Butoanele și cardurile se scalează subtil (`scale-[1.02]`), iar strălucirea aurie se intensifică lin (`duration-300`).
*   **Feedback Senzorial (Audio Micro-Feedback):** La confirmarea unei rezervări sau a unui lead, se redă un ton dublu de confirmare de tip iOS (frecvențe de 1200Hz și 1600Hz sintetizate nativ prin Web Audio API) pentru a crea o satisfacție psihologică maximă.

---

## 2. Pagina 1: Promovarea Evenimentelor Săptămânale (Weekly Events)

Această pagină trebuie să funcționeze ca o agendă dinamică, atrăgătoare și exclusivistă. Evenimentele (Sunday Brunch, Garden Jazz Sessions, Sunset Pool Lounge, Wine Tastings) sunt prezentate ca experiențe premium de neratat.

### A. Structura Interfeței (UI Components)
1.  **Secțiunea Hero (The Cinematic Hook):**
    *   Fundal video mut sau imagini de rezoluție înaltă cu grădina luminată la apus, cu un overlay gradient închis (`bg-gradient-to-t from-[#0F1318] via-black/30 to-black/70`).
    *   Titlu: *"Săptămâna aceasta la Grădină"* (`font-serif`, italic, text-center, aur-șampanie).
    *   Subtitlu: *"Experiențe senzoriale sub cerul liber"* (uppercase, tracking-[0.2em]).
2.  **Bara de Filtre Interactive (The Micro-Selector):**
    *   Un selector orizontal curat, cu efect de pastilă de sticlă: `All Events`, `Live Music`, `Gastronomy`, `Pool & Day Vibe`.
    *   Design: `bg-white/5 border border-white/10 rounded-full px-2 py-1.5 flex gap-2`.
3.  **Agenda Săptămânală (Interactive Staggered Cards):**
    *   Carduri organizate pe zile (ex: Joi - Duminică).
    *   Fiecare card are un design asimetric, cu imagine de fundal elegantă, detalii despre artiști/meniu și un badge live de stare.
    *   Stitch va implementa un timeline vertical interactiv pe desktop, unde elementele se activează la scroll, sau un slider orizontal ultra-fluid pe mobile.
4.  **Sistemul de Rezervări Integrat direct în Card:**
    *   Fiecare eveniment are un buton dedicat de CTA: `Rezervă Locul / RSVP` care deschide bottom sheet-ul pre-completat cu data și numele evenimentului.

### B. Mecanisme de Lead Generation & CTA-uri dedicate:
*   **Badge de Urgență (Scarcity Hook):** Fiecare eveniment are un indicator dinamic (`font-mono`): `[ LOCURI LIMITATE: 85% OCUPAT ]` în nuanțe de Crimson Red, pentru a induce FOMO (Fear Of Missing Out).
*   **Bilet Digital RSVP:** La apăsarea pe butonul RSVP, utilizatorul nu doar completează formularul, ci primește un vizual tip "Wallet Ticket" cu detalii, generând entuziasm.
*   **Quick WhatsApp RSVP:** Un buton secundar elegant, fin, cu pictograma WhatsApp, care deschide o conversație directă cu mesajul: *"Bună! Doresc să rezerv o masă pentru evenimentul [Nume Eveniment] de pe [Dată]."*

---

## 3. Pagina 2: Saloane de Evenimente (Weddings, Baptisms & Corporate)

Această pagină trebuie să arate ca un catalog de arhitectură și design interior. Saloanele (Pavilionul Floreasca, Salonul Grand Ballroom, Terasa Mare) trebuie prezentate ca spații modulare, versatile și ultra-elegante.

### A. Structura Interfeței (UI Components)
1.  **Secțiunea Hero (The Grand Entrance):**
    *   O imagine panoramică, statică sau un video panning ultra-lent cu Salonul aranjat pentru o nuntă de lux.
    *   Text: *"Unde momentele devin legendare. Spații dedicate evenimentelor memorabile."*
2.  **Showcase-ul Saloanelor (Splitted Layout Showroom):**
    *   Layout alternat stânga-dreapta. Pe o parte: imagini de înaltă rezoluție cu un slider interactiv (înainte/după, sau unghiuri diferite: Setup Nuntă vs. Setup Corporate). Pe cealaltă parte: tipografie elegantă serif, detalii tehnice prezentate sub formă de tabel curat.
    *   **Tabelul cu specificații tehnice (design ultra-fin):**
        *   Capacitate (Format Banquet, Cocktail, Teatru).
        *   Facilități (Sistem sunet L-Acoustics, Lumini inteligente, Parcare privată, Grădină proprie).
3.  **Calculatorul de Eveniment Interactiv (The Lead Magnet Widget):**
    *   Un asistent vizual pas cu pas (multi-step widget) extrem de elegant, unde clientul poate alege:
        *   Pasul 1: *Tipul Evenimentului* (Nuntă, Botez, Petrecere Privată, Conferință Corporate).
        *   Pasul 2: *Numărul Estimat de Oaspeți* (slider interactiv cu feedback vizual instant pentru salonul recomandat).
        *   Pasul 3: *Servicii Dorite* (Catering premium, Open Bar, Setup Floral, DJ & Sound).
        *   Pasul 4: *Formularul de Contact Premium* (Nume, Telefon, Data dorită) -> Trimitere Supabase.

### B. Mecanisme de Lead Generation & CTA-uri dedicate:
*   **Descarcă Broșura Premium:** În loc de un simplu buton de descărcare, pentru a accesa PDF-ul cu prețuri și meniuri de eveniment, utilizatorul trebuie să își introducă e-mail-ul și numărul de telefon. Aceasta este cea mai puternică sursă de lead-uri calificate!
*   **Mărturii & Social Proof (Secțiunea de Poveste):** Integrarea unor recenzii specifice pentru nunți/corporate, cu imagini reale ale mirilor/companiilor, în formatul de carduri din sticlă din `App.tsx`.
*   **Virtual Tour Option:** CTA proeminent: `Solicită Tur Virtual sau Vizionare Fizică` care deschide un calendar rapid pentru stabilirea unei întâlniri cu Event Managerul.

---

## 4. Pagina 3: Terasă & Piscină (Urban Oasis & Pool Lounge)

Această secțiune trebuie să transmită relaxare, prospețime, atmosferă exotică și evadare urbană. Este oaza de liniște din mijlocul orașului.

### A. Structura Interfeței (UI Components)
1.  **Hero - Sunset Vibe (The Poolfront Escape):**
    *   Fundal cu apa piscinei strălucind la soare.
    *   Slogan: *"Evadare urbană. Terasă plină de verdeață & piscină cu vibe exotic."*
2.  **Sistemul de Rezervare Șezlong / Baldachin (The Sunbed Widget):**
    *   Un grid vizual stilizat reprezentând piscina și șezlongurile/baldachinele disponibile.
    *   Utilizatorul poate selecta zona dorită (VIP, Poolside, Garden Lounge) și data, văzând în timp real disponibilitatea (badges verzi/roșii).
3.  **Menu Peek (The Gastronomy Preview):**
    *   Un meniu interactiv de cocktailuri semnătură și preparate fresh de vară (salate, sushi, sharing platters).
    *   Carduri cu imagini rotunde care se rotesc subtil la hover, cu ingrediente detaliate și filtre de alergeni (folosind sistemul de filtre deja existent în `App.tsx`).

### B. Mecanisme de Lead Generation & CTA-uri dedicate:
*   **Rezervă un Șezlong / Baldachin (Instant Booking Lead):** CTA principal care trimite direct la modalul de rezervare cu plata/avansul sau garantarea prin telefon.
*   **Weather-triggered Banner (Mecanism Inteligent de Conversie):** Un widget discret conectat la o API de vreme (sau simulat premium) care afișează: *"Astăzi sunt 28°C în București. Apa are 25°C. Rezervă-ți acum ultimul baldachin!"* pentru a genera conversie impulsivă.
*   **Abonamente Pool Pass:** Secțiune de lead-uri pentru abonamente lunare sau sezoniere, cu formular dedicat: `Solicită Ofertă Abonament Pool 2026`.

---

## 5. Standardul de Conversie: Formularele și Bottom Sheet-ul iOS

Stitch trebuie să implementeze toate formularele de captare a lead-urilor folosind structura de succes din `ReservationModal.tsx`. Aceste detalii fac diferența între un site obișnuit și unul **ultra-premium**:

### A. Proprietățile Modalelor & Formularelor (iOS Sheet Style)
*   **Mobile-First Bottom Sheet:** Pe ecrane mobile, formularul glisează de jos în sus, având un mâner tactil discret pentru închidere prin glisare în jos (`swipe-to-dismiss`).
*   **Desktop Centered Modal:** Pe desktop, se poziționează în centrul ecranului cu un blur elegant în spate (`backdrop-blur-md bg-black/60`).
*   **Câmpuri de Input Text Minimaliste:** Fără chenare groase. Doar o linie fină aurie sau argintie care se activează cu o tranziție lină la focus:
    ```tailwind
    border-0 border-b border-gray-700 bg-transparent focus:border-brand-accent focus:ring-0 text-center
    ```
*   **Controlul Persoanelor/Opțiunilor prin Butoane Rotunde (Pastile):** Utilizatorul nu trebuie să scrie numărul de persoane, ci să apese pe cercuri elegante (`w-12 h-12 rounded-full border border-gray-700/50 hover:bg-white/5`), exact ca în modalul actual.

### B. Succesul Apple Pay (The Dopamine Loop)
Când formularul este trimis cu succes către baza de date Supabase, Stitch trebuie să ascundă formularul și să activeze ecranul de succes instant:
1.  **Micro-sunet de confirmare:** Generat nativ prin Web Audio API (fără a încărca fișiere externe).
2.  **Efectul Confetti:** Explozie festivă controlată folosind `canvas-confetti` cu culorile brandului (auriu, alb, negru).
3.  **Bifă Animată (Success Icon):** O animație de pop-in pentru cercul verde cu bifa albă, oferind utilizatorului un sentiment clar de realizare.

---

## 6. Ghid Tehnic pentru Stitch (Snippets de Implementare)

Pentru a asigura calitatea codului și implementarea corectă, oferim următoarele șabloane tehnice pe care Stitch le poate folosi:

### A. Generatorul Nativ de Sunet (Web Audio API Success Sound)
Stitch trebuie să integreze această funcție în toate acțiunile de succes din formulare:
```typescript
const playSuccessSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
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
    playTone(1200, now, 0.15); // Primul ton scurt și înalt
    playTone(1600, now + 0.12, 0.3); // Al doilea ton de confirmare
  } catch (e) {
    console.error("Audio feedback error:", e);
  }
};
```

### B. Structura pentru Baza de Date Supabase (Tabelele de Lead-uri)
Toate acțiunile utilizatorilor trebuie stocate structurat în Supabase pentru a fi accesate din panoul de administrare. Stitch va folosi tabelele:
1.  `reservations` (pentru mese, șezlonguri, baldachine, evenimente săptămânale).
2.  `event_inquiries` (pentru solicitările complexe de evenimente private din calculatorul de bugete).

Schema de inserare pentru evenimente private:
```typescript
const handleEventInquiry = async (inquiryData) => {
  const { error } = await supabase.from('event_inquiries').insert([{
    client_name: inquiryData.name,
    client_phone: inquiryData.phone,
    client_email: inquiryData.email,
    event_type: inquiryData.type,
    guest_count: parseInt(inquiryData.guests),
    estimated_date: inquiryData.date,
    selected_services: inquiryData.services,
    status: 'new_lead'
  }]);
  
  if (error) throw error;
  playSuccessSound();
  // Trigger Confetti!
};
```

### C. Stilul Tailwind pentru Pastilele de Sticlă Premium (Glassmorphism)
Stitch va folosi acest stil pentru cardurile de evenimente și meniuri:
```html
<div class="bg-white/10 backdrop-blur-xl border border-white/20 hover:border-brand-accent/50 hover:shadow-[0_8px_32px_rgba(200,169,110,0.15)] rounded-3xl p-6 transition-all duration-500 ease-out">
  <!-- Content -->
</div>
```

---

## 7. Planul de Lansare și Integrare în Navigație
Stitch va adăuga aceste noi secțiuni în componenta principală `App.tsx`, extinzând stările din `activeView` și actualizând header-ul și meniul mobil cu legături fluide către:
*   `events` (Evenimente Săptămânale)
*   `salons` (Saloane & Evenimente Private)
*   `pool-terrace` (Terasă & Piscină)

Prin respectarea acestui ghid de design, Stitch va livra o experiență digitală premium care reflectă standardele fizice ale locației **Grădina Floreasca**, captând în mod eficient dorințele utilizatorilor și transformându-le în lead-uri comerciale de mare valoare.
