import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react"
declare global {
  interface Window {
    tailwind?: {
      config?: any;
    };
  }
}

export {};

import React, { useState, useEffect, useRef } from "react";
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

// --- CONFIGURARE TAILWIND ---
const injectTailwind = () => {
  if (!document.getElementById("tailwind-script")) {
    const script = document.createElement("script");
    script.id = "tailwind-script";
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ["Inter", "sans-serif"],
              serif: ["Playfair Display", "serif"],
            },
            colors: {
              brand: {
                bg: "#F8F7F5",
                dark: "#121212",
                accent: "#D96C27",
                accentHover: "#BA5A1E",
                teal: "#2A6B70",
                textMain: "#222222",
                textMuted: "#777777",
                border: "#EAEAEA",
              },
            },
            boxShadow: {
              glow: "0 8px 32px rgba(217, 108, 39, 0.25)",
              float: "0 -16px 40px rgba(0, 0, 0, 0.8)",
            },
          },
        },
      };
    };
  }
};

// --- HELPER TRADUCERE ---
const t = (lang: string, ro: string, en: string) => (lang === "RO" ? ro : en);
// --- BAZA DE DATE MENIU REFRESH ---

const getMenuCategories = (lang: string) => [
  { id: "antipaste", name: t(lang, "Antipaste & Supe", "Appetizers & Soups") },
  { id: "pizza", name: t(lang, "Pizza & Focaccia", "Pizza & Focaccia") },
  { id: "paste", name: t(lang, "Paste & Risotto", "Pasta & Risotto") },
  { id: "carne", name: t(lang, "Carne & Pește", "Meat & Fish") },
  { id: "salate", name: t(lang, "Salate & Garnituri", "Salads & Sides") },
  { id: "desert", name: t(lang, "Desert", "Desserts") },
  { id: "bauturi", name: t(lang, "Băuturi & Cafea", "Drinks & Coffee") },
  { id: "bar", name: t(lang, "Vinuri & Bar", "Wines & Bar") },
];

const getMenuData = (lang: string) => ({
  antipaste: [
    {
      name: "Burrata",
      price: "49 Lei",
      desc: t(
        lang,
        "Burrata proaspătă, roșii cherry, rucola, ulei de măsline extravirgin (150/50/50g).",
        "Fresh burrata, cherry tomatoes, arugula, extra virgin olive oil (150/50/50g)."
      ),
      image:
        "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "420 kcal",
        prot: "18g",
        carb: "5g",
        fat: "32g",
        allergens: "Lactoză",
      },
    },
    {
      name: "Gustare Rece / 2 pers",
      price: "65 Lei",
      desc: t(
        lang,
        "Salam napoletan, salam picant, prosciutto crudo, măsline, gorgonzola, parmezan, mozzarella, struguri, măr (100/100/50g).",
        "Napoletano salami, spicy salami, prosciutto, olives, gorgonzola, parmesan, mozzarella, grapes, apple (100/100/50g)."
      ),
      image:
        "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "850 kcal",
        prot: "45g",
        carb: "20g",
        fat: "65g",
        allergens: t(lang, "Lactoză", "Lactose"),
      },
    },
    {
      name: "Humus cu lipie / Tzatziki",
      price: "38 Lei",
      desc: t(
        lang,
        "Iaurt grecesc cu castraveți și usturoi SAU pastă fină de năut cu tahini. Servite cu lipie (200/50g).",
        "Greek yogurt with cucumber and garlic OR smooth chickpea hummus. Served with pita (200/50g)."
      ),
      image:
        "https://images.unsplash.com/photo-1627308595229-7830f5c92f7b?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "380 kcal",
        prot: "12g",
        carb: "45g",
        fat: "18g",
        allergens: t(lang, "Gluten, Susan/Lactoză", "Gluten, Sesame/Lactose"),
      },
    },
    {
      name: "Ouă cu bacon și cartofi",
      price: "45 Lei",
      desc: t(
        lang,
        "Ouă, ceapă, ardei, cârnați, șuncă, cașcaval. Până la ora 14:00 (200g).",
        "Eggs, onions, peppers, sausages, ham, cheese. Served until 14:00 (200g)."
      ),
      image:
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "650 kcal",
        prot: "28g",
        carb: "35g",
        fat: "42g",
        allergens: t(lang, "Ouă, Lactoză", "Eggs, Lactose"),
      },
    },
    {
      name: "Panini prosciutto / salam / mortadella",
      price: "35 Lei",
      desc: t(
        lang,
        "Panini la alegere (mortadella/salam picant/prosciutto), cu roșie, salată, mozzarella sau cașcaval (200g).",
        "Choice of panini (mortadella/spicy salami/prosciutto), with tomato, salad, mozzarella or cheese (200g)."
      ),
      image:
        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "520 kcal",
        prot: "22g",
        carb: "55g",
        fat: "24g",
        allergens: t(lang, "Gluten, Lactoză", "Gluten, Lactose"),
      },
    },
    {
      name: "Ciorbă văcuță / Ciorba casei",
      price: "30 / 32 Lei",
      desc: t(
        lang,
        "Zeamă tradițională bogată în legume proaspete, carne fragedă și verdeață (300/50g).",
        "Traditional broth rich in fresh vegetables, tender meat and herbs (300/50g)."
      ),
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "320 kcal",
        prot: "25g",
        carb: "15g",
        fat: "18g",
        allergens: t(lang, "Țelină", "Celery"),
      },
    },
    {
      name: "Minestrone / Supă cremă roșii",
      price: "24 Lei",
      desc: t(
        lang,
        "Ciorbă italiană de legume SAU supă fină din roșii coapte cu crutoane și busuioc (300g).",
        "Italian vegetable soup OR fine roasted tomato soup with croutons and basil (300g)."
      ),
      image:
        "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "210 kcal",
        prot: "5g",
        carb: "28g",
        fat: "10g",
        allergens: t(lang, "Țelină, Lactoză", "Celery, Lactose"),
      },
    },
    {
      name: "Bruschete cu roșii",
      price: "35 Lei",
      desc: t(
        lang,
        "Felii de baghetă prăjite, roșii proaspete cubulețe, usturoi, ulei de măsline, busuioc (150g).",
        "Toasted baguette slices, fresh diced tomatoes, garlic, olive oil, basil (150g)."
      ),
      image:
        "https://images.unsplash.com/photo-1506280754576-f6fa8a873ce5?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "280 kcal",
        prot: "6g",
        carb: "35g",
        fat: "12g",
        allergens: "Gluten",
      },
    },
  ],
  pizza: [
    {
      name: "Calabra Ventricina Piccante",
      price: "55 Lei",
      desc: t(
        lang,
        "Fior di latte, sos roșii, salam ventricina picant, gorgonzola (350g).",
        "Fior di latte, tomato sauce, spicy ventricina salami, gorgonzola (350g)."
      ),
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "1050 kcal",
        prot: "48g",
        carb: "95g",
        fat: "42g",
        allergens: "Gluten, Lactoză",
      },
    },
    {
      name: "Prosciutto Crudo e Rucola",
      price: "55 Lei",
      desc: t(
        lang,
        "Fior di latte, sos roșii, prosciutto, rucola, parmezan (350g).",
        "Fior di latte, tomato sauce, prosciutto, arugula, parmesan (350g)."
      ),
      image:
        "https://images.unsplash.com/photo-1555072956-7758afb20e8f?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "980 kcal",
        prot: "50g",
        carb: "92g",
        fat: "36g",
        allergens: "Gluten, Lactoză",
      },
    },
    {
      name: "Quattro Formaggi",
      price: "55 Lei",
      desc: t(
        lang,
        "Fior di latte, smântână dulce, gorgonzola, cedar, parmezan (350g).",
        "Fior di latte, sweet cream, gorgonzola, cheddar, parmesan (350g)."
      ),
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "1120 kcal",
        prot: "45g",
        carb: "105g",
        fat: "42g",
        allergens: "Gluten, Lactoză",
      },
    },
    {
      name: "Tonno e Cipolla / Capriciosa",
      price: "55 / 50 Lei",
      desc: t(
        lang,
        "Ton, ceapă roșie, măsline SAU șuncă, ciuperci, măsline, fior di latte (350g).",
        "Tuna, red onion, olives OR ham, mushrooms, olives, fior di latte (350g)."
      ),
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "890 kcal",
        prot: "42g",
        carb: "95g",
        fat: "32g",
        allergens: "Gluten, Lactoză, Pește",
      },
    },
    {
      name: "Pancetta Affumicata / Pollo e Funghi",
      price: "53 Lei",
      desc: t(
        lang,
        "Pancetta, cașcaval afumat SAU piept pui, ciuperci, ardei, porumb, fior di latte (350g).",
        "Pancetta, smoked cheese OR chicken breast, mushrooms, peppers, corn, fior di latte (350g)."
      ),
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "910 kcal",
        prot: "40g",
        carb: "95g",
        fat: "34g",
        allergens: "Gluten, Lactoză",
      },
    },
    {
      name: "Diavola / Quattro Stagioni",
      price: "52 / 55 Lei",
      desc: t(
        lang,
        "Chorizo picant SAU șuncă, măsline, ciuperci, salam, sos roșii (350g).",
        "Spicy chorizo OR ham, olives, mushrooms, salami, tomato sauce (350g)."
      ),
      image:
        "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "950 kcal",
        prot: "42g",
        carb: "90g",
        fat: "38g",
        allergens: "Gluten, Lactoză",
      },
    },
    {
      name: "Vegetariana / Margherita",
      price: "48 / 44 Lei",
      desc: t(
        lang,
        "Măsline, ardei, ceapă, porumb, dovlecel SAU simplă cu oregano și fior di latte (350/250g).",
        "Olives, peppers, onion, corn, zucchini OR simple with oregano and fior di latte (350/250g)."
      ),
      image:
        "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "750 kcal",
        prot: "28g",
        carb: "85g",
        fat: "22g",
        allergens: "Gluten, Lactoză",
      },
    },
    {
      name: "Focaccia parmezan / usturoi / rozmarin",
      price: "25 Lei",
      desc: t(
        lang,
        "Blat fin de pizza copt pe vatră, asezonat cu parmezan, usturoi sau rozmarin proaspăt (200g).",
        "Fine hearth-baked pizza crust, seasoned with parmesan, garlic or fresh rosemary (200g)."
      ),
      image:
        "https://images.unsplash.com/photo-1594005374167-5fd900fb82c9?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "380 kcal",
        prot: "12g",
        carb: "60g",
        fat: "14g",
        allergens: "Gluten, Lactoză",
      },
    },
  ],
  paste: [
    {
      name: "Spaghetti Marinara",
      price: "72 Lei",
      desc: t(
        lang,
        "Spaghete, mix fructe de mare, roșii proaspete, usturoi (250g).",
        "Spaghetti, seafood mix, fresh tomatoes, garlic (250g)."
      ),
      image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "550 kcal",
        prot: "35g",
        carb: "65g",
        fat: "12g",
        allergens: "Gluten, Fructe de mare",
      },
    },
    {
      name: "Paste Refresh / Cu Somon",
      price: "65 Lei",
      desc: t(
        lang,
        "Paccheri cu guanciale, fistic, grana padano SAU Tagliatele cu somon, capere, smântână (250g).",
        "Paccheri with guanciale, pistachio, grana padano OR Tagliatele with salmon, capers, sour cream (250g)."
      ),
      image:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "890 kcal",
        prot: "32g",
        carb: "78g",
        fat: "45g",
        allergens: "Gluten, Lactoză, Pește",
      },
    },
    {
      name: "Lasagna / Paste al forno",
      price: "65 Lei",
      desc: t(
        lang,
        "Lasagna cu sos bolognez, ciuperci SAU Penne la cuptor cu șuncă, sos rose, mozzarella, parmezan (300g).",
        "Lasagna with bolognese sauce, mushrooms OR Baked penne with ham, rose sauce, mozzarella, parmesan (300g)."
      ),
      image:
        "https://images.unsplash.com/photo-1614961908611-610714b2d561?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "910 kcal",
        prot: "45g",
        carb: "72g",
        fat: "48g",
        allergens: "Gluten, Lactoză, Ouă",
      },
    },
    {
      name: "Paste Primavera / Sos Rose",
      price: "55 Lei",
      desc: t(
        lang,
        "Tagliatelle, roșii cherry, ciuperci, dovlecei, ardei gras, grancucina, parmezan (250g).",
        "Tagliatelle, cherry tomatoes, mushrooms, zucchini, peppers, grancucina, parmesan (250g)."
      ),
      image:
        "https://images.unsplash.com/photo-1621510456681-2330135e5871?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "620 kcal",
        prot: "18g",
        carb: "68g",
        fat: "22g",
        allergens: "Gluten, Lactoză",
      },
    },
    {
      name: "Risotto / Paste Quattro Formaggi",
      price: "55 Lei",
      desc: t(
        lang,
        "Orez basmatic sau Paccheri, cu gorgonzola, cedar, brie, smântână (250g).",
        "Basmati rice or Paccheri, with gorgonzola, cheddar, brie, sour cream (250g)."
      ),
      image:
        "https://images.unsplash.com/photo-1633964913295-ceb43826e7cf?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "780 kcal",
        prot: "22g",
        carb: "70g",
        fat: "42g",
        allergens: "Lactoză, Gluten",
      },
    },
    {
      name: "Paste Carbonara / Arrabiata / Aglio Olio",
      price: "53 / 48 / 45 Lei",
      desc: t(
        lang,
        "Rigatoni cu guanciale, ou, parmezan SAU sos roșii, ardei iute, usturoi, busuioc (250g).",
        "Rigatoni with guanciale, egg, parmesan OR tomato sauce, chili, garlic, basil (250g)."
      ),
      image:
        "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "820 kcal",
        prot: "28g",
        carb: "80g",
        fat: "40g",
        allergens: "Gluten, Lactoză, Ouă",
      },
    },
  ],
  carne: [
    {
      name: "Platou Tradițional 2 pers",
      price: "180 Lei",
      desc: t(
        lang,
        "Ceafă, mici, cârnați, piept pui, pulpă pui, murături, cartofi cuptor (600/200/200g).",
        "Pork neck, skinless sausages, sausages, chicken breast, chicken legs, pickles, baked potatoes (600/200/200g)."
      ),
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "2200 kcal",
        prot: "160g",
        carb: "80g",
        fat: "130g",
        allergens: "Muștar",
      },
    },
    {
      name: "Antricot de vită marinat",
      price: "90 Lei",
      desc: t(
        lang,
        "Antricot fraged de vită, marinat în ierburi aromatice și ulei de măsline, la grătar (150g).",
        "Tender beef ribeye, marinated in aromatic herbs and olive oil, grilled (150g)."
      ),
      image:
        "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "450 kcal",
        prot: "42g",
        carb: "0g",
        fat: "32g",
        allergens: "-",
      },
    },
    {
      name: "Cotlete berbecuț / Pastramă oaie",
      price: "80 / 70 Lei",
      desc: t(
        lang,
        "Cotlete suculente la grătar SAU pastramă tradițională trasă la tigaie, servită cu mămăligă (200g).",
        "Juicy grilled lamb chops OR traditional pan-fried sheep pastrami, served with polenta (200g)."
      ),
      image:
        "https://images.unsplash.com/photo-1608688469399-52eab4c94b79?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "620 kcal",
        prot: "48g",
        carb: "15g",
        fat: "40g",
        allergens: "-",
      },
    },
    {
      name: "Burger Black Angus",
      price: "65 Lei",
      desc: t(
        lang,
        "Carne vită, bacon, ceapă roșie, salată, castravete, sos calypso, cartofi wedges (250/150g).",
        "Beef, bacon, red onion, lettuce, cucumber, calypso sauce, potato wedges (250/150g)."
      ),
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "1150 kcal",
        prot: "58g",
        carb: "95g",
        fat: "62g",
        allergens: "Gluten, Lactoză, Muștar",
      },
    },
    {
      name: "Șnițel vienez cu cartofi",
      price: "79 Lei",
      desc: t(
        lang,
        "Mușchi vită fraged, pane, rucola, roșii cherry, ceapă roșie, cartofi la cuptor (150/150g).",
        "Tender breaded beef tenderloin, arugula, cherry tomatoes, red onion, baked potatoes (150/150g)."
      ),
      image:
        "https://images.unsplash.com/photo-1599921841143-819065a55cc6?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "850 kcal",
        prot: "45g",
        carb: "65g",
        fat: "42g",
        allergens: "Gluten, Ouă",
      },
    },
    {
      name: "Pui cu gorgonzola / Souvlaki pui",
      price: "69 Lei",
      desc: t(
        lang,
        "Piept pui în sos gorgonzola SAU frigărui de pui, legume, lipie, tzatziki. Servite cu cartofi (150g/200g).",
        "Chicken breast in gorgonzola sauce OR chicken skewers, vegetables, pita, tzatziki. Served with potatoes (150g/200g)."
      ),
      image:
        "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "680 kcal",
        prot: "48g",
        carb: "45g",
        fat: "32g",
        allergens: "Lactoză, Gluten",
      },
    },
    {
      name: "Cotlet / Ceafă / Piept pui la grătar",
      price: "69 / 65 / 65 Lei",
      desc: t(
        lang,
        "Carne fragedă la grătar, perfect rumenită. Servită cu cartofi la cuptor (150/200g).",
        "Tender grilled meat, perfectly browned. Served with baked potatoes (150/200g)."
      ),
      image:
        "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "550 kcal",
        prot: "45g",
        carb: "25g",
        fat: "28g",
        allergens: "-",
      },
    },
    {
      name: "Mici cu cartofi prăjiți",
      price: "65 Lei",
      desc: t(
        lang,
        "Mici tradiționali suculenți (4 bucăți), muștar, cartofi prăjiți (180/150g).",
        "Juicy traditional skinless sausages (4 pieces), mustard, french fries (180/150g)."
      ),
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "750 kcal",
        prot: "35g",
        carb: "55g",
        fat: "45g",
        allergens: "Muștar",
      },
    },
    {
      name: "Somon crustă cartofi / Dorada / Păstrăv",
      price: "70 / 70 / 68 Lei",
      desc: t(
        lang,
        "File somon în crustă cu butter lemon SAU pește întreg la grătar cu legume asortate (150/250/200g).",
        "Salmon fillet in potato crust with butter lemon OR whole grilled fish with mixed vegetables (150/250/200g)."
      ),
      image:
        "https://images.unsplash.com/photo-1485921325833-c519f76c4927?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "580 kcal",
        prot: "45g",
        carb: "25g",
        fat: "30g",
        allergens: "Pește, Lactoză",
      },
    },
  ],
  salate: [
    {
      name: "Salată Brânză capră / Brânză grătar / Cesare",
      price: "45 Lei",
      desc: t(
        lang,
        "Mix salată, sfeclă, muguri pin, brânză capră SAU iceberg, pui, crutoane, parmezan (200g).",
        "Mixed salad, beetroot, pine nuts, goat cheese OR iceberg, chicken, croutons, parmesan (200g)."
      ),
      image:
        "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "620 kcal",
        prot: "38g",
        carb: "25g",
        fat: "42g",
        allergens: "Lactoză, Nuci",
      },
    },
    {
      name: "Salată șnițel pui / Beef / Mediterranean Tuna",
      price: "49 / 49 / 45 Lei",
      desc: t(
        lang,
        "Șnițel pui / Mușchi vită / Ton bucăți, mix salată, roșii cherry, măsline, dressing (250g).",
        "Chicken schnitzel / Beef tenderloin / Tuna chunks, mixed salad, cherry tomatoes, olives, dressing (250g)."
      ),
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "550 kcal",
        prot: "35g",
        carb: "25g",
        fat: "32g",
        allergens: "Gluten, Lactoză, Pește",
      },
    },
    {
      name: "Salată Refresh / Grecească",
      price: "45 Lei",
      desc: t(
        lang,
        "Măr, gorgonzola, nucă, prosciutto SAU telemea, măsline, legume proaspete (250g).",
        "Apple, gorgonzola, walnuts, prosciutto OR feta cheese, olives, fresh vegetables (250g)."
      ),
      image:
        "https://images.unsplash.com/photo-1529312266912-b33cfce2eefd?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "480 kcal",
        prot: "15g",
        carb: "25g",
        fat: "35g",
        allergens: "Lactoză, Nuci",
      },
    },
    {
      name: "Risotto legume / burro",
      price: "25 / 20 Lei",
      desc: t(
        lang,
        "Orez basmatic, mazăre, fasole verde, porumb, morcov SAU orez cremos cu unt (200/150g).",
        "Basmati rice, peas, green beans, corn, carrots OR creamy rice with butter (200/150g)."
      ),
      image:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db378?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "380 kcal",
        prot: "6g",
        carb: "60g",
        fat: "12g",
        allergens: "Lactoză",
      },
    },
    {
      name: "Cartofi wedges / prăjiți / cuptor",
      price: "25 / 28 Lei",
      desc: t(
        lang,
        "Cartofi rumeniți la alegere: simpli, cu parmezan și usturoi sau wedges condimentați (150g).",
        "Browned potatoes of choice: plain, with parmesan and garlic, or spiced wedges (150g)."
      ),
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "350 kcal",
        prot: "4g",
        carb: "45g",
        fat: "16g",
        allergens: "Lactoză",
      },
    },
    {
      name: "Legume grătar / Broccoli",
      price: "25 / 20 Lei",
      desc: t(
        lang,
        "Mix de legume proaspete la grătar SAU broccoli fiert la abur, ușor asezonat (150g).",
        "Mixed fresh grilled vegetables OR steamed broccoli, lightly seasoned (150g)."
      ),
      image:
        "https://images.unsplash.com/photo-1546039907-7fa05f864c02?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "150 kcal",
        prot: "4g",
        carb: "20g",
        fat: "6g",
        allergens: "-",
      },
    },
  ],
  desert: [
    {
      name: "Papanași cu smântână și dulceață",
      price: "32 Lei",
      desc: t(
        lang,
        "Gogoși tradiționale din brânză dulce, prăjite, servite cu smântână și dulceață/Nutella (200g).",
        "Traditional sweet cheese fried doughnuts, served with sour cream and jam/Nutella (200g)."
      ),
      image:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "720 kcal",
        prot: "15g",
        carb: "95g",
        fat: "34g",
        allergens: "Gluten, Lactoză, Ouă",
      },
    },
    {
      name: "Tiramisu",
      price: "32 Lei",
      desc: t(
        lang,
        "Desert italian clasic cu pișcoturi, cafea espresso, cremă de mascarpone și cacao (200g).",
        "Classic Italian dessert with ladyfingers, espresso coffee, mascarpone cream, and cocoa (200g)."
      ),
      image:
        "https://images.unsplash.com/photo-1571115177098-24edf647614e?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "450 kcal",
        prot: "8g",
        carb: "45g",
        fat: "28g",
        allergens: "Gluten, Lactoză, Ouă",
      },
    },
    {
      name: "Lava cake",
      price: "30 Lei",
      desc: t(
        lang,
        "Prăjitură caldă de ciocolată cu mijloc lichid, servită pudrată cu zahăr (125g).",
        "Warm chocolate cake with a liquid center, served dusted with sugar (125g)."
      ),
      image:
        "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "480 kcal",
        prot: "6g",
        carb: "52g",
        fat: "28g",
        allergens: "Gluten, Lactoză, Ouă",
      },
    },
    {
      name: "Clătite cu dulceață / Nutella",
      price: "28 Lei",
      desc: t(
        lang,
        "Foi fine de clătite, umplute cu dulceață de fructe sau cremă de ciocolată Nutella (150g).",
        "Fine crepe sheets, filled with fruit jam or Nutella chocolate cream (150g)."
      ),
      image:
        "https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "350 kcal",
        prot: "8g",
        carb: "55g",
        fat: "12g",
        allergens: "Gluten, Lactoză, Ouă",
      },
    },
  ],
  bauturi: [
    {
      name: "Frappe (Ciocolată / Caramel / Vanilie)",
      price: "28 Lei",
      desc: t(
        lang,
        "Băutură răcoritoare din cafea, gheață și arome la alegere (300ml).",
        "Refreshing iced coffee drink with choice of flavors (300ml)."
      ),
      image:
        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "350 kcal",
        prot: "5g",
        carb: "45g",
        fat: "15g",
        allergens: "Lactoză",
      },
    },
    {
      name: "Limonadă (Clasică / Fructe)",
      price: "25 Lei",
      desc: t(
        lang,
        "Limonadă proaspătă preparată cu lămâie, mentă și siropuri de fructe (400ml).",
        "Fresh lemonade made with lemon, mint, and fruit syrups (400ml)."
      ),
      image:
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "120 kcal",
        prot: "0g",
        carb: "30g",
        fat: "0g",
        allergens: "-",
      },
    },
    {
      name: "Cappuccino / Latte",
      price: "16 - 18 Lei",
      desc: t(
        lang,
        "Cafea fină cu cremă de lapte texturată (120ml - 240ml).",
        "Fine coffee with textured milk cream (120ml - 240ml)."
      ),
      image:
        "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "90 kcal",
        prot: "4g",
        carb: "10g",
        fat: "4g",
        allergens: "Lactoză",
      },
    },
  ],
  bar: [
    {
      name: "Cocktails (Aperol Spritz / Hugo)",
      price: "40 Lei",
      desc: t(
        lang,
        "Băuturi răcoritoare clasice, pe bază de prosecco, gheață și fructe (300ml).",
        "Classic refreshing drinks, based on prosecco, ice and fruits (300ml)."
      ),
      image:
        "https://images.unsplash.com/photo-1560512823-829485b8bf24?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "180 kcal",
        prot: "0g",
        carb: "15g",
        fat: "0g",
        allergens: "Sulfiți",
      },
    },
    {
      name: "Bere Draught / Sticlă",
      price: "15 - 20 Lei",
      desc: t(
        lang,
        "Selecție de beri reci, la draft sau la sticlă (330ml - 500ml).",
        "Selection of cold beers, draft or bottled (330ml - 500ml)."
      ),
      image:
        "https://images.unsplash.com/photo-1536934331-5360f9f1ed67?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "180 kcal",
        prot: "2g",
        carb: "14g",
        fat: "0g",
        allergens: "Gluten",
      },
    },
    {
      name: "Whiskey & Spirits",
      price: "30 - 35 Lei",
      desc: t(
        lang,
        "Tării fine, perfecte pentru digestie sau cocktailuri (40ml).",
        "Fine spirits, perfect for digestion or cocktails (40ml)."
      ),
      image:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
      nutrition: {
        cal: "95 kcal",
        prot: "0g",
        carb: "0g",
        fat: "0g",
        allergens: "-",
      },
    },
  ],
});

// --- COMPONENTA PREPARAT (Acordeon Optimizat) ---
const MenuItemCard = ({ item, index, lang }: { item: any; index: number; lang: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!hasBeenOpened) setHasBeenOpened(true);
  };

  const imageUrl =
    item.image ||
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop";

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
            className={`w-7 h-7 md:w-8 md:h-8 rounded-full border flex items-center justify-center transition-all duration-400 ${
              isOpen
                ? "border-brand-accent bg-brand-accent/10"
                : "border-gray-700 group-hover:border-brand-accent/50"
            }`}
          >
            <span
              className={`text-gray-400 text-sm transition-transform duration-400 ${
                isOpen
                  ? "rotate-45 text-brand-accent"
                  : "group-hover:text-brand-accent"
              }`}
            >
              +
            </span>
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
                    {t(lang, "Grăsimi", "Fats")}
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

// --- COMPONENTA FOOTER LEGAL ---
const LegalFooter = ({ lang, theme = "light" }: { lang: string; theme?: string }) => {
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
            S.C. REFRESH RESTAURANT S.R.L.
          </p>
          <p>CUI: RO45698712 | Reg: J40/1234/2022</p>
          <p className="mb-3">
            {t(
              lang,
              "Str. Johann Sebastian Bach 3",
              "Johann Sebastian Bach St. 3"
            )}
            <br />
            020201 București
          </p>
          <a
            href="https://www.google.com/maps/search/REFRESH+RESTAURANT+PIZZA+Bucuresti//?hl=en"
            target="_blank"
            rel="noreferrer"
            className="inline-block px-4 py-2 bg-brand-accent text-white rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-brand-accentHover transition-colors shadow-sm"
          >
            {t(lang, "Navighează spre noi", "Navigate to us")}
          </a>
        </div>
        <div>
          <p className={`font-bold mb-3 ${textTitle}`}>
            {t(lang, "Contact Rapid", "Quick Contact")}
          </p>
          <p>Tel: +40 771 189 347</p>
          <p>Email: contact@refresh-restaurant.ro</p>
          <p className="mt-2 text-gray-400 font-bold">
            {t(
              lang,
              "Lu, Ma, Sâ, Du: 10:00 - 22:00",
              "Mo, Tu, Sa, Su: 10:00 - 22:00"
            )}
            <br />
            {t(lang, "Mi - Vi: 10:00 - 22:30", "We - Fr: 10:00 - 22:30")}
          </p>
        </div>
        <div className="flex flex-col md:items-end gap-3">
          <p className={`font-bold mb-1 ${textTitle}`}>
            {t(lang, "Legal & Transparență", "Legal & Transparency")}
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

// --- COMPONENTA REZERVARE (Bottom Sheet iOS style) ---
const ReservationModal = ({ isOpen, onClose, lang }: { isOpen: boolean; onClose: () => void; lang: string }) => {
  const [partySize, setPartySize] = useState("2");
  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedTime, setSelectedTime] = useState("19:00");
  const [specialRequests, setSpecialRequests] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const today = new Date();
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayEn = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayRo = d.toLocaleDateString("ro-RO", { weekday: "short" });
    return {
      id: i,
      label: i === 0 ? t(lang, "Azi", "Today") : i === 1 ? t(lang, "Mâine", "Tomorrow") : t(lang, dayRo, dayEn),
      date: d.getDate().toString(),
    };
  });

  const partyOptions = ["1", "2", "3", "4", "5+"];
  const timeOptions = ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

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
      // Apple-Pay like double chime
      playTone(1200, now, 0.15);
      playTone(1600, now + 0.12, 0.3);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      // Simulăm webhook-ul către un API
      await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify({ partySize, selectedDate, selectedTime, specialRequests }),
        headers: { "Content-type": "application/json" },
      });

      // Delay artificial pentru experiență (1.2 secunde)
      await new Promise((r) => setTimeout(r, 1200));
      
      setStatus("success");
      playSuccessSound();

      // Resetăm și închidem după confirmare
      setTimeout(() => {
        onClose();
        setTimeout(() => setStatus("idle"), 400); // reset după ce animația de închidere se termină
      }, 2500);
    } catch (error) {
      setStatus("idle");
      alert(t(lang, "A apărut o eroare.", "An error occurred."));
    }
  };

  return (
    <div className={`fixed inset-0 z-[200] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      ></div>

      {/* Bottom Sheet Modal Container */}
      <div
        className={`absolute inset-x-0 bottom-0 z-10 flex h-[85vh] max-h-[750px] flex-col rounded-t-[24px] bg-[#1A1817] shadow-float overflow-hidden transform transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Handle & Header */}
        <div className="flex flex-col items-center pt-4 pb-2 shrink-0 bg-[#1A1817] z-20 sticky top-0 border-b border-white/5">
          <button onClick={onClose} aria-label="Drag to dismiss" className="h-1.5 w-12 rounded-full bg-gray-600/40 hover:bg-gray-600/60 transition-colors mb-6"></button>
          <div className="w-full px-6 flex justify-between items-center">
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-white">{t(lang, "Rezervă o Masă", "Book a Table")}</h1>
            <button onClick={onClose} aria-label="Close" className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 no-scrollbar">
          {/* Apple Pay Style Success Overlay */}
          <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#1A1817] transition-all duration-500 ${status === 'success' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-pop-in">
                <Check size={36} strokeWidth={3} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-serif text-white mb-2">{t(lang, "Rezervare Confirmată", "Booking Confirmed")}</h2>
            <p className="text-gray-400">{t(lang, "Te așteptăm cu drag!", "We look forward to seeing you!")}</p>
          </div>

          <div className={`transition-opacity duration-300 ${status === 'success' ? 'opacity-0' : 'opacity-100'}`}>
            {/* Party Size */}
            <section className="mb-10">
              <h2 className="text-sm uppercase tracking-wider text-gray-400 font-medium mb-4 flex items-center gap-2">
                <Users size={18} />
                {t(lang, "Persoane", "Party Size")}
              </h2>
              <div className="flex justify-between items-center gap-2">
                {partyOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setPartySize(size)}
                    className={`w-14 h-14 rounded-full border text-lg flex items-center justify-center transition-all ${
                      partySize === size
                        ? "border-brand-accent bg-brand-accent/10 text-brand-accent font-semibold shadow-glow ring-1 ring-brand-accent/20"
                        : "border-gray-700/50 text-gray-200 font-medium hover:bg-white/5"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </section>

            {/* Date Selection */}
            <section className="mb-10">
              <h2 className="text-sm uppercase tracking-wider text-gray-400 font-medium mb-4 flex items-center gap-2">
                <CalendarCheck size={18} />
                {t(lang, "Data", "Date")}
              </h2>
              <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
                {days.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDate(day.id)}
                    className={`flex flex-col items-center justify-center min-w-[72px] py-3 rounded-xl border transition-all ${
                      selectedDate === day.id
                        ? "border-brand-accent bg-brand-accent/10 shadow-glow ring-1 ring-brand-accent/20"
                        : "border-gray-700/50 bg-[#121212]/50 hover:bg-white/5"
                    }`}
                  >
                    <span className={`text-xs mb-1 ${selectedDate === day.id ? "text-brand-accent font-medium" : "text-gray-400"}`}>{day.label}</span>
                    <span className={`text-xl ${selectedDate === day.id ? "font-bold text-brand-accent" : "font-semibold text-white"}`}>{day.date}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Time Selection */}
            <section className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-sm uppercase tracking-wider text-gray-400 font-medium flex items-center gap-2">
                  <Clock size={18} />
                  {t(lang, "Ora", "Time")}
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {timeOptions.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-lg border text-sm transition-all ${
                      selectedTime === time
                        ? "border-brand-accent bg-brand-accent/10 text-brand-accent font-bold shadow-glow ring-1 ring-brand-accent/20"
                        : "border-gray-700/50 bg-[#121212]/50 text-gray-200 font-medium hover:border-gray-500"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </section>

            {/* Special Requests */}
            <section className="mb-6">
              <h2 className="text-sm uppercase tracking-wider text-gray-400 font-medium mb-2 flex items-center gap-2">
                <Utensils size={18} />
                {t(lang, "Cerințe Speciale", "Special Requests")}
              </h2>
              <div className="relative mt-2">
                <input
                  id="requests"
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder={t(lang, "Restricții alimentare, aniversări...", "Dietary restrictions, celebrations...")}
                  className="block w-full border-0 border-b border-gray-700 bg-transparent py-3 px-0 text-white focus:border-brand-accent focus:ring-0 sm:text-sm placeholder:text-gray-500 transition-colors"
                />
              </div>
            </section>
          </div>
        </div>

        {/* Fixed Bottom Action */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1A1817] via-[#1A1817] to-transparent pt-12 pointer-events-none">
          <button
            onClick={handleConfirm}
            disabled={status !== "idle"}
            className={`pointer-events-auto w-full h-[56px] rounded-full text-white font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${
              status === "success" 
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
                {t(lang, "Confirmă Rezervarea", "Confirm Booking")}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTA FILTRE DIETETICE (Modern Minimalist) ---
const DietaryFilterModal = ({
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
    { id: "gf", labelEn: "Gluten-Free", labelRo: "Fără Gluten" },
    { id: "df", labelEn: "Dairy-Free", labelRo: "Fără Lactoză" },
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
            "Bifați opțiunile de mai jos pentru a filtra meniul. Preparatele care conțin ingrediente neselectate vor fi ascunse.",
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
          {t(lang, "Aplică Filtrele", "Apply Filters")}
        </button>
      </div>
    </div>
  );
};

// --- APLICAȚIA PRINCIPALĂ ---
export default function App() {
  const [activeView, setActiveView] = useState("home");
  const [isPreloading, setIsPreloading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isDietaryModalOpen, setIsDietaryModalOpen] = useState(false);
  const [language, setLanguage] = useState("RO");
  const [activeMenuCategory, setActiveMenuCategory] = useState("pizza");
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

  // --- CELE 4 SLIDE-URI ---
  const slides = [
    {
      title: (lang: string) => t(lang, "#REFRESH", "#REFRESH"),
      subtitle: (lang: string) => t(lang, "RESTAURANT & PIZZA", "RESTAURANT & PIZZA"),
      desc: (lang: string) =>
        t(
          lang,
          "Design cald. Gust autentic. Experiența perfectă în Floreasca.",
          "Warm design. Authentic taste. The perfect Floreasca experience."
        ),
      image: "download (2).png",
      type: "hero",
    },
    {
      title: (lang: string) => t(lang, "PĂRERILE OASPEȚILOR", "GUEST REVIEWS"),
      subtitle: (lang: string) =>
        t(lang, "4.5/5 DIN 345+ RECENZII", "4.5/5 FROM 345+ REVIEWS"),
      image: "download (4).png",
      type: "reviews",
      reviews: [
        {
          name: "Alin Gheorghe",
          text: t(
            language,
            "Mâncare excelentă... una dintre cele mai bune pizza Quattro Formaggi din București! O oază de liniște cu vedere minunată la parc.",
            "Great food…one of the best Quatro Formagi Pizza in Bucharest! Peace and quietful place with wonderful views to the park."
          ),
        },
        {
          name: "Alina Pascale",
          text: t(
            language,
            "O sangria minunată, dar laude speciale pentru focaccia, a cărei rețetă am înțeles că a fost îndelung studiată de proprietari. Ne-a impresionat efortul lor.",
            "A wonderful sangria, too. A special praise for the focaccia, whose recipe was thoroughly researched by the owners."
          ),
        },
        {
          name: "Vlad Mototolea",
          text: t(
            language,
            "Locația este situată fix lângă parc și are o terasă frumoasă. Am mâncat lasagna și a fost grozavă 👍. Servire rapidă și amicală.",
            "The place is situated right by the park and has a medium-sized terrace . I had the lasagna and it was great 👍. Fast service."
          ),
        },
        {
          name: "Cecil Williams",
          text: t(
            language,
            "Locul perfect pentru a opri după o plimbare în parc. Personalul prietenos, iar Refresh Sandwich a fost absolut excelent! Recomand.",
            "Perfect place to stop at after walking through the park next to it. The staff was friendly and the Refresh Sandwich was excellent!"
          ),
        },
      ],
    },
    {
      title: (lang: string) => t(lang, "PIZZA CALDĂ", "HOT PIZZA"),
      subtitle: (lang: string) => t(lang, "ARTIZANALĂ", "ARTISAN"),
      desc: (lang: string) =>
        t(
          lang,
          "Aluat maturat 48h, copt la foc iute cu ingrediente premium din Italia.",
          "48h aged dough, baked fast with premium Italian ingredients."
        ),
      image: "change_the_text_202603172154.png",
      type: "hero",
    },
    {
      title: (lang: string) => t(lang, "TERASĂ ÎN AER LIBER", "OUTDOOR TERRACE"),
      subtitle: (lang: string) => t(lang, "OAZĂ URBANĂ", "URBAN OASIS"),
      desc: (lang: string) =>
        t(
          lang,
          "Aer curat, cafea de specialitate și relaxare absolută lângă Parcul Glinka.",
          "Fresh air, specialty coffee, and absolute relaxation near Glinka Park."
        ),
      image: "download (3).png",
      type: "hero",
    },
  ];

  useEffect(() => {
    injectTailwind();
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
    <div className="relative w-full h-full overflow-hidden bg-brand-dark">
    <div className="relative flex-1 w-full h-full overflow-hidden bg-brand-dark">
      {slides.map((slide, idx) => {
        const isActive = currentSlide === idx;
        const isPast = currentSlide > idx;

        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
              isActive
                ? "translate-y-0 opacity-100 z-10"
                : isPast
                ? "-translate-y-full opacity-0 z-0"
                : "translate-y-full opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              className={`absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[20s] ease-linear ${
                isActive ? "scale-110" : "scale-100"
              }`}
              alt="Refresh Slide"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/70"></div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pt-4 md:pt-10">
              <div
                className={`transition-all duration-1000 ease-in-out ${
                  isActive
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
                  className={`w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-2 md:px-8 max-h-[50vh] md:max-h-none overflow-y-auto no-scrollbar pb-24 md:pb-0 transition-all duration-1000 delay-300 ease-in-out ${
                    isActive
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
                      className={`flex flex-col bg-white/10 backdrop-blur-xl border border-white/20 p-5 md:p-8 rounded-3xl text-left shadow-2xl transition-all duration-700 ease-out ${
                        isActive
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
                  className={`transition-all duration-1000 delay-500 ease-in-out flex flex-col items-center ${
                    isActive
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

            {/* PEEK EFFECT PENTRU RECENZII - Varianta curată conform schiței */}
            {idx === 0 && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(1);
                }}
                className={`absolute bottom-[95px] md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-1000 group z-20 ${
                  isActive
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

                {/* Text subtil fără fundal de "pastilă" */}
                <p className="text-white text-[9px] font-bold tracking-[0.2em] uppercase drop-shadow-md">
                  {t(language, "Citește Recenziile", "Read Reviews")}
                </p>

                {/* Săgeată mică ce indică direcția de swipe/click */}
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
            className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-700 ${
              currentSlide === i
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
      {/* BARA DE NAVIGARE MENIU - Flex Wrap (Se așează automat pe 2-3 rânduri fără scroll) */}
      <div className="fixed top-0 md:top-16 left-0 w-full z-40 bg-brand-dark/95 backdrop-blur-xl border-b border-gray-800 shadow-xl py-2.5 px-2">
        <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 max-w-4xl mx-auto">
          {currentCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`py-1.5 px-2.5 md:py-2 md:px-4 text-[9.5px] md:text-xs font-bold uppercase rounded-lg transition-all whitespace-nowrap ${
                activeMenuCategory === cat.id
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
              "Apasă pe preparat pentru ingrediente și nutriție.",
              "Tap on a dish for ingredients and nutrition."
            )}
          </p>
          
          {(() => {
            const activeFiltersCount = Object.values(dietaryFilters).filter(Boolean).length;
            return (
              <button
                onClick={() => setIsDietaryModalOpen(true)}
                className={`inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full border transition-colors text-sm font-medium tracking-wide shadow-sm ${
                  activeFiltersCount > 0
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
          const items = currentMenuData[category.id];
          if (!items) return null;

          const filteredItems = items.filter((item: any) => {
            const textToSearch = `${item.name} ${item.desc} ${item.nutrition?.allergens || ""}`.toLowerCase();

            if (dietaryFilters.nut && ["nuci", "fistic", "alune", "arahide", "susan", "nut", "pistachio", "sesame", "peanut"].some(k => textToSearch.includes(k))) return false;
            if (dietaryFilters.gf && ["gluten", "făină", "lipie", "baghetă", "crutoane", "paste", "spaghete", "paccheri", "tagliatelle", "lasagna", "penne", "rigatoni", "focaccia", "blat", "pane", "pișcoturi", "bere", "flour", "pita", "baguette", "crouton", "pasta", "spaghetti", "dough", "bread", "ladyfinger", "beer"].some(k => textToSearch.includes(k))) return false;
            if (dietaryFilters.df && ["lactoză", "lactose", "brânză", "cheese", "unt", "butter", "smântână", "cream", "parmezan", "parmesan", "mozzarella", "gorgonzola", "fior di latte", "mascarpone", "iaurt", "yogurt", "cedar", "cheddar", "brie", "telemea", "capră", "goat"].some(k => textToSearch.includes(k))) return false;

            const meatKeywords = ["salam", "salami", "prosciutto", "carne", "meat", "pui", "chicken", "pește", "fish", "ton", "tuna", "somon", "salmon", "fructe de mare", "seafood", "bacon", "cârnați", "sausage", "șuncă", "ham", "vită", "beef", "berbecuț", "oaie", "lamb", "sheep", "burger", "angus", "guanciale", "pancetta", "chorizo", "dorada", "păstrăv", "mici", "ceafă", "pork neck", "cotlet", "chop", "antricot", "ribeye", "mortadella"];
            const hasMeat = meatKeywords.some(k => textToSearch.includes(k));

            if (dietaryFilters.vegetarian && hasMeat) return false;

            if (dietaryFilters.vegan) {
              if (hasMeat) return false;
              if (["lactoză", "lactose", "brânză", "cheese", "unt", "butter", "smântână", "cream", "parmezan", "parmesan", "mozzarella", "gorgonzola", "fior di latte", "mascarpone", "iaurt", "yogurt", "cedar", "cheddar", "brie", "telemea", "capră", "goat", "ouă", "ou", "egg", "miere", "honey"].some(k => textToSearch.includes(k))) return false;
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
      t(language, "Rezervă o Masă", "Book a Table"),
      t(
        language,
        "Selectați detaliile pentru a vă asigura locul perfect.",
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
      t(language, "Confirmă Rezervarea", "Confirm Reservation")
    );

  const renderEvents = () =>
    renderFormPage(
      t(language, "Evenimente Private", "Private Events"),
      t(
        language,
        "Transformăm #REFRESH în spațiul tău exclusivist.",
        "We transform #REFRESH into your exclusive space."
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
          label: t(language, "Data Estimativă", "Estimated Date"),
          type: "date",
        },
        {
          label: t(language, "Cerințe Speciale", "Special Requests"),
          type: "textarea",
          full: true,
        },
      ],
      t(language, "Cere Ofertă", "Request Quote")
    );

  const renderJobs = () =>
    renderFormPage(
      t(language, "Alătură-te Echipei", "Join the Team"),
      t(
        language,
        "Căutăm pasiune și dedicare pentru a oferi servicii de top.",
        "We are looking for passion and dedication to provide top-tier services."
      ),
      [
        { label: t(language, "Nume Complet", "Full Name"), type: "text" },
        { label: t(language, "Telefon", "Phone"), type: "tel" },
        {
          label: t(language, "Post Dorit", "Desired Position"),
          type: "select",
          options: [
            t(language, "Ospătar", "Waiter"),
            t(language, "Bucătar", "Chef"),
            t(language, "Barman", "Bartender"),
            "Hostess",
          ],
          full: true,
        },
        {
          label: t(language, "Scurtă Experiență", "Short Experience"),
          type: "textarea",
          full: true,
        },
      ],
      t(language, "Aplică Acum", "Apply Now")
    );

  const renderContact = () => (
    <div className="min-h-screen flex flex-col bg-brand-bg pt-24 md:pt-32 text-brand-textMain animate-slide-up-stagger overflow-x-hidden">
      <div className="flex-grow max-w-4xl mx-auto px-6 text-center w-full">
        <h1 className="font-serif text-5xl mb-4 text-brand-dark">
          {t(language, "Contact & Locație", "Contact & Location")}
        </h1>
        <p className="text-brand-textMuted mb-12">
          Refresh and make it happen!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl border border-brand-border shadow-sm flex flex-col items-center hover:border-brand-accent transition-colors">
            <MapPin size={32} className="text-brand-accent mb-4" />
            <h3 className="font-bold mb-2 text-brand-dark">
              {t(language, "Adresă", "Address")}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {t(
                language,
                "Str. Johann Sebastian Bach 3",
                "Johann Sebastian Bach St. 3"
              )}
              <br />
              020201 București
            </p>
            <a
              href="https://www.google.com/maps/search/REFRESH+RESTAURANT+PIZZA+Bucuresti//?hl=en"
              target="_blank"
              rel="noreferrer"
              className="mt-auto px-6 py-2 bg-brand-dark text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-colors shadow-lg"
            >
              {t(language, "Navighează", "Navigate")}
            </a>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-brand-border shadow-sm flex flex-col items-center hover:border-brand-accent transition-colors">
            <Phone size={32} className="text-brand-accent mb-4" />
            <h3 className="font-bold mb-2 text-brand-dark">
              {t(language, "Telefon", "Phone")}
            </h3>
            <a
              href="tel:+40771189347"
              className="text-gray-500 text-sm hover:text-brand-accent"
            >
              +40 771 189 347
            </a>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-brand-border shadow-sm flex flex-col items-center hover:border-brand-accent transition-colors">
            <Clock size={32} className="text-brand-accent mb-4" />
            <h3 className="font-bold mb-2 text-brand-dark">
              {t(language, "Program", "Hours")}
            </h3>
            <p className="text-gray-500 text-sm">
              {t(
                language,
                "Lu, Ma, Sâ, Du: 10:00 - 22:00",
                "Mo, Tu, Sa, Su: 10:00 - 22:00"
              )}
              <br />
              {t(language, "Mi - Vi: 10:00 - 22:30", "We - Fr: 10:00 - 22:30")}
            </p>
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
        label: t(language, "Rezervă Masă", "Book a Table"),
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
        label: t(language, "Contact & Locație", "Contact & Location"),
        icon: <MapPin size={18} />,
      },
      {
        id: "home",
        label: t(language, "Acasă", "Home"),
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
        className={`absolute bottom-full left-0 mb-4 w-[280px] sm:w-72 bg-brand-dark text-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] transform origin-bottom-left ${
          isMenuOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="py-3 px-3">
          {mainItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors group ${
                activeView === item.id
                  ? "bg-brand-accent/10 text-brand-accent"
                  : "hover:bg-white/5"
              }`}
            >
              <span
                className={`${
                  activeView === item.id
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
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors group ${
                  activeView === item.id
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
              href="mailto:contact@refresh-restaurant.ro"
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
      <nav className="hidden md:flex fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10 px-8 py-4 justify-between items-center transition-all">
        <div
          className="text-white font-serif text-2xl tracking-widest cursor-pointer hover:text-brand-accent transition-colors"
          onClick={() => navigate("home")}
        >
          #REFRESH
        </div>
        <div className="flex items-center gap-8">
          {[
            { id: "menu", label: t(language, "Meniu", "Menu") },
            { id: "book", label: t(language, "Rezervări", "Booking") },
            { id: "events", label: t(language, "Evenimente", "Events") },
            { id: "jobs", label: t(language, "Cariere", "Careers") },
            { id: "contact", label: t(language, "Contact", "Contact") },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                activeView === item.id
                  ? "text-brand-accent"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
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
        className={`fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center transition-transform duration-[1s] ease-[cubic-bezier(0.85,0,0.15,1)] ${
          isPreloading ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <h1 className="font-serif text-3xl md:text-5xl text-white tracking-[0.3em] uppercase opacity-0 animate-[fadeInText_1s_0.2s_forwards]">
          #REFRESH
        </h1>
        <div className="w-0 h-[2px] bg-brand-accent mt-6 animate-[expandLine_0.8s_1s_forwards]"></div>
      </div>

      <main
        className={`w-full ${
          activeView === "home" ? "h-screen h-[100dvh]" : "min-h-screen min-h-[100dvh]"
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
              className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                isMenuOpen
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
              className={`px-5 py-3 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors whitespace-nowrap ${
                activeView === "menu"
                  ? "bg-brand-accent/10 text-brand-accent"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {t(language, "Meniu", "Menu")}
            </button>
            <button
              onClick={() => navigate("book")}
              className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg transition-all whitespace-nowrap ${
                isReservationOpen
                  ? "bg-brand-accent text-white shadow-brand-accent/30"
                  : "bg-white text-brand-dark hover:bg-gray-200"
              }`}
            >
              {t(language, "Rezervă", "Book")}
            </button>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInText { from { opacity: 0; transform: translateY(15px); letter-spacing: 0.1em; } to { opacity: 1; transform: translateY(0); letter-spacing: 0.3em; } }
        @keyframes expandLine { from { width: 0; opacity: 0; } to { width: 150px; opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes slideUpStagger { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up-stagger { opacity: 0; animation: slideUpStagger 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        body { background: #121212; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; }
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
