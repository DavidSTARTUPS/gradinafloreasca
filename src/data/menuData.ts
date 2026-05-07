// --- HELPER TRADUCERE ---
export const t = (lang: string, ro: string, en: string) => (lang === "RO" ? ro : en);

export const getMenuCategories = (lang: string) => [
  { id: "mic-dejun", name: t(lang, "Mic Dejun", "Breakfast") },
  { id: "gustari", name: t(lang, "Gustari & Salate", "Starters & Salads") },
  { id: "paste", name: t(lang, "Paste", "Pasta") },
  { id: "pizza", name: t(lang, "Pizza", "Pizza") },
  { id: "burgeri", name: t(lang, "Burgerz", "Burgerz") },
  { id: "principale", name: t(lang, "Feluri Principale", "Main Course") },
  { id: "garnituri", name: t(lang, "Garnituri & Sosuri", "Sides & Sauces") },
  { id: "desert", name: t(lang, "Desert", "Desert") },
  { id: "inghetata", name: t(lang, "Inghetata", "Ice Cream") },
  { id: "bauturi", name: t(lang, "Bauturi", "Drinks") },
];

export const getMenuData = (lang: string) => {
  const drinksData = [
    { isHeader: true, name: t(lang, "LIMONADA", "LEMONADE") },
    { name: "Limonada cu menta", price: "25 lei", desc: "fresh", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80" },
    { name: "Limonada cu zmeura", price: "25 lei", desc: "", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80" },
    { isHeader: true, name: t(lang, "RACORITOARE", "SOFT DRINKS") },
    { name: "Coca Cola / Fanta", price: "15 lei", desc: "", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80" },
    { isHeader: true, name: t(lang, "COCKTAIL", "COCKTAILS") },
    { name: "Aperol Spritz", price: "40 lei", desc: "", image: "https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80" },
  ];

  return {
    "mic-dejun": [
      {
        name: "Quiche cu spanac si bacon",
        price: "30 lei",
        desc: t(lang, "Ingrediente: spanac, bacon afumat, branza feta, cascaval, oua, unt | 150g", "Ingredients: spinach, smoked bacon, feta, cheese, eggs, butter | 150g"),
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "420 kcal", prot: "14g", carb: "28g", fat: "30g", allergens: "Gluten, Lactoza, Oua" }
      },
      {
        name: "Quiche cu brie si praz",
        price: "30 lei",
        desc: t(lang, "Ingrediente: branza brie, cascaval, smantana, oua, praz | 150g", "Ingredients: brie, cheese, cream, eggs, leek | 150g"),
        image: "https://plus.unsplash.com/premium_photo-1723651220827-f921aabeb015?q=80&w=800&auto=format&fit=crop",
        nutrition: { cal: "440 kcal", prot: "12g", carb: "26g", fat: "32g", allergens: "Gluten, Lactoza, Oua" }
      },
      { name: "Croissant cu unt", price: "10 lei", desc: t(lang, "Ingrediente: faina, unt, zahar, drojdie, ou | 60g", "Ingredients: flour, butter, sugar | 60g"), image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80" },
      { name: "Chec cu cacao", price: "12 lei", desc: t(lang, "Ingrediente: ou, faina, unt, cacao, vanilie | 80g", "Ingredients: egg, flour, butter, cocoa, vanilla | 80g"), image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80" },
    ],
    "gustari": [
      {
        name: "Bruschete cu blue cheese",
        price: "34 lei",
        desc: t(lang, "Ingrediente: blue cheese, dulceata de ceapa caramelizata | 150g", "Ingredients: blue cheese, caramelized onion jam | 150g"),
        image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "213 kcal", prot: "7g", carb: "24g", fat: "8g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Bruschette cu rosii cherry",
        price: "30 lei",
        desc: t(lang, "Ingrediente: rosii cherry, usturoi, busuioc, ulei extravirgin | 160g", "Ingredients: cherry tomatoes, garlic, basil, olive oil | 160g"),
        image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "139 kcal", prot: "4g", carb: "24g", fat: "3g", allergens: "Gluten" }
      },
      {
        name: "Conopida cu sos de iaurt si naut",
        price: "34 lei",
        desc: t(lang, "Ingrediente: iaurt, conopida, boabe de naut, focaccia, patrunjel | 220g", "Ingredients: yogurt, cauliflower, chickpeas, focaccia, parsley | 220g"),
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "141 kcal", prot: "5g", carb: "16g", fat: "4g", allergens: "Fara alergeni" }
      },
      {
        name: "Salata de vinete cu feta",
        price: "36 lei",
        desc: t(lang, "Ingrediente: vinete, branza feta, rosii, ceapa | 320g", "Ingredients: eggplant, feta, tomatoes, onion | 320g"),
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "145 kcal", prot: "4g", carb: "15g", fat: "7g", allergens: "Lactoza" }
      },
      {
        name: "Mezze cu focaccia",
        price: "34 lei",
        desc: t(lang, "Ingrediente: iaurt, usturoi, susan, naut, avocado, tahini | 200g", "Ingredients: yogurt, garlic, sesame, chickpeas, avocado, tahini | 200g"),
        image: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80"
      },
      { isHeader: true, name: t(lang, "SALATE", "SALADS") },
      {
        name: "Salata cu halloumi si seminte",
        price: "50 lei",
        desc: t(lang, "Ingrediente: halloumi, seminte, mix salata | 240g", "Ingredients: halloumi, seeds, mix salad | 240g"),
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "191 kcal", prot: "9g", carb: "3g", fat: "16g", allergens: "Lactoza, Susan" }
      },
      {
        name: "Salata cu pui si avocado",
        price: "54 lei",
        desc: t(lang, "Ingrediente: pui, avocado, rosii cherry, parmezan | 360g", "Ingredients: chicken, avocado, cherry tomatoes, parmesan | 360g"),
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "118 kcal", prot: "7g", carb: "5g", fat: "8g", allergens: "Lactoza, Oua" }
      },
      {
        name: "Salata cu rata crocanta",
        price: "58 lei",
        desc: t(lang, "Ingrediente: pulpa rata, legume confiate | 360g", "Ingredients: duck leg, candied vegetables | 360g"),
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "136 kcal", prot: "6g", carb: "5g", fat: "9g", allergens: "Mustar" }
      },
      {
        name: "Salata cu portocala si broccoli",
        price: "50 lei",
        desc: t(lang, "Ingrediente: portocala, broccoli, susan, cous-cous | 280g", "Ingredients: orange, broccoli, sesame, couscous | 280g"),
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "117 kcal", prot: "3g", carb: "10g", fat: "7g", allergens: "Susan, Mustar" }
      },
    ],
    "paste": [
      {
        name: "Spaghetti aglio, olio e peperoncino",
        price: "40 lei",
        desc: t(lang, "Ingrediente: spaghetti, ulei masline, usturoi, peperoncino | 260g", "Ingredients: spaghetti, olive oil, garlic, chili | 260g"),
        image: "https://images.unsplash.com/photo-1621510456681-2330135e5871?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "384 kcal", prot: "11g", carb: "59g", fat: "11g", allergens: "Gluten" }
      },
      {
        name: "Penne Pomodoro",
        price: "41 lei",
        desc: t(lang, "Ingrediente: penne, sos de rosii San Marzano, busuioc, parmezan | 400g", "Ingredients: penne, tomato sauce, basil, parmesan | 400g"),
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "173 kcal", prot: "7g", carb: "26g", fat: "4g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Spaghetti Carbonara",
        price: "50 lei",
        desc: t(lang, "Ingrediente: spaghetti, guanciale, ou, parmezan, piper | 350g", "Ingredients: spaghetti, guanciale, egg, parmesan, pepper | 350g"),
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "421 kcal", prot: "16g", carb: "34g", fat: "24g", allergens: "Gluten, Lactoza, Oua" }
      },
      {
        name: "Orecchiette cu broccoli si gorgonzola",
        price: "50 lei",
        desc: t(lang, "Ingrediente: orecchiette, broccoli, gorgonzola, smantana | 400g", "Ingredients: orecchiette, broccoli, gorgonzola, cream | 400g"),
        image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7cf?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "315 kcal", prot: "11g", carb: "49g", fat: "8g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Rigatoni all’amatriciana",
        price: "50 lei",
        desc: t(lang, "Ingrediente: rigatoni, guanciale, sos de rosii, pecorino | 400g", "Ingredients: rigatoni, guanciale, tomato sauce, pecorino | 400g"),
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "650 kcal", prot: "22g", carb: "70g", fat: "32g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Rigatoni cu salsicia si straciatella",
        price: "54 lei",
        desc: t(lang, "Ingrediente: rigatoni, salsicia, sos de rosii, straciatella | 400g", "Ingredients: rigatoni, salsicia, tomato sauce, stracciatella | 400g"),
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "296 kcal", prot: "13g", carb: "38g", fat: "13g", allergens: "Gluten, Lactoza" }
      },
    ],
    "pizza": [
      {
        name: "Pizza Margherita",
        price: "45 lei",
        desc: t(lang, "Ingrediente: fior di latte, sos de rosii San Marzano, busuioc | 200g", "Ingredients: fior di latte, tomato sauce, basil | 200g"),
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "172 kcal", prot: "8g", carb: "25g", fat: "4g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Bufala Margherita",
        price: "50 lei",
        desc: t(lang, "Ingrediente: fior di latte, mozzarella di bufala, sos de rosii | 420g", "Ingredients: fior di latte, buffalo mozzarella, tomato sauce | 420g"),
        image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "187 kcal", prot: "8g", carb: "23g", fat: "7g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Salami Picante",
        price: "50 lei",
        desc: t(lang, "Ingrediente: fior di latte, sos de rosii, salam picant | 420g", "Ingredients: fior di latte, tomato sauce, spicy salami | 420g"),
        image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "190 kcal", prot: "10g", carb: "21g", fat: "7g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Salami Napoli",
        price: "50 lei",
        desc: t(lang, "Ingrediente: fior di latte, sos de rosii, salam Napoli | 420g", "Ingredients: fior di latte, tomato sauce, Napoli salami | 420g"),
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "204 kcal", prot: "11g", carb: "21g", fat: "8g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Gorgonzola, Ricotta e zucchini",
        price: "54 lei",
        desc: t(lang, "Ingrediente: gorgonzola, parmezan, ricotta, zucchini | 420g", "Ingredients: gorgonzola, parmesan, ricotta, zucchini | 420g"),
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "197 kcal", prot: "8g", carb: "23g", fat: "8g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Salsiccia e gorgonzola",
        price: "54 lei",
        desc: t(lang, "Ingrediente: salsiccia, gorgonzola, fior di latte | 420g", "Ingredients: salsiccia, gorgonzola, fior di latte | 420g"),
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "196 kcal", prot: "9g", carb: "21g", fat: "8g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Funghi portobello e tartuffa",
        price: "54 lei",
        desc: t(lang, "Ingrediente: portobello, trufe, ricotta, parmezan | 400g", "Ingredients: portobello, truffles, ricotta, parmesan | 400g"),
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "197 kcal", prot: "9g", carb: "23g", fat: "8g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Prosciutto crudo e rucola",
        price: "56 lei",
        desc: t(lang, "Ingrediente: prosciutto crudo, rucola, parmezan | 460g", "Ingredients: prosciutto crudo, rucola, parmesan | 460g"),
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "167 kcal", prot: "9g", carb: "21g", fat: "5g", allergens: "Gluten, Lactoza" }
      },
    ],
    "burgeri": [
      {
        name: "California Burger",
        price: "62 lei",
        desc: t(lang, "Ingrediente: carne vita, cheddar, salata iceberg, maioneza | 420g", "Ingredients: beef, cheddar, iceberg, mayo | 420g"),
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "196 kcal", prot: "7g", carb: "20g", fat: "9g", allergens: "Gluten, Lactoza, Mustar" }
      },
      {
        name: "Oklahoma Burger",
        price: "65 lei",
        desc: t(lang, "Ingrediente: carne vita, cheddar, jalapenos, bacon | 420g", "Ingredients: beef, cheddar, jalapenos, bacon | 420g"),
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "230 kcal", prot: "7g", carb: "20g", fat: "13g", allergens: "Gluten, Lactoza, Mustar" }
      },
      {
        name: "New Mexico Burger",
        price: "65 lei",
        desc: t(lang, "Ingrediente: carne vita, cheddar, salsa iute | 420g", "Ingredients: beef, cheddar, spicy salsa | 420g"),
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "227 kcal", prot: "8g", carb: "19g", fat: "13g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "The Onion Hero",
        price: "65 lei",
        desc: t(lang, "Ingrediente: carne vita, ceapa caramelizata, cheddar | 490g", "Ingredients: beef, caramelized onion, cheddar | 490g"),
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "249 kcal", prot: "8g", carb: "20g", fat: "15g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "The Harlequin",
        price: "65 lei",
        desc: t(lang, "Ingrediente: carne vita, legume gratinate, cheddar | 480g", "Ingredients: beef, vegetables, cheddar | 480g"),
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "219 kcal", prot: "9g", carb: "18g", fat: "13g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Bacon Cheeseburger",
        price: "65 lei",
        desc: t(lang, "Ingrediente: carne vita, bacon crocant, cheddar | 480g", "Ingredients: beef, crispy bacon, cheddar | 480g"),
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "215 kcal", prot: "7g", carb: "18g", fat: "12g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Le Chef",
        price: "68 lei",
        desc: t(lang, "Ingrediente: carne vita, sos special, cheddar | 400g", "Ingredients: beef, special sauce, cheddar | 400g"),
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "220 kcal", prot: "9g", carb: "18g", fat: "12g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Il Maestro",
        price: "70 lei",
        desc: t(lang, "Ingrediente: carne vita selectionata, cheddar premium | 420g", "Ingredients: selected beef, premium cheddar | 420g"),
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "211 kcal", prot: "8g", carb: "19g", fat: "11g", allergens: "Gluten, Lactoza" }
      },
    ],
    "principale": [
      {
        name: "Frigarui de vita si miel",
        price: "72 lei",
        desc: t(lang, "Ingrediente: carne vita si miel, orez salbatic, iaurt menta | 360g", "Ingredients: beef and lamb, wild rice, mint yogurt | 360g"),
        image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "230 kcal", prot: "11g", carb: "26g", fat: "9g", allergens: "Susan" }
      },
      {
        name: "Steak de conopida",
        price: "50 lei",
        desc: t(lang, "Ingrediente: conopida, naut, tahini, sumac | 310g", "Ingredients: cauliflower, chickpeas, tahini, sumac | 310g"),
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "94 kcal", prot: "3g", carb: "8g", fat: "6g", allergens: "Susan" }
      },
      {
        name: "Hummus cu falafel",
        price: "42 lei",
        desc: t(lang, "Ingrediente: naut, tahini, falafel, focaccia | 300g", "Ingredients: chickpeas, tahini, falafel, focaccia | 300g"),
        image: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "303 kcal", prot: "7g", carb: "14g", fat: "8g", allergens: "Susan, Gluten" }
      },
      {
        name: "Piept de pui la gratar",
        price: "58 lei",
        desc: t(lang, "Ingrediente: pui, cous-cous, cartof dulce | 500g", "Ingredients: chicken, couscous, sweet potato | 500g"),
        image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "221 kcal", prot: "15g", carb: "28g", fat: "5g", allergens: "Gluten, Lactoza" }
      },
      {
        name: "Vinete gratinate la cuptor",
        price: "54 lei",
        desc: t(lang, "Ingrediente: vinete, mozzarella, sos pomodoro, parmezan | 380g", "Ingredients: eggplant, mozzarella, pomodoro sauce, parmesan | 380g"),
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "129 kcal", prot: "5g", carb: "5g", fat: "10g", allergens: "Lactoza" }
      },
      {
        name: "Coaste de porc",
        price: "78 lei",
        desc: t(lang, "Ingrediente: coaste porc, sos BBQ, cartofi prajiti | 550g", "Ingredients: pork ribs, BBQ sauce, fries | 550g"),
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "187 kcal", prot: "11g", carb: "11g", fat: "11g", allergens: "Fara alergeni" }
      },
    ],
    "garnituri": [
      {
        name: "Cartofi prajiti simpli",
        price: "17 lei",
        desc: "220g",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "199 kcal", prot: "23g", carb: "19g", fat: "5g", allergens: "Fara alergeni" }
      },
      {
        name: "Cartofi prajiti cu parmezan",
        price: "20 lei",
        desc: t(lang, "Ingrediente: cartofi, parmezan, usturoi | 250g", "Ingredients: potatoes, parmesan, garlic | 250g"),
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "211 kcal", prot: "3g", carb: "21g", fat: "5g", allergens: "Lactoza" }
      },
      { isHeader: true, name: t(lang, "SOSURI", "SAUCES") },
      { name: "Maioneza de casa", price: "5 lei", desc: "50g", nutrition: { cal: "694 kcal", prot: "3g", carb: "0g", fat: "76g", allergens: "Oua, Mustar" } },
      { name: "Ketchup", price: "5 lei", desc: "50g", nutrition: { cal: "102 kcal", prot: "1g", carb: "23g", fat: "0g", allergens: "Fara alergeni" } },
      { name: "Sos BBQ", price: "5 lei", desc: "50g", nutrition: { cal: "123 kcal", prot: "1g", carb: "29g", fat: "0g", allergens: "Fara alergeni" } },
    ],
    "desert": [
      {
        name: "Panacotta",
        price: "29 lei",
        desc: t(lang, "Ingrediente: smantana, vanilie, jeleu fructe | 130g", "Ingredients: cream, vanilla, fruit jelly | 130g"),
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "258 kcal", prot: "2g", carb: "15g", fat: "21g", allergens: "Lactoza" }
      },
      {
        name: "Tiramisu",
        price: "29 lei",
        desc: t(lang, "Ingrediente: piscoturi, cafea, mascarpone | 130g", "Ingredients: ladyfingers, coffee, mascarpone | 130g"),
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "334 kcal", prot: "6g", carb: "31g", fat: "20g", allergens: "Gluten, Lactoza, Oua" }
      },
      {
        name: "Tort cu ciocolata si migdale",
        price: "29 lei",
        desc: t(lang, "Ingrediente: ciocolata, migdale, cacao | 130g", "Ingredients: chocolate, almonds, cocoa | 130g"),
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
        nutrition: { cal: "354 kcal", prot: "6g", carb: "17g", fat: "25g", allergens: "Gluten, Lactoza, Oua, Nuci" }
      },
    ],
    "inghetata": [
        { name: "Capsuni", price: "18 lei", desc: "60g", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80" },
        { name: "Zmeura si iaurt", price: "18 lei", desc: "60g", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80" },
        { name: "Mango & Fructul pasiunii", price: "18 lei", desc: "60g", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80" },
        { name: "Fistic si ciocolata alba", price: "18 lei", desc: "60g", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80" },
        { name: "Ciocolata gianduja", price: "18 lei", desc: "60g", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80" },
    ],
    "bauturi": drinksData,
  };
};
