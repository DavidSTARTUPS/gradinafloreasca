const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// Replacements
const replacements = [
  [/S\.C\. REFRESH RESTAURANT S\.R\.L\./g, 'Grădina Floreasca'],
  [/CUI: RO45698712 \| Reg: J40\/1234\/2022/g, ''],
  [/Str\. Johann Sebastian Bach 3/g, 'Bulevardul Mircea Eliade 16'],
  [/020201 București/g, '014192 București'],
  [/Tel: \+40 771 189 347/g, 'Tel: 0755 085 967'],
  [/\+40 771 189 347/g, '0755 085 967'],
  [/contact@refresh-restaurant\.ro/g, 'contact@gradinafloreasca.ro'],
  [/Lu, Ma, Sâ, Du: 10:00 - 22:00/g, 'Zilnic: 10:00 - 23:30'],
  [/Mo, Tu, Sa, Su: 10:00 - 22:00/g, 'Daily: 10:00 - 23:30'],
  [/Mi - Vi: 10:00 - 22:30/g, ''],
  [/We - Fr: 10:00 - 22:30/g, ''],
  [/#REFRESH/g, 'Grădina Floreasca'],
  [/Refresh and make it happen!/g, 'Global salads, handhelds & mains presented in a stylish alfresco cafe in a park, set around a pool.'],
  [/Design cald\. Gust autentic\. Experiența perfectă în Floreasca\./g, 'Salate internaționale, preparate de mână și feluri principale prezentate într-o cafenea în aer liber elegantă într-un parc, cu piscină.'],
  [/Warm design\. Authentic taste\. The perfect Floreasca experience\./g, 'Global salads, handhelds & mains presented in a stylish alfresco cafe in a park, set around a pool.'],
  [/Refresh Sandwich/g, 'Grădina Floreasca Sandwich'],
  [/https:\/\/www\.google\.com\/maps\/search\/REFRESH\+RESTAURANT\+PIZZA\+Bucuresti\/\/\?hl=en/g, 'https://www.google.com/maps/search/Gradina+Floreasca+Bucuresti//?hl=en']
];

for (const [regex, replacement] of replacements) {
  content = content.replace(regex, replacement);
}

// Ensure directories exist
if (!fs.existsSync(path.join(__dirname, 'src', 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'src', 'data'));
}
if (!fs.existsSync(path.join(__dirname, 'src', 'components'))) {
  fs.mkdirSync(path.join(__dirname, 'src', 'components'));
}

// Splitting logic
// We'll use regex to extract blocks based on comments

const dataRegex = /\/\/ --- HELPER TRADUCERE ---[\s\S]*?(?=\/\/ --- COMPONENTA PREPARAT)/;
const dataMatch = content.match(dataRegex);

const menuItemRegex = /\/\/ --- COMPONENTA PREPARAT \(Acordeon Optimizat\) ---[\s\S]*?(?=\/\/ --- COMPONENTA FOOTER LEGAL)/;
const menuItemMatch = content.match(menuItemRegex);

const footerRegex = /\/\/ --- COMPONENTA FOOTER LEGAL ---[\s\S]*?(?=\/\/ --- COMPONENTA REZERVARE)/;
const footerMatch = content.match(footerRegex);

const reservationRegex = /\/\/ --- COMPONENTA REZERVARE \(Bottom Sheet iOS style\) ---[\s\S]*?(?=\/\/ --- COMPONENTA FILTRE DIETETICE)/;
const reservationMatch = content.match(reservationRegex);

const dietaryRegex = /\/\/ --- COMPONENTA FILTRE DIETETICE \(Modern Minimalist\) ---[\s\S]*?(?=\/\/ --- APLICAȚIA PRINCIPALĂ ---)/;
const dietaryMatch = content.match(dietaryRegex);

if (dataMatch && menuItemMatch && footerMatch && reservationMatch && dietaryMatch) {
  // Write menuData.ts
  const menuDataContent = `
${dataMatch[0].replace('const t =', 'export const t =').replace('const getMenuCategories', 'export const getMenuCategories').replace('const getMenuData', 'export const getMenuData')}
  `;
  fs.writeFileSync(path.join(__dirname, 'src', 'data', 'menuData.ts'), menuDataContent.trim() + '\n');

  // Write MenuItemCard.tsx
  const menuItemContent = `
import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { t } from '../data/menuData';

${menuItemMatch[0].replace('const MenuItemCard', 'export const MenuItemCard')}
  `;
  fs.writeFileSync(path.join(__dirname, 'src', 'components', 'MenuItemCard.tsx'), menuItemContent.trim() + '\n');

  // Write LegalFooter.tsx
  const footerContent = `
import React from 'react';
import { t } from '../data/menuData';

${footerMatch[0].replace('const LegalFooter', 'export const LegalFooter')}
  `;
  fs.writeFileSync(path.join(__dirname, 'src', 'components', 'LegalFooter.tsx'), footerContent.trim() + '\n');

  // Write ReservationModal.tsx
  const reservationContent = `
import React, { useState, useEffect } from 'react';
import { X, Users, CalendarCheck, Clock, Utensils, Check, ArrowRight, Loader2 } from 'lucide-react';
import { t } from '../data/menuData';

${reservationMatch[0].replace('const ReservationModal', 'export const ReservationModal')}
  `;
  fs.writeFileSync(path.join(__dirname, 'src', 'components', 'ReservationModal.tsx'), reservationContent.trim() + '\n');

  // Write DietaryFilterModal.tsx
  const dietaryContent = `
import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { t } from '../data/menuData';

${dietaryMatch[0].replace('const DietaryFilterModal', 'export const DietaryFilterModal')}
  `;
  fs.writeFileSync(path.join(__dirname, 'src', 'components', 'DietaryFilterModal.tsx'), dietaryContent.trim() + '\n');

  // Update App.tsx
  let appContent = content.replace(dataMatch[0], '')
                          .replace(menuItemMatch[0], '')
                          .replace(footerMatch[0], '')
                          .replace(reservationMatch[0], '')
                          .replace(dietaryMatch[0], '');

  // Add imports to App.tsx
  const importsToAdd = `
import { getMenuCategories, getMenuData, t } from './data/menuData';
import { MenuItemCard } from './components/MenuItemCard';
import { LegalFooter } from './components/LegalFooter';
import { ReservationModal } from './components/ReservationModal';
import { DietaryFilterModal } from './components/DietaryFilterModal';
`;
  
  appContent = appContent.replace('import { supabase } from "./supabaseClient";', 'import { supabase } from "./supabaseClient";\n' + importsToAdd);

  fs.writeFileSync(appPath, appContent);
  console.log("Splitting and rebranding completed successfully.");
} else {
  console.log("Could not find all blocks to split. Rebranding only applied.");
  fs.writeFileSync(appPath, content);
}
