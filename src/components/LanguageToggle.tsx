"use client";

import { useState } from "react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const languages: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "EN" },
  { code: "lg", label: "Luganda", native: "LG" },
  { code: "sw", label: "Swahili", native: "SW" },
];

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-800 hover:border-yellow-500/30 transition-all"
      >
        <Globe className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium text-slate-300">
          {languages.find((l) => l.code === language)?.native}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 bg-slate-800/90 backdrop-blur border border-slate-700/50 rounded-lg shadow-xl overflow-hidden z-50 min-w-[140px]"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-slate-700/50 transition-colors flex items-center justify-between ${
                  language === lang.code
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "text-slate-300"
                }`}
              >
                <span className="text-sm">{lang.native}</span>
                <span className="text-xs text-slate-500">{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
