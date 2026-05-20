< !DOCTYPE html >

    <html class="dark" lang="ro"><head>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Experiențe la Grădină - Grădina Floreasca</title>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&amp;family=Inter:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
        <script id="tailwind-config">
            tailwind.config = {
                darkMode: "class",
            theme: {
                extend: {
                "colors": {
                "on-primary-fixed-variant": "#594312",
            "on-secondary-fixed-variant": "#43474d",
            "on-error": "#690005",
            "tertiary-fixed-dim": "#b8c5f0",
            "on-primary-fixed": "#261900",
            "primary-fixed-dim": "#e3c285",
            "slate-muted": "#777777",
            "inverse-primary": "#735b28",
            "on-secondary-container": "#b2b5bc",
            "tertiary-fixed": "#dae2ff",
            "surface-container-high": "#2d2925",
            "secondary": "#c3c6ce",
            "surface": "#16130f",
            "secondary-container": "#43474d",
            "error-container": "#93000a",
            "primary-container": "#c8a96e",
            "on-secondary": "#2d3136",
            "secondary-fixed-dim": "#c3c6ce",
            "inverse-on-surface": "#33302b",
            "tertiary-container": "#9facd5",
            "inverse-surface": "#e9e1da",
            "surface-variant": "#38342f",
            "secondary-fixed": "#e0e2ea",
            "surface-container-lowest": "#100e0a",
            "tertiary": "#bac7f2",
            "champagne-gold": "#C8A96E",
            "surface-tint": "#e3c285",
            "outline": "#998f81",
            "surface-container-highest": "#38342f",
            "success-emerald": "#22C55E",
            "surface-container-low": "#1e1b17",
            "on-background": "#e9e1da",
            "on-primary": "#402d00",
            "on-tertiary": "#222f51",
            "on-tertiary-container": "#334063",
            "surface-dim": "#16130f",
            "outline-variant": "#4d463a",
            "on-error-container": "#ffdad6",
            "primary-fixed": "#ffdea3",
            "gold-hover": "#B8955A",
            "deep-dark": "#0F1318",
            "glass-surface": "rgba(26, 24, 23, 0.7)",
            "on-tertiary-fixed-variant": "#394669",
            "on-tertiary-fixed": "#0b1a3b",
            "surface-bright": "#3c3934",
            "on-primary-container": "#533d0c",
            "error": "#ffb4ab",
            "primary": "#e5c487",
            "on-surface-variant": "#d0c5b5",
            "silver-gray": "#E0E0E0",
            "background": "#16130f",
            "surface-container": "#221f1b",
            "ultra-dark": "#0A0B0E",
            "live-badge": "#DC2626",
            "on-secondary-fixed": "#181c21",
            "on-surface": "#e9e1da"
                    },
            "borderRadius": {
                "DEFAULT": "0.25rem",
            "lg": "0.5rem",
            "xl": "0.75rem",
            "full": "9999px"
                    },
            "spacing": {
                "stack-lg": "32px",
            "section-gap": "120px",
            "margin-mobile": "20px",
            "gutter": "24px",
            "margin-desktop": "80px",
            "stack-sm": "8px",
            "stack-md": "16px"
                    },
            "fontFamily": {
                "body-large": ["Inter"],
            "body-main": ["Inter"],
            "button-text": ["Inter"],
            "display-hero": ["Playfair Display"],
            "headline-section": ["Playfair Display"],
            "display-hero-mobile": ["Playfair Display"],
            "label-mono": ["JetBrains Mono"]
                    },
            "fontSize": {
                "body-large": ["18px", {"lineHeight": "1.6", "fontWeight": "400" }],
            "body-main": ["16px", {"lineHeight": "1.5", "fontWeight": "400" }],
            "button-text": ["14px", {"lineHeight": "1", "letterSpacing": "0.03em", "fontWeight": "600" }],
            "display-hero": ["64px", {"lineHeight": "1.1", "letterSpacing": "0.02em", "fontWeight": "700" }],
            "headline-section": ["32px", {"lineHeight": "1.3", "fontWeight": "600" }],
            "display-hero-mobile": ["40px", {"lineHeight": "1.2", "fontWeight": "700" }],
            "label-mono": ["12px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "500" }]
                    }
                }
            }
        }
        </script>
        <style>
            .glass-panel {
                background: rgba(26, 24, 23, 0.7);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
            .glow-hover:hover {
                box - shadow: 0 4px 30px rgba(200, 169, 110, 0.15);
        }
            .text-glow {
                text - shadow: 0 0 20px rgba(200, 169, 110, 0.3);
        }
            .reveal-up {
                opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
            .reveal-up.active {
                opacity: 1;
            transform: translateY(0);
        }
            .bottom-sheet-enter {
                transform: translateY(100%);
        }
            .bottom-sheet-enter-active {
                transform: translateY(0);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
            .bottom-sheet-exit {
                transform: translateY(0);
        }
            .bottom-sheet-exit-active {
                transform: translateY(100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
            .backdrop-enter {
                opacity: 0;
        }
            .backdrop-enter-active {
                opacity: 1;
            transition: opacity 0.3s ease;
        }
            .backdrop-exit {
                opacity: 1;
        }
            .backdrop-exit-active {
                opacity: 0;
            transition: opacity 0.3s ease;
        }
        </style>
    </head>
        <body class="bg-deep-dark text-on-surface font-body-main antialiased selection:bg-champagne-gold selection:text-deep-dark min-h-screen flex flex-col">
            <!-- TopNavBar -->
            <nav class="fixed top-0 w-full z-50 bg-glass-surface backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(200,169,110,0.15)] transition-all duration-300 ease-in-out">
                <div class="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-stack-md max-w-full mx-auto">
                    <a class="font-display-hero text-headline-section text-champagne-gold" href="#">Grădina Floreasca</a>
                    <div class="hidden md:flex items-center gap-stack-lg">
                        <a class="font-body-main text-body-main text-champagne-gold border-b-2 border-champagne-gold pb-1 transition-all duration-300 ease-in-out" href="#">Events</a>
                        <a class="font-body-main text-body-main text-on-surface-variant hover:text-champagne-gold hover:scale-105 transition-transform duration-300 ease-in-out" href="#">Salons</a>
                        <a class="font-body-main text-body-main text-on-surface-variant hover:text-champagne-gold hover:scale-105 transition-transform duration-300 ease-in-out" href="#">Pool &amp; Terrace</a>
                    </div>
                    <button class="hidden md:inline-flex items-center justify-center bg-champagne-gold text-on-primary-container font-button-text text-button-text px-6 py-3 rounded-full hover:scale-105 transition-transform duration-300">
                        Book Now
                    </button>
                    <button class="md:hidden text-champagne-gold p-2">
                        <span class="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </nav>
            <main class="flex-grow pt-[80px] md:pt-[100px]">
                <!-- Cinematic Hero -->
                <header class="relative w-full h-[80vh] min-h-[600px] flex flex-col justify-center px-margin-mobile md:px-margin-desktop overflow-hidden">
                    <div class="absolute inset-0 z-0">
                        <img alt="Cinematic Hero Image" class="w-full h-full object-cover opacity-50 scale-105 animate-[pulse_10s_ease-in-out_infinite_alternate]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmtYbE3A6z_LYBm3tpG1GXf_CTNpWbwowm4oMIxAXnoPt8jilfvFQXH2BVMd1oxtuog6HTHl8K8ei9J_6wu68HbpK4jg8tze_ncriNkLtCZxhaWUd4jJtpSYx-gFEZeTQPZ2Va_CWvN16rEoyQMWnEF9EEJw8CNoLL2fdR0leU2IZweEjhNILyJXBJdU1NiIIfiMWNhkDALu5nQL1wJIsJoZEhKVqSHY4AatCIMeg54nT-NCUUQWPZmTc0WHpKGsucjOUXIrQRCq8" />
                        <div class="absolute inset-0 bg-gradient-to-b from-deep-dark/40 via-deep-dark/60 to-deep-dark"></div>
                    </div>
                    <div class="relative z-10 max-w-5xl mx-auto text-center reveal-up">
                        <span class="inline-block font-label-mono text-label-mono text-champagne-gold uppercase tracking-[0.2em] mb-stack-lg">
                            Terasă &amp; Piscină
                        </span>
                        <h1 class="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-[84px] text-white mb-stack-lg leading-tight text-glow">
                            Colecția de Experiențe<br /><span class="italic text-champagne-gold">Săptămânale</span>
                        </h1>
                        <p class="font-body-large text-body-large text-on-surface-variant max-w-3xl mx-auto">
                            Redefinim evadarea urbană printr-o selecție curată de momente multisenzoriale. De la zorii liniștiți până la vibrația eclectică a serilor târzii, fiecare eveniment este o invitație la hedonism rafinat în inima orașului.
                        </p>
                    </div>
                </header>
                <!-- Event: Seri de Film -->
                <section class="py-section-gap px-margin-mobile md:px-margin-desktop relative">
                    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                        <div class="w-full lg:w-1/2 relative h-[500px] lg:h-[700px] rounded-2xl overflow-hidden group reveal-up">
                            <img alt="Seri de Film sub Stele" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj-3N5Np3X_YMDO3EzBF0MXhziPzxvB_B7OVE5BVOO7MQssMvapVzj5GW6X-NaQ_9SpiZZPW1PcfyI9niH2zZSABj5EgVQlPYp3VAcR_kVDETls4ngpgSS_zdFyuk15T7A8yhejx46IK7gIiwaFs01Zo5Ra3RjSR5RxBsgiF2cvqPSFUej7wobNRxHK6OCmRSSICx2HLXKl_MyFhsjU03eSvlAbctO8Qy9sGK8C9G5YRJrJf2Qwo03i9nUQ-Hc9emwIFyXHI8yRu0" />
                            <div class="absolute inset-0 bg-gradient-to-t from-deep-dark to-transparent"></div>
                        </div>
                        <div class="w-full lg:w-1/2 flex flex-col gap-6 reveal-up" style="transition-delay: 200ms;">
                            <div class="flex items-center gap-4">
                                <span class="w-12 h-[1px] bg-champagne-gold"></span>
                                <span class="font-label-mono text-label-mono text-champagne-gold uppercase tracking-widest">Miercuri, 21:00</span>
                            </div>
                            <h2 class="font-headline-section text-[48px] text-white leading-tight">Seri de Film <span class="italic text-champagne-gold">sub Stele</span></h2>
                            <p class="font-body-large text-on-surface-variant">
                                Transformăm vizionarea unui film într-o experiență cinematică absolută. Scufundă-te în confortul șezlongurilor noastre premium, sub un baldachin de stele și lumini ambientale calde, în timp ce ecranul prinde viață.
                            </p>
                            <p class="font-body-main text-slate-muted mb-4">
                                Atmosfera este completată de un meniu gourmet dedicat: popcorn trufat, platouri artizanale cu brânzeturi fine și o selecție de vinuri rare, servite impecabil pentru a acompania capodoperele cinematografice ale serii.
                            </p>
                            <button class="w-max px-8 py-4 border border-champagne-gold text-champagne-gold rounded-full font-button-text hover:bg-champagne-gold hover:text-deep-dark transition-all duration-300" onclick="openRSVP('Seri de Film sub Stele')">
                                Rezervă Experiența
                            </button>
                        </div>
                    </div>
                </section>
                <!-- Event: Sunset DJ -->
                <section class="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-lowest relative">
                    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-16">
                        <div class="w-full lg:w-1/2 relative h-[500px] lg:h-[700px] rounded-2xl overflow-hidden group reveal-up">
                            <img alt="Sunset DJ Sessions" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdsFI_f3zuTdgCCLpsM04Jz9CMDPa4iSDAZLdrElbrgmkrXyW7SMSFeHFk40P_sLJ2K997RWzNM0MIM69mFmorLdHHLFg1XA0DIl_B9_Ht9KEu7VFe0X68sokYgd6YfDvJsIEAIx7Lkg24dMWm9JmaSqfFy8Uy1lRxVifpC_P9C3PRPmUUghVwsgJq5Xo8Qar0u74giFEjutevlzd2N_wpZiKK1xCUQd3CsJzIxPOvEi8gj9l_qd9AvHz3n0x037_i1SfIDBxPrFE" />
                            <div class="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent"></div>
                        </div>
                        <div class="w-full lg:w-1/2 flex flex-col gap-6 reveal-up" style="transition-delay: 200ms;">
                            <div class="flex items-center gap-4">
                                <span class="w-12 h-[1px] bg-champagne-gold"></span>
                                <span class="font-label-mono text-label-mono text-champagne-gold uppercase tracking-widest">Vineri &amp; Sâmbătă, 18:00</span>
                            </div>
                            <h2 class="font-headline-section text-[48px] text-white leading-tight">Sunset DJ <span class="italic text-champagne-gold">Sessions</span></h2>
                            <p class="font-body-large text-on-surface-variant">
                                Tranziția perfectă de la zi la noapte. Pe măsură ce soarele apune, aruncând reflexii aurii pe suprafața piscinei, energia locului se metamorfozează.
                            </p>
                            <p class="font-body-main text-slate-muted mb-4">
                                Ritmuri exotice de deep și organic house dictate de DJ-ii noștri rezidenți, acompaniate de mixologia de avangardă de la barul exterior. Degustă cocktailuri signature infuzate cu botanice proaspete, într-o atmosferă vibrantă, cosmopolită, definită de un lux efervescent.
                            </p>
                            <button class="w-max px-8 py-4 border border-champagne-gold text-champagne-gold rounded-full font-button-text hover:bg-champagne-gold hover:text-deep-dark transition-all duration-300" onclick="openRSVP('Sunset DJ Sessions')">
                                Alătură-te Petrecerii
                            </button>
                        </div>
                    </div>
                </section>
                <!-- Event: Morning Yoga -->
                <section class="py-section-gap px-margin-mobile md:px-margin-desktop relative">
                    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                        <div class="w-full lg:w-1/2 relative h-[500px] lg:h-[700px] rounded-2xl overflow-hidden group reveal-up">
                            <img alt="Morning Yoga &amp; Mindfulness" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL5Htx_TMBagRvUmZUet-4_RyFI5pZUtT0T_dPRJMt-IoZ46bFujf5FIpbr0v4uRIMQvdLpUzU7_PO1OHrynYh7Xpa2d6JS9NtYfb3og33YpxekG86emVqQWrgF2VvkaV9-h0LGQ7Ax2mRFn6jLAH0-8avbfH7G9dY_EYCp5o5c0gVh9hyl2A8ItT9cqOPiljfoYpKt0jT5K8oDKpjhJSr0psISeARSdFNxQ4uaaPoXIbJGIyMlJ4p6anXZ7QJQQlg_35pBjjrg10" />
                            <div class="absolute inset-0 bg-gradient-to-t from-deep-dark to-transparent"></div>
                        </div>
                        <div class="w-full lg:w-1/2 flex flex-col gap-6 reveal-up" style="transition-delay: 200ms;">
                            <div class="flex items-center gap-4">
                                <span class="w-12 h-[1px] bg-champagne-gold"></span>
                                <span class="font-label-mono text-label-mono text-champagne-gold uppercase tracking-widest">Duminică, 09:00</span>
                            </div>
                            <h2 class="font-headline-section text-[48px] text-white leading-tight">Morning Yoga &amp; <span class="italic text-champagne-gold">Mindfulness</span></h2>
                            <p class="font-body-large text-on-surface-variant">
                                Un sanctuar al liniștii la primele ore ale dimineții. Găsește-ți echilibrul în oaza noastră verde, înainte ca orașul să se trezească.
                            </p>
                            <p class="font-body-main text-slate-muted mb-4">
                                Sesiuni de yoga ghidate de instructori de elită, desfășurate pe peluza de lângă piscină. Experiența este urmată de un mic dejun revitalizant: sucuri cold-pressed, smoothie bowls cu super-alimente și ceaiuri artizanale, gândite pentru o refacere completă a minții și corpului.
                            </p>
                            <button class="w-max px-8 py-4 border border-champagne-gold text-champagne-gold rounded-full font-button-text hover:bg-champagne-gold hover:text-deep-dark transition-all duration-300" onclick="openRSVP('Morning Yoga &amp; Mindfulness')">
                                Rezervă un Covoraș
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <!-- Footer -->
            <footer class="w-full py-section-gap bg-surface-container-lowest border-t border-white/10 transition-opacity duration-200">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter px-margin-mobile md:px-margin-desktop">
                    <div class="col-span-1 md:col-span-4 flex flex-col gap-stack-md">
                        <span class="font-display-hero text-headline-section text-champagne-gold">Grădina Floreasca</span>
                        <p class="font-body-main text-body-main text-on-surface-variant">© 2024 Grădina Floreasca. All rights reserved.</p>
                    </div>
                    <div class="col-span-1 md:col-span-8 flex flex-wrap gap-x-gutter gap-y-stack-sm md:justify-end items-center">
                        <a class="font-body-main text-body-main text-on-surface-variant hover:text-champagne-gold transition-colors" href="#">Privacy Policy</a>
                        <a class="font-body-main text-body-main text-on-surface-variant hover:text-champagne-gold transition-colors" href="#">Terms of Service</a>
                        <a class="font-body-main text-body-main text-on-surface-variant hover:text-champagne-gold transition-colors" href="#">Contact</a>
                        <a class="font-body-main text-body-main text-on-surface-variant hover:text-champagne-gold transition-colors" href="#">Location</a>
                    </div>
                </div>
            </footer>
            <!-- RSVP Bottom Sheet (iOS Style) -->
            <div class="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] hidden opacity-0 transition-opacity duration-300" id="rsvpBackdrop" onclick="closeRSVP()"></div>
            <div class="fixed bottom-0 left-0 right-0 md:inset-0 md:m-auto z-[101] md:w-full md:max-w-2xl bg-surface-container-high md:bg-glass-surface md:backdrop-blur-2xl rounded-t-3xl md:rounded-3xl border-t md:border border-white/10 p-margin-mobile md:p-[48px] transform translate-y-full md:translate-y-0 md:scale-95 md:opacity-0 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] max-h-[90vh] overflow-y-auto" id="rsvpSheet">
                <!-- Drag Handle (Mobile only) -->
                <div class="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-stack-md md:hidden"></div>
                <div class="flex justify-between items-center mb-stack-lg">
                    <h2 class="font-display-hero-mobile text-[32px] text-champagne-gold" id="rsvpTitle">RSVP</h2>
                    <button class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-white/10 transition-colors" onclick="closeRSVP()">
                        <span class="material-symbols-outlined text-[24px]">close</span>
                    </button>
                </div>
                <form class="flex flex-col gap-6" onsubmit="event.preventDefault(); submitRSVP();">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block font-label-mono text-[10px] text-on-surface-variant mb-2 uppercase tracking-[0.1em]">Nume Complet</label>
                            <input class="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-champagne-gold focus:ring-0 transition-colors font-body-main" placeholder="Ex: Alexandru Popescu" required="" type="text" />
                        </div>
                        <div>
                            <label class="block font-label-mono text-[10px] text-on-surface-variant mb-2 uppercase tracking-[0.1em]">Telefon</label>
                            <input class="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-champagne-gold focus:ring-0 transition-colors font-body-main" placeholder="+40 7xx xxx xxx" required="" type="tel" />
                        </div>
                    </div>
                    <div>
                        <label class="block font-label-mono text-[10px] text-on-surface-variant mb-2 uppercase tracking-[0.1em]">Selectează Evenimentul</label>
                        <select class="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-champagne-gold focus:ring-0 transition-colors font-body-main appearance-none" id="eventSelect">
                            <option class="bg-deep-dark text-white" value="film">Seri de Film sub Stele</option>
                            <option class="bg-deep-dark text-white" value="dj">Sunset DJ Sessions</option>
                            <option class="bg-deep-dark text-white" value="yoga">Morning Yoga &amp; Mindfulness</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-label-mono text-[10px] text-on-surface-variant mb-2 uppercase tracking-[0.1em]">Număr de Persoane</label>
                        <select class="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-champagne-gold focus:ring-0 transition-colors font-body-main appearance-none">
                            <option class="bg-deep-dark text-white" value="1">1 Persoană</option>
                            <option class="bg-deep-dark text-white" selected="" value="2">2 Persoane</option>
                            <option class="bg-deep-dark text-white" value="3">3 Persoane</option>
                            <option class="bg-deep-dark text-white" value="4">4 Persoane</option>
                            <option class="bg-deep-dark text-white" value="group">Grup (5+ Persoane)</option>
                        </select>
                    </div>
                    <button class="w-full bg-champagne-gold text-deep-dark font-button-text text-button-text py-5 rounded-none mt-4 hover:bg-gold-hover transition-colors tracking-wide uppercase" type="submit">
                        Confirmă Rezervarea
                    </button>
                </form>
            </div>
            <!-- Scripts -->
            <script>
        // Scroll Reveal
                const observerOptions = {
                    root: null,
                rootMargin: '0px',
                threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('active');
                            observer.unobserve(entry.target);
                        }
                    });
        }, observerOptions);

        document.querySelectorAll('.reveal-up').forEach(el => {
                    observer.observe(el);
        });

                // RSVP Logic
                const backdrop = document.getElementById('rsvpBackdrop');
                const sheet = document.getElementById('rsvpSheet');
                const eventSelect = document.getElementById('eventSelect');

                function openRSVP(eventName) {
            if(eventName) {
                // Auto-select event if passed
                const options = Array.from(eventSelect.options);
                const match = options.find(opt => opt.text === eventName);
                if(match) eventSelect.value = match.value;
            }

                backdrop.classList.remove('hidden');
                void backdrop.offsetWidth;

                backdrop.classList.remove('opacity-0');
            
            if (window.innerWidth >= 768) {
                    sheet.classList.remove('md:scale-95', 'md:opacity-0');
            } else {
                    sheet.classList.remove('translate-y-full');
            }

                document.body.style.overflow = 'hidden';
        }

                function closeRSVP() {
                    backdrop.classList.add('opacity-0');
            
            if (window.innerWidth >= 768) {
                    sheet.classList.add('md:scale-95', 'md:opacity-0');
            } else {
                    sheet.classList.add('translate-y-full');
            }

                document.body.style.overflow = '';
            
            setTimeout(() => {
                    backdrop.classList.add('hidden');
            }, 300);
        }

                function submitRSVP() {
            const btn = sheet.querySelector('button[type="submit"]');
                const originalText = btn.textContent;

                btn.innerHTML = `<span class="material-symbols-outlined animate-spin">sync</span>`;
            
            setTimeout(() => {
                    btn.innerHTML = `Rezervare Confirmată`;
                btn.classList.replace('bg-champagne-gold', 'bg-success-emerald');
                btn.classList.replace('text-deep-dark', 'text-white');
                btn.classList.replace('hover:bg-gold-hover', 'hover:bg-success-emerald');
                
                setTimeout(() => {
                    closeRSVP();
                    setTimeout(() => {
                    btn.textContent = originalText;
                btn.classList.replace('bg-success-emerald', 'bg-champagne-gold');
                btn.classList.replace('text-white', 'text-deep-dark');
                btn.classList.replace('hover:bg-success-emerald', 'hover:bg-gold-hover');
                sheet.querySelector('form').reset();
                    }, 400);
                }, 1500);
            }, 1000);
        }
            </script>
        </body></html>