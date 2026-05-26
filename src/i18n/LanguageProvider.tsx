import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dictionary, type Dict, type Lang } from "./dictionary";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("cs");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("ie-lang") : null;
    if (saved === "cs" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ie-lang", l);
      document.documentElement.lang = l;
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dictionary[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
