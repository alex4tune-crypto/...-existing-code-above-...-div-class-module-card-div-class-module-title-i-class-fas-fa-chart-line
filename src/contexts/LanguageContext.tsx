"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Language = "en" | "lg" | "sw";

interface Translations {
  [key: string]: {
    en: string;
    lg: string;
    sw: string;
  };
}

const translations: Translations = {
  // Navigation
  "nav.overview": { en: "Overview", lg: "Olukulu", sw: "Muhtasari" },
  "nav.retail": { en: "Retail", lg: "Ebikole", sw: "Biashara" },
  "nav.telecom": { en: "Telecom", lg: "Tekekoomoomo", sw: "Mawasiliano" },
  "nav.finance": { en: "Finance", lg: "Ekifaananyi", sw: "Fedha" },
  "nav.agriculture": { en: "Agriculture", lg: "Okulima", sw: "Kilimo" },
  "nav.pricing": { en: "Pricing", lg: "Ebifa", sw: "Bei" },
  "nav.sentinel": { en: "Sentinel Portal", lg: "Ebifo bya Sentinel", sw: "Sentinel Portal" },

  // Dashboard
  "dashboard.title": { en: "Uganda Business Intelligence", lg: "Obwereza bw'ebigambo bya Uganda", sw: "Uchambuzi wa Biashara ya Uganda" },
  "dashboard.subtitle": { en: "Real-time market sentiment analysis and business insights across key Ugandan industries.", lg: "Okukyusakyusa kw'ebigambo by'ebishaka n'ebikwata ku bigambo mu Uganda.", sw: "Uchambuzi wa hisia za soko na maarifa ya biashara katika sekta muhimu za Uganda." },
  "dashboard.sentinelActive": { en: "SENTINEL ACTIVE", lg: "SENTINEL AKOLA", sw: "SENTINEL INAFANYA KAZI" },
  "dashboard.sectorOverview": { en: "Sector Overview", lg: "Okubona Ebise", sw: "Muhtasari ya Sekta" },

  // Sectors
  "sector.retail": { en: "Retail", lg: "Ebikole", sw: "Biashara" },
  "sector.retailDesc": { en: "Supermarkets, shops, and e-commerce market analysis", lg: "Ebisoko, essoka, n'ekigambululo ky'ebishaka", sw: "Maduka, duka, na uchambuzi wa soko la mtandao" },
  "sector.telecom": { en: "Telecom", lg: "Tekekoomoomo", sw: "Mawasiliano" },
  "sector.telecomDesc": { en: "MTN, Airtel, and internet provider insights", lg: "MTN, Airtel, n'aba Provider b'Internet", sw: "MTN, Airtel, na maelezo ya watoa huduma ya intaneti" },
  "sector.finance": { en: "Finance", lg: "Ekifaananyi", sw: "Fedha" },
  "sector.financeDesc": { en: "Banking, insurance, and microfinance trends", lg: "Amabanka, obukodyo, n'ekigambululo ky'ensigalire", sw: "Benki, bima, na miongo ya microfinance" },
  "sector.agriculture": { en: "Agriculture", lg: "Okulima", sw: "Kilimo" },
  "sector.agricultureDesc": { en: "Crops, livestock, and agribusiness intelligence", lg: "Ebirimu, ente, n'ebikolwa eby'okulima", sw: "Mazao, wanyama, na ufahamu wa kilimo" },

  // Sentiment
  "sentiment.positive": { en: "Positive", lg: "Positiv", sw: "Chanya" },
  "sentiment.neutral": { en: "Neutral", lg: "Muppy", sw: "Toifu" },
  "sentiment.negative": { en: "Negative", lg: "Negativ", sw: "Hasi" },
  "sentiment.moderate": { en: "Moderate", lg: "Muppy", sw: "Wastani" },

  // Stats
  "stats.articles": { en: "Articles Analyzed", lg: "Ebyawandikibwa", sw: "Makala Zilivyochambuliwa" },
  "stats.users": { en: "Active Users", lg: "Abakozesa", sw: "Watumiaji Wenye Nguvu" },
  "stats.reports": { en: "Reports Generated", lg: "Ebyagenerated", sw: "Ripoti Zilizotengenezwa" },

  // Hero Section
  "hero.gdpSurge": { en: "6.3% GDP Surge", lg: "6.3% okwongerera GDP", sw: "Ongezeko la 6.3% la GDP" },
  "hero.subtitle": { en: "Uganda's fastest-growing economic sectors are signaling unprecedented opportunities for investors.", lg: "Ebitundutundubw'eby Uganda bye kigendererera n'ebikwata ku bigambululo.", sw: "Sekta za uchumi za Uganda zinazokua kwa kasi zinaonyesha fursa ambazo hazijawahi kuonekana kwa wawekezaji." },
  "hero.cta": { en: "Explore Market Intelligence", lg: "Laba Ebikwata ku Bigambo", sw: "Chapisha Uchambuzi wa Soko" },
  "hero.ctaSecondary": { en: "View Pricing", lg: "Laba Ebifa", sw: "Tanza Bei" },

  // Sentinel Portal
  "sentinel.title": { en: "Sentinel Command Center", lg: "Ettoolima ya Sentinel", sw: "Kituo cha Command cha Sentinel" },
  "sentinel.network": { en: "Network Resilience", lg: "Okukyusakyusa kw'Neti", sw: "Uwezo wa Mtandao" },
  "sentinel.resources": { en: "Resource Audit", lg: "Okulonda Ebiri", sw: "Ukaguzi wa Raslimali" },
  "sentinel.password": { en: "Enter Sentinel Access Code", lg: "Wandika koodi ya Sentinel", sw: "Weka Kanuni ya Ufikiaji wa Sentinel" },
  "sentinel.unauthorized": { en: "Unauthorized Access", lg: "Okuja okutalaga", sw: "Ufikiaji Wasioruhusiwa" },

  // Common
  "common.loading": { en: "Loading...", lg: "Nkyusakyusag...", sw: "Inapakia..." },
  "common.error": { en: "Error", lg: "Ekikole", sw: "Hitilafu" },
  "common.retry": { en: "Retry", lg: "Gezawo", sw: "Jaribu tena" },
  "common.secure": { en: "Secure Connection", lg: "Okukwatagana okusemberera", sw: "Muunganisho Salama" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = useCallback(
    (key: string): string => {
      const translation = translations[key];
      if (!translation) {
        console.warn(`Missing translation for key: ${key}`);
        return key;
      }
      return translation[language] || translation.en || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
